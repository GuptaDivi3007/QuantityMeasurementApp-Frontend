import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ── AUTH ──────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/v1/users/login`,
      { email, password },
      { responseType: 'text' }
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/v1/users/register`,
      { name, email, password },
      { responseType: 'text' }
    );
  }

  // ── QUANTITY ──────────────────────────────────
  calculate(payload: any, operation: string): Observable<any> {
    const headers = this.getAuthHeaders();

    let url = '';

    switch (operation) {
      case 'add':
        url = 'add';
        break;
      case 'subtract':
        url = 'subtract';
        break;
      case 'multiply':
        url = 'multiply';
        break;
      case 'divide':
        url = 'divide';
        break;
      case 'compare':
        url = 'compare';
        break;
      case 'convert':
        url = 'convert';
        break;
      default:
        url = 'convert';
    }

    return this.http.post(
      `${this.baseUrl}/api/v1/quantities/${url}`,
      payload,
      { headers }
    );
  }

  getHistory(operation: string = 'all'): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(
      `${this.baseUrl}/api/v1/quantities/history/operation/${operation}`,
      { headers }
    );
  }

  // ── HELPERS ───────────────────────────────────
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}