import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Login } from "./interfaces";
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root' // This makes the service a singleton available throughout the app
})

export class AuthService {
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
      body.toString(), {headers}
    )
  }

  public logout(refreshToken: string) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return this.http.post(`http://31.56.208.79:8081/realms/reminder/protocol/openid-connect/logout`, {client_id: 'reminder-backend', refresh_token: refreshToken}, {headers})
  }

  public getProfile() {
    return this.http.get('http://31.56.208.79:8085/api/v1/users/me');
  }

  public getReminders() {
    return this.http.get('http://31.56.208.79:8085/api/v1/sort?by=name&page=0&size=20&direction=desc');
  }
}
