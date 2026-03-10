import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reminder } from './interfaces';

export interface PaginationParams {
  page: number;
  size: number;
  search?: string;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private baseUrl = 'http://31.56.208.79:8085/api/v1';

  currentParams = new BehaviorSubject<PaginationParams>({
    page: 0,
    size: 10,
    sortBy: 'name',
    direction: 'desc'
  });

  constructor(private http: HttpClient) {}

  getReminders(params: PaginationParams): Observable<any> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString())
      .set('by', params.sortBy || 'name')
      .set('direction', params.direction || 'desc');

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get(`${this.baseUrl}/sort`, { params: httpParams });
  }

  updateParams(params: Partial<PaginationParams>) {
    const current = this.currentParams.value;
    const newParams = { ...current, ...params, page: params.page ?? 0 };
    this.currentParams.next(newParams);
  }

  refresh(): Observable<any> {
    return this.getReminders(this.currentParams.value);
  }
}
