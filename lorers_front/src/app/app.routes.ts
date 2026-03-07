import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { EventListComponent } from './components/event-list/event-list';
import { EventFormComponent } from './components/event-form/event-form';
import { EventDetailComponent } from './components/event-detail/event-detail';
import { MyEventsComponent } from './components/my-events/my-events';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
  // Rutas públicas
  { path: '',          redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',     component: LoginComponent },
  { path: 'register',  component: RegisterComponent },

  // Rutas protegidas
  { path: 'events',            component: EventListComponent,   canActivate: [authGuard] },
  { path: 'events/new',        component: EventFormComponent,   canActivate: [authGuard] },
  { path: 'events/:id',        component: EventDetailComponent, canActivate: [authGuard] },
  { path: 'events/:id/edit',   component: EventFormComponent,   canActivate: [authGuard] },
  { path: 'my-events',         component: MyEventsComponent,    canActivate: [authGuard] },

  // 404 — debe ir al final
  { path: '**', component: NotFoundComponent },
];
