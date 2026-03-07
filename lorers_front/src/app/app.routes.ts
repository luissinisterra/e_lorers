import { Routes } from '@angular/router';
import { EventListComponent } from './features/events/components/event-list/event-list';
import { CreateEventComponent } from './features/events/components/create-event/create-event';
import { LoginComponent } from './features/events/components/login/login';
import { RegisterComponent } from './features/events/components/register/register';

export const routes: Routes = [
  { path: '',           component: LoginComponent },
  { path: 'login',      component: LoginComponent },
  { path: 'register',   component: RegisterComponent },
  { path: 'events',     component: EventListComponent },
  { path: 'events/new', component: CreateEventComponent },
];
