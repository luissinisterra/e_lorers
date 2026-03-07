import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventService, EventResponse, ParticipantRecord } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit {

  event: EventResponse | null = null;
  participants: ParticipantRecord[] = [];
  likeCount = 0;
  userLiked = false;
  isParticipant = false;
  isCreator = false;
  currentUserId: number | null = null;

  isLoading = true;
  loadError: string | null = null;
  likeLoading = false;
  joinLoading = false;
  deleteConfirm = false;
  deleteLoading = false;

  private eventId!: number;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  // ── Carga ─────────────────────────────────────────────────────────────────

  loadAll(): void {
    this.isLoading = true;
    this.loadError = null;

    forkJoin({
      event:       this.eventService.getEventById(this.eventId),
      participants: this.eventService.getParticipants(this.eventId),
      liked:       this.eventService.hasLiked(this.eventId),
    }).subscribe({
      next: ({ event, participants, liked }) => {
        this.event        = event;
        this.participants = participants;
        this.likeCount    = event.likes;
        this.userLiked    = liked.liked;
        this.isCreator    = event.creator_id === this.currentUserId;
        this.isParticipant = participants.some(p => p.id_user === this.currentUserId);
        this.isLoading    = false;
      },
      error: (err) => {
        this.loadError = err.error?.message || 'No se pudo cargar el evento.';
        this.isLoading = false;
      }
    });
  }

  // ── Like / Unlike ─────────────────────────────────────────────────────────

  toggleLike(): void {
    if (this.likeLoading) return;
    this.likeLoading = true;

    const request$ = this.userLiked
      ? this.eventService.unlikeEvent(this.eventId)
      : this.eventService.likeEvent(this.eventId);

    request$.subscribe({
      next: (updatedEvent) => {
        this.likeCount  = updatedEvent.likes;
        this.userLiked  = !this.userLiked;
        this.likeLoading = false;
      },
      error: () => { this.likeLoading = false; }
    });
  }

  // ── Join / Leave ──────────────────────────────────────────────────────────

  toggleParticipation(): void {
    if (this.joinLoading) return;
    this.joinLoading = true;

    if (this.isParticipant) {
      this.eventService.leaveEvent(this.eventId).subscribe({
        next: () => {
          this.isParticipant = false;
          this.participants = this.participants.filter(p => p.id_user !== this.currentUserId);
          this.joinLoading = false;
        },
        error: () => { this.joinLoading = false; }
      });
    } else {
      this.eventService.joinEvent(this.eventId).subscribe({
        next: (record) => {
          this.isParticipant = true;
          this.participants = [...this.participants, record];
          this.joinLoading = false;
        },
        error: () => { this.joinLoading = false; }
      });
    }
  }

  // ── Editar ────────────────────────────────────────────────────────────────

  goToEdit(): void {
    this.router.navigate(['/events', this.eventId, 'edit']);
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────

  confirmDelete(): void {
    this.deleteConfirm = true;
  }

  cancelDelete(): void {
    this.deleteConfirm = false;
  }

  executeDelete(): void {
    this.deleteLoading = true;
    this.eventService.deleteEvent(this.eventId).subscribe({
      next: () => this.router.navigate(['/events']),
      error: () => { this.deleteLoading = false; }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  goBack(): void {
    this.router.navigate(['/events']);
  }

  get isUpcoming(): boolean {
    return !!this.event && new Date(this.event.start_time) > new Date();
  }

  get isOngoing(): boolean {
    if (!this.event) return false;
    const now = new Date();
    return new Date(this.event.start_time) <= now && new Date(this.event.end_time) >= now;
  }

  get statusLabel(): string {
    if (this.isOngoing)  return 'EN CURSO';
    if (this.isUpcoming) return 'PRÓXIMO';
    return 'FINALIZADO';
  }

  get statusClass(): string {
    if (this.isOngoing)  return 'badge--ongoing';
    if (this.isUpcoming) return 'badge--upcoming';
    return 'badge--past';
  }

  get isFull(): boolean {
    if (!this.event?.max_participants) return false;
    return this.participants.length >= this.event.max_participants;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit'
    });
  }
}
