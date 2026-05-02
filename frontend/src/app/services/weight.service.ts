import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from '../models/page.model';
import { WeightRecordRequest, WeightRecordResponse } from '../models/weight.model';

@Injectable({ providedIn: 'root' })

export class WeightService {
    
  private apiUrl(petId: string) {
    return `${environment.businessApiUrl}/pets/${petId}/weights`;
  }

  constructor(private http: HttpClient) {}

  create(petId: string, request: WeightRecordRequest): Observable<WeightRecordResponse> {
    return this.http.post<WeightRecordResponse>(this.apiUrl(petId), request);
  }

  findAll(petId: string, page: number = 0, size: number = 10): Observable<Page<WeightRecordResponse>> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get<Page<WeightRecordResponse>>(this.apiUrl(petId), { params });
  }

  delete(petId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(petId)}/${id}`);
  }
}
