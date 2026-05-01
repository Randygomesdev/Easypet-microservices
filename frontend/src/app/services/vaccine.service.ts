import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { VaccineRequest, VaccineResponse } from '../models/vaccination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private apiUrl(petId: string) {
    return `${environment.businessApiUrl}/pets/${petId}/vaccinations`;
  }
  constructor(private http: HttpClient) {}
  create(petId: string, request: VaccineRequest): Observable<VaccineResponse> {
    return this.http.post<VaccineResponse>(this.apiUrl(petId), request);
  }
  findAll(petId: string): Observable<VaccineResponse[]> {
    return this.http.get<VaccineResponse[]>(this.apiUrl(petId));
  }
  update(petId: string, id: string, request: VaccineRequest): Observable<VaccineResponse> {
    return this.http.put<VaccineResponse>(`${this.apiUrl(petId)}/${id}`, request);
  }
  delete(petId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(petId)}/${id}`);
  }
}
