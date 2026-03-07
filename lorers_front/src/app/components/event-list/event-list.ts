import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService, EventResponse } from '../../services/event.service';
import { EventCardComponent } from '../event-card/event-card';

type FilterType = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
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

  trackById(_: number, event: EventResponse): number {
    return event.id_event;
  }
}
