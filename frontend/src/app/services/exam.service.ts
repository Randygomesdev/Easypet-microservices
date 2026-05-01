import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExamRequest, ExamResponse } from '../models/exam.model';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl(petId: string) {
    return `${environment.businessApiUrl}/pets/${petId}/exams`;
  }
  constructor(private http: HttpClient) {}
  create(petId: string, request: ExamRequest): Observable<ExamResponse> {
    return this.http.post<ExamResponse>(this.apiUrl(petId), request);
  }
  findAll(petId: string, page: number = 0, size: number = 10): Observable<Page<ExamResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<ExamResponse>>(this.apiUrl(petId), { params });
  }
  update(petId: string, id: string, request: ExamRequest): Observable<ExamResponse> {
    return this.http.put<ExamResponse>(`${this.apiUrl(petId)}/${id}`, request);
  }
  delete(petId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(petId)}/${id}`);
  }
}
