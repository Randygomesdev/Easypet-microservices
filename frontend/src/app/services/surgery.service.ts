import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../models/page.model';
import { SurgeryRequest, SurgeryResponse } from '../models/surgery.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurgeryService {
  private apiUrl(petId: string) {
    return `${environment.businessApiUrl}/pets/${petId}/surgeries`;
  }
  constructor(private http: HttpClient) {}

  create(petId: string, request: SurgeryRequest): Observable<SurgeryResponse> {
    return this.http.post<SurgeryResponse>(this.apiUrl(petId), request);
  }

  findAll(petId: string, page: number = 0, size: number = 10): Observable<Page<SurgeryResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<SurgeryResponse>>(this.apiUrl(petId), { params });
  }

  update(petId: string, id: string, request: SurgeryRequest): Observable<SurgeryResponse> {
    return this.http.put<SurgeryResponse>(`${this.apiUrl(petId)}/${id}`, request);
  }

  delete(petId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(petId)}/${id}`);
  } 
}
