import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, Validators,
  ReactiveFormsModule, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// ── Payload shape that matches AuthService.register() ─────────────────────
export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
}

// ── Custom validator: passwords must match ─────────────────────────────────
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm  = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm
    ? { passwordMismatch: true }
    : null;
}

// ── Password strength helper ───────────────────────────────────────────────
export interface PasswordStrength {
  percent: number;
  level:   'weak' | 'fair' | 'strong' | 'great';
  label:   string;
}

function calcPasswordStrength(password: string): PasswordStrength {
  if (!password) return { percent: 0, level: 'weak', label: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { percent: 25,  level: 'weak',   label: 'Débil' };
  if (score === 2) return { percent: 50,  level: 'fair',   label: 'Regular' };
  if (score === 3) return { percent: 75,  level: 'strong', label: 'Fuerte' };
  return              { percent: 100, level: 'great',  label: '¡Muy fuerte!' };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  isLoading   = false;
  serverError: string | null = null;
  showPassword = false;
  showConfirm  = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name:            ['', [Validators.required, Validators.minLength(2)]],
        username:        ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\w+$/)]],
        password:        ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );

    // Clear server error whenever the user edits the form
    this.registerForm.valueChanges.subscribe(() => {
      if (this.serverError) this.serverError = null;
    });
  }

  // ── Field error helper ────────────────────────────────────────────────────

  hasError(field: string): boolean {
    const ctrl = this.registerForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  // ── Password strength ─────────────────────────────────────────────────────

  get passwordStrength(): PasswordStrength {
    return calcPasswordStrength(this.registerForm.get('password')?.value ?? '');
  }

  // ── Toggle visibility ─────────────────────────────────────────────────────

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirm():  void { this.showConfirm  = !this.showConfirm;  }

  // ── Payload builder ───────────────────────────────────────────────────────

  buildPayload(): RegisterPayload {
    const v = this.registerForm.value;
    return {
      name:     v.name.trim(),
      username: v.username.trim(),
      password: v.password,
    };
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverError = null;
    const payload = this.buildPayload();

    console.log('Payload enviado al backend:', payload);

    this.authService.register(payload.name, payload.username, payload.password).subscribe({
      next: (res: { token: string }) => {
        this.isLoading = false;
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.isLoading = false;
        this.serverError =
          err?.error?.message === 'User already exists'
            ? 'Ese nombre de usuario ya está en uso. Elige otro.'
            : 'Error al crear la cuenta. Inténtalo de nuevo.';
      }
    });
  }
}