import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MedicationRequest, MedicationResponse } from '../models/medication.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {

  private apiUrl(petId: string) {
    return `${environment.businessApiUrl}/pets/${petId}/medications`;
  }
  constructor(private http: HttpClient) {}

  create(petId: string, request: MedicationRequest): Observable<MedicationResponse> {
    return this.http.post<MedicationResponse>(this.apiUrl(petId), request);
  }

  findAll(petId: string): Observable<MedicationResponse[]> {
    return this.http.get<MedicationResponse[]>(this.apiUrl(petId));
  }

  update(petId: string, id: string, request: MedicationRequest): Observable<MedicationResponse> {
    return this.http.put<MedicationResponse>(`${this.apiUrl(petId)}/${id}`, request);
  }

  delete(petId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(petId)}/${id}`);
  }
}
