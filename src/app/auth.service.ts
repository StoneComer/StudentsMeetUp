import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Login } from "./interfaces";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://31.56.208.79:8085/api/v1';

  constructor(private http: HttpClient) {}

  public login(data: Login) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new HttpParams()
      .set('client_id', 'reminder-backend')
      .set('grant_type', 'password')
      .set('username', data.username)
      .set('password', data.password);

    return this.http.post(
      `http://31.56.208.79:8081/realms/reminder/protocol/openid-connect/token`,
      body.toString(), { headers }
    );
  }

  public logout(refreshToken: string) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new HttpParams()
      .set('client_id', 'reminder-backend')
      .set('refresh_token', refreshToken);

    return this.http.post(
      `http://31.56.208.79:8081/realms/reminder/protocol/openid-connect/logout`,
      body.toString(), { headers }
    );
  }

  public getProfile() {
    return this.http.get(`${this.API_URL}/users/me`);
  }

  public getReminders(
    page: number = 0,
    size: number = 20,
    searchTitle: string = '',
    searchDescription: string = '',
    sortBy: string = 'date',
    direction: 'asc' | 'desc' = 'asc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (searchTitle.trim()) {
      params = params.set('title', searchTitle.trim());
    }
    if (searchDescription.trim()) {
      params = params.set('description', searchDescription.trim());
    }

    return this.http.get(`${this.API_URL}/list`, { params });
  }

  public filterReminders(
    page: number = 0,
    size: number = 20,
    date: string = '',
    time: string = '',
    sortBy: string = 'date',
    direction: 'asc' | 'desc' = 'asc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (date.trim()) {
      params = params.set('date', date.trim());
    }
    if (time.trim()) {
      params = params.set('time', time.trim());
    }

    return this.http.get(`${this.API_URL}/filter`, { params });
  }

  public createReminder(reminder: any): Observable<any> {
    return this.http.post(`${this.API_URL}/reminder/create`, reminder);
  }

  public updateReminder(reminder: any): Observable<any> {
    return this.http.post(`${this.API_URL}/reminder/update`, reminder);
  }

  public deleteReminder(reminderId: number): Observable<any> {
    const options = {
      headers: new HttpHeaders(),
      body: {reminderId}
    };

    return this.http.delete(`${this.API_URL}/reminder/delete`, options);
  }
}
