import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, CreateEventBody } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css']
})
export class EventFormComponent implements OnInit {

  eventForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  isSubmitting = false;
  submitted = false;
  gettingLocation = false;
  today = '';
  dateRangeError = false;
  createdEventId: number | null = null;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];

    this.eventForm = this.fb.group({
      name:             ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description:      [null],

      startDate:        ['', Validators.required],
      startTime:        ['', Validators.required],
      endDate:          ['', Validators.required],
      endTime:          ['', Validators.required],
      address:          ['', Validators.required],
      latitude:         [null, [Validators.min(-90),  Validators.max(90)]],
      longitude:        [null, [Validators.min(-180), Validators.max(180)]],

      max_participants: [null, [Validators.min(1), Validators.max(100000)]],
    });
  }

  // ── Progress ──────────────────────────────────────────────────────────────

  get progressPercent(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  nextStep(): void {
    if (this.currentStep === 2) {
      this.dateRangeError = !this.isDateRangeValid();
      if (this.dateRangeError) return;
    }
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  // ── Validation ────────────────────────────────────────────────────────────

  hasError(field: string): boolean {
    const ctrl = this.eventForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isStep1Valid(): boolean {
    return this.eventForm.get('name')!.valid;
  }

  isStep2Valid(): boolean {
    const { startDate, startTime, endDate, endTime, address, latitude, longitude } = this.eventForm.controls;
    if (!startDate.valid || !startTime.valid || !endDate.valid || !endTime.valid || !address.valid) return false;
    if (latitude.value !== null && latitude.invalid) return false;
    if (longitude.value !== null && longitude.invalid) return false;
    return this.isDateRangeValid();
  }

  private isDateRangeValid(): boolean {
    const sd = this.eventForm.get('startDate')?.value;
    const st = this.eventForm.get('startTime')?.value;
    const ed = this.eventForm.get('endDate')?.value;
    const et = this.eventForm.get('endTime')?.value;
    if (!sd || !st || !ed || !et) return true;
    return new Date(`${sd}T${st}`) < new Date(`${ed}T${et}`);
  }

  // ── Geolocation ───────────────────────────────────────────────────────────

  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    this.gettingLocation = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.eventForm.patchValue({
          latitude:  parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
        });
        this.gettingLocation = false;
      },
      () => {
        alert('No se pudo obtener la ubicación. Verifica los permisos del navegador.');
        this.gettingLocation = false;
      }
    );
  }

  // ── Date helpers ──────────────────────────────────────────────────────────

  formatDateTime(dateStr: string, timeStr: string): string {
    if (!dateStr) return '';
    const date = new Date(`${dateStr}T${timeStr || '00:00'}`);
    return date.toLocaleString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  // ── Payload builder ───────────────────────────────────────────────────────

  private buildPayload(): CreateEventBody {
    const v = this.eventForm.value;
    return {
      name:             v.name.trim(),
      description:      v.description?.trim() || null,
      max_participants: v.max_participants ? Number(v.max_participants) : null,
      start_time:       new Date(`${v.startDate}T${v.startTime}`).toISOString(),
      end_time:         new Date(`${v.endDate}T${v.endTime}`).toISOString(),
      address:          v.address.trim(),
      latitude:         v.latitude  !== null && v.latitude  !== '' ? Number(v.latitude)  : null,
      longitude:        v.longitude !== null && v.longitude !== '' ? Number(v.longitude) : null,
    };
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.eventForm.invalid || this.isSubmitting) return;
    if (!this.isDateRangeValid()) {
      this.dateRangeError = true;
      this.currentStep = 2;
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const payload = this.buildPayload();

    this.eventService.createEvent(payload).subscribe({
      next: (event) => {
        this.createdEventId = event.id_event;
        this.isSubmitting = false;
        this.submitted = true;
      },
      error: (err) => {
        this.submitError = err.error?.message || 'Ocurrió un error al crear el evento. Inténtalo de nuevo.';
        this.isSubmitting = false;
      }
    });
  }

  // ── Post-submit actions ───────────────────────────────────────────────────

  viewEvent(): void {
    if (this.createdEventId) {
      this.router.navigate(['/events', this.createdEventId]);
    } else {
      this.router.navigate(['/events']);
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.currentStep = 1;
    this.dateRangeError = false;
    this.submitError = null;
    this.createdEventId = null;
    this.eventForm.reset();
  }
}
