import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { EventService, EventResponse } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { EventCardComponent } from '../event-card/event-card';

type TabType = 'created' | 'joined';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './my-events.html',
  styleUrls: ['./my-events.css']
})
export class MyEventsComponent implements OnInit {

  activeTab: TabType = 'created';
  createdEvents: EventResponse[] = [];
  joinedEvents: EventResponse[] = [];

  isLoading = true;
  loadError: string | null = null;

  private userId!: number;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.authService.getCurrentUserId();
    if (!id) { this.router.navigate(['/login']); return; }
    this.userId = id;
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.loadError = null;

    // Carga en paralelo: eventos creados + todos los eventos para filtrar los unidos
    forkJoin({
      created:      this.eventService.getEventsByCreator(this.userId),
      participation: this.eventService.getEventsByUser(this.userId),
      allEvents:    this.eventService.getEvents(),
    }).subscribe({
      next: ({ created, participation, allEvents }) => {
        this.createdEvents = created;

        // Filtramos los eventos a los que el usuario se unió (excluyendo los que creó)
        const joinedIds = new Set(participation.map(p => p.id_event));
        this.joinedEvents = allEvents.filter(
          e => joinedIds.has(e.id_event) && e.creator_id !== this.userId
        );

        this.isLoading = false;
      },
      error: (err) => {
        this.loadError = err.error?.message || 'No se pudieron cargar tus eventos.';
        this.isLoading = false;
      }
    });
  }

  setTab(tab: TabType): void {
    this.activeTab = tab;
  }

  viewEvent(id: number): void {
    this.router.navigate(['/events', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/events/new']);
  }

  get activeEvents(): EventResponse[] {
    return this.activeTab === 'created' ? this.createdEvents : this.joinedEvents;
  }

  trackById(_: number, event: EventResponse): number {
    return event.id_event;
  }
}
