import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest, AuthenticationResponse, RegisterRequest } from '../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/register`, request).pipe(
      tap((response) => this.setSession(response))
    );
  }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/login`, request).pipe(
      tap((response) => this.setSession(response))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private setSession(authResult: AuthenticationResponse) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult));
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

public getToken(): string | null {
    return localStorage.getItem('token');
  }

}
