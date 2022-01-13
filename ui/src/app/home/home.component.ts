import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  live = true;
  constructor(private router: Router,
    public dataService: DataService) { }

  ngOnInit(): void {
  }

  goToCreateTicket() {
    this.router.navigateByUrl("createTicket");
  }

  goFindSupportDocuments() {
    this.router.navigateByUrl("/permission/findSupportDocuments");
  }

  stringify(data) {
    return JSON.stringify(data, undefined, "  ");
  }
}
