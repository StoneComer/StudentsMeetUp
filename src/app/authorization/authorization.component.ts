import { Component } from '@angular/core';
import { Login } from '../interfaces';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})

export class AuthorizationComponent {
  constructor(private auth: AuthService, private router: Router) {}

  public login: Login = {
      client_id: 'reminder-backend',
      grant_type: 'password',
      email: '',
      username: '',
      password: ''
  }

  logIn() {
    this.auth.login(this.login).subscribe(
      (response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('session_state', response.session_state);
        this.router.navigate(['profile'])
      }
    );
  }
}
