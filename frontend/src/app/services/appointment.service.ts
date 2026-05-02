import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppointmentRequest, AppointmentResponse } from '../models/appointment.model';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl(petId: string) {
    return `${environment.businessApiUrl}/pets/${petId}/appointments`;
    }

  constructor(private http: HttpClient) {}

  create(petId: string, request: AppointmentRequest): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(this.apiUrl(petId), request);
  }

  findAll(petId: string, page: number = 0, size: number = 10): Observable<Page<AppointmentResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AppointmentResponse>>(this.apiUrl(petId), { params });
  }

  update(petId: string, id: string, request: AppointmentRequest): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(`${this.apiUrl(petId)}/${id}`, request);
  }

  delete(petId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(petId)}/${id}`);
  }

}