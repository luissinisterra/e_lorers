import { Routes } from '@angular/router';
import { EventListComponent } from './features/events/components/event-list/event-list';
import { CreateEventComponent } from './features/events/components/create-event/create-event';

export const routes: Routes = [
  { path: '',          redirectTo: 'events', pathMatch: 'full' },
  { path: 'events',    component: EventListComponent },
  { path: 'events/new', component: CreateEventComponent },
];
