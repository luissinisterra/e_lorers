import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:3000';
const TOKEN_KEY = 'lorers_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API_URL}/login`, { username, password }).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  register(name: string, username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API_URL}/register`, { name, username, password }).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
