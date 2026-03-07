import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const API_URL = 'http://localhost:3000';

export interface EventResponse {
  id_event: number;
  name: string;
  description: string | null;
  creator_id: number;
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

@Injectable({ providedIn: 'root' })
export class EventService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createEvent(body: CreateEventBody): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      `${API_URL}/events`,
      body,
      { headers: this.authHeaders() }
    );
  }

  getEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${API_URL}/events`, { headers: this.authHeaders() });
  }

  getEventById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${API_URL}/events/${id}`, { headers: this.authHeaders() });
  }
}
