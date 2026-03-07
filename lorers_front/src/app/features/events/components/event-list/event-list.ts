import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService, EventResponse } from '../../services/event.service';

type FilterType = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit {

  events: EventResponse[] = [];
  filteredEvents: EventResponse[] = [];
  isLoading = true;
  loadError: string | null = null;
  activeFilter: FilterType = 'all';
  searchQuery = '';

  readonly filters: { key: FilterType; label: string }[] = [
    { key: 'all',      label: 'Todos'    },
    { key: 'upcoming', label: 'Próximos' },
    { key: 'past',     label: 'Pasados'  },
  ];

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.loadError = null;

    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.loadError = err.error?.message || 'No se pudieron cargar los eventos.';
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  onSearch(value: string): void {
    this.searchQuery = value.toLowerCase().trim();
    this.applyFilter();
  }

  private applyFilter(): void {
    const now = new Date();
    let result = this.events;

    if (this.activeFilter === 'upcoming') {
      result = result.filter(e => new Date(e.start_time) >= now);
    } else if (this.activeFilter === 'past') {
      result = result.filter(e => new Date(e.end_time) < now);
    }

    if (this.searchQuery) {
      result = result.filter(e =>
        e.name.toLowerCase().includes(this.searchQuery) ||
        (e.description ?? '').toLowerCase().includes(this.searchQuery) ||
        e.address.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredEvents = result;
  }

  goToCreate(): void {
    this.router.navigate(['/events/new']);
  }

  viewEvent(id: number): void {
    this.router.navigate(['/events', id]);
  }

  isUpcoming(event: EventResponse): boolean {
    return new Date(event.start_time) > new Date();
  }

  isOngoing(event: EventResponse): boolean {
    const now = new Date();
    return new Date(event.start_time) <= now && new Date(event.end_time) >= now;
  }

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

  formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const sameDay = s.toDateString() === e.toDateString();

    if (sameDay) {
      return `${this.formatDate(start)} · ${this.formatTime(start)} – ${this.formatTime(end)}`;
    }
    return `${this.formatDate(start)} – ${this.formatDate(end)}`;
  }

  getStatusLabel(event: EventResponse): string {
    if (this.isOngoing(event))  return 'EN CURSO';
    if (this.isUpcoming(event)) return 'PRÓXIMO';
    return 'FINALIZADO';
  }

  getStatusClass(event: EventResponse): string {
    if (this.isOngoing(event))  return 'badge--ongoing';
    if (this.isUpcoming(event)) return 'badge--upcoming';
    return 'badge--past';
  }

  trackById(_: number, event: EventResponse): number {
    return event.id_event;
  }
}
