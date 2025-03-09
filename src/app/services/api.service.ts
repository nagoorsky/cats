import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../shared/config';

export interface FactsDto {
  data: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  apiUrl: string = config.apiUrl;

  getManyFacts(size: number): Observable<FactsDto> {
    return this.http.get<FactsDto>(`${this.apiUrl}?count=${size}`);
  }

  getOneFact(): Observable<FactsDto> {
    return this.http.get<FactsDto>(`${this.apiUrl}`);
  }
}
