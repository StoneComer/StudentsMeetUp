import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  valutes: any = '';
  ngOnInit() {
    if (localStorage.getItem('access_token')) {
      return
    } else {
      this.router.navigate(['login']);
    }
  }


}
