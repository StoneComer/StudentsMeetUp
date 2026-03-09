import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Profile } from '../interfaces';
import { Reminder } from '../interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(private router: Router, private auth: AuthService) {}

  public user: Profile = {
    id: '',
    username: '',
    email: '',
    telegramId: ''
  };

  public reminders: Reminder[] = [];

  public session_state = ''

  ngOnInit(): void {
    this.auth.getProfile().subscribe(
      (response: any) => {
        this.user = response;
        this.session_state = localStorage.getItem('session_state') || '';
      }
    );

    this.auth.getReminders().subscribe(
      (response: any) => {
        this.reminders = response;
        this.reminders = [
          {
            id: 9007199254740991,
            title: "Уведомление 1",
            description: "Уведомление 1",
            remind: "2026-03-09T19:43:44.404Z"
          },
          {
            id: 9007199254740991,
            title: "Уведомление 1",
            description: "Уведомление 1",
            remind: "2026-03-09T19:43:44.404Z"
          },
          {
            id: 9007199254740991,
            title: "Уведомление 1",
            description: "Уведомление 1",
            remind: "2026-03-09T19:43:44.404Z"
          }
        ];
      }
    );
  }
}
