import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  constructor(public auth: AuthService, private router: Router) {}

  public logOut() {
    this.auth.logout(localStorage.getItem('refresh_token') || '').subscribe(
      (response) => {
        this.router.navigate(['login']);
      }
    )
  }
}

