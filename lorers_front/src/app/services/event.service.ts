import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:3000';

export interface EventResponse {
  id_event: number;
  name: string;
  description: string | null;
  creator_id: number;
  likes: number;
  max_participants: number | null;
  start_time: string;
  end_time: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventBody {
  name: string;
  description: string | null;
  max_participants: number | null;
  start_time: string;
  end_time: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface ParticipantRecord {
  id_event: number;
  id_user: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  getEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${API_URL}/events`, { headers: this.headers });
  }

  getEventById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${API_URL}/events/${id}`, { headers: this.headers });
  }

  getEventsByCreator(creatorId: number): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${API_URL}/events/creator/${creatorId}`, { headers: this.headers });
  }

  createEvent(body: CreateEventBody): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${API_URL}/events`, body, { headers: this.headers });
  }

  updateEvent(id: number, body: Partial<CreateEventBody>): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${API_URL}/events/${id}`, body, { headers: this.headers });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/events/${id}`, { headers: this.headers });
  }

  // ── Likes ─────────────────────────────────────────────────────────────────

  getLikes(eventId: number): Observable<{ id_event: number; id_user: number }[]> {
    return this.http.get<{ id_event: number; id_user: number }[]>(
      `${API_URL}/events/${eventId}/likes`, { headers: this.headers }
    );
  }

  hasLiked(eventId: number): Observable<{ liked: boolean }> {
    return this.http.get<{ liked: boolean }>(
      `${API_URL}/events/${eventId}/likes/me`, { headers: this.headers }
    );
  }

  likeEvent(eventId: number): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      `${API_URL}/events/${eventId}/like`, {}, { headers: this.headers }
    );
  }

  unlikeEvent(eventId: number): Observable<EventResponse> {
    return this.http.delete<EventResponse>(
      `${API_URL}/events/${eventId}/unlike`, { headers: this.headers }
    );
  }

  // ── Participantes ─────────────────────────────────────────────────────────

  getParticipants(eventId: number): Observable<ParticipantRecord[]> {
    return this.http.get<ParticipantRecord[]>(
      `${API_URL}/events/${eventId}/participants`, { headers: this.headers }
    );
  }

  joinEvent(eventId: number): Observable<ParticipantRecord> {
    return this.http.post<ParticipantRecord>(
      `${API_URL}/events/${eventId}/join`, {}, { headers: this.headers }
    );
  }

  leaveEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(
      `${API_URL}/events/${eventId}/leave`, { headers: this.headers }
    );
  }

  getEventsByUser(userId: number): Observable<ParticipantRecord[]> {
    return this.http.get<ParticipantRecord[]>(
      `${API_URL}/participants/user/${userId}`, { headers: this.headers }
    );
  }
}
