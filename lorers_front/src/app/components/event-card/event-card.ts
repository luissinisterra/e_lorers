import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from '../../services/event.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.html',
  styleUrls: ['./event-card.css']
})
export class EventCardComponent {

  @Input({ required: true }) event!: EventResponse;
  @Output() eventClick = new EventEmitter<number>();

  onClick(): void {
    this.eventClick.emit(this.event.id_event);
  }

  // ── Status ────────────────────────────────────────────────────────────────

  get isOngoing(): boolean {
    const now = new Date();
    return new Date(this.event.start_time) <= now && new Date(this.event.end_time) >= now;
  }

  get isUpcoming(): boolean {
    return new Date(this.event.start_time) > new Date();
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

  // ── Date formatting ───────────────────────────────────────────────────────

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  get dateRange(): string {
    const s = new Date(this.event.start_time);
    const e = new Date(this.event.end_time);

    if (s.toDateString() === e.toDateString()) {
      return `${this.formatDate(this.event.start_time)} · ${this.formatTime(this.event.start_time)} – ${this.formatTime(this.event.end_time)}`;
    }
    return `${this.formatDate(this.event.start_time)} – ${this.formatDate(this.event.end_time)}`;
  }

  get shortDescription(): string {
    const desc = this.event.description ?? '';
    return desc.length > 100 ? desc.slice(0, 100) + '...' : desc;
  }
}
