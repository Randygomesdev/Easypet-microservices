import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { PetRequest, PetResponse } from '../models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly apiUrl = `${environment.businessApiUrl}/pets`;

  constructor(private http: HttpClient) {}

  create(pet: PetRequest): Observable<PetResponse> {
    return this.http.post<PetResponse>(this.apiUrl, pet);
  }

  findAll(page: number = 0, size: number = 10): Observable<Page<PetResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<PetResponse>>(this.apiUrl, { params });
  }

  update(id: string, pet: PetRequest): Observable<PetResponse> {
    return this.http.put<PetResponse>(`${this.apiUrl}/${id}`, pet);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getById(id: string): Observable<PetResponse> {
    return this.http.get<PetResponse>(`${this.apiUrl}/${id}`);
  }
}
