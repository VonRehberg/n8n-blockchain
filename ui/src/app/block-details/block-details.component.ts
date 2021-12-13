import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-block-details',
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.scss']
})
export class BlockDetailsComponent {
  live = true;
  constructor(
    public dataService: DataService,
    public dialog: MatDialog) {}
  
  stringify(data) {
    return JSON.stringify(data, undefined, "  ");
  }
    
}
