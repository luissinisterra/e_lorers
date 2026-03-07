import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// ── Payload shape that matches AuthService.login() ────────────────────────
export interface LoginPayload {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading = false;
  authError: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // Inject your AuthService here when ready:
    // private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // Clear server error whenever the user edits the form
    this.loginForm.valueChanges.subscribe(() => {
      if (this.authError) this.authError = null;
    });
  }

  // ── Field error helper ────────────────────────────────────────────────────

  hasError(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  // ── Toggle password visibility ────────────────────────────────────────────

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ── Payload builder ───────────────────────────────────────────────────────

  buildPayload(): LoginPayload {
    const v = this.loginForm.value;
    return {
      username: v.username.trim(),
      password: v.password,
    };
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authError = null;
    const payload = this.buildPayload();

    console.log('Payload enviado al backend:', payload);

    /* ── Replace the setTimeout below with your real API call ──────────────
    this.authService.login(payload.username, payload.password).subscribe({
      next: (token: string) => {
        // Store token (e.g. localStorage, a TokenService, etc.)
        // localStorage.setItem('token', token);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.authError =
          err?.error?.message === 'User not found'      ? 'Usuario no encontrado.' :
          err?.error?.message === 'Invalid credentials' ? 'Contraseña incorrecta.' :
          'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    });
    ─────────────────────────────────────────────────────────────────────── */

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/']);
    }, 1500);
  }
}