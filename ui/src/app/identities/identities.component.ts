import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectComponent } from '../connect/connect.component';
import { DataService } from '../data.service';
import { NewIdentityComponent } from '../newIdentity/newIdentity.component';

@Component({
  selector: 'app-identities',
  templateUrl: './identities.component.html',
  styleUrls: ['./identities.component.scss']
})
export class IdentitiesComponent {
  live = true;
  constructor(
    public dataService: DataService,
    public dialog: MatDialog) {}
  
  openConnectDialog() {
    const dialogRef = this.dialog.open(ConnectComponent , {
      width: '550px',
      data: {endpoint: '192.168.188.20:63417'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.fetchNodeInfos(true);
    });
  }

  openNewIdentityDialog() {
    const dialogRef = this.dialog.open(NewIdentityComponent , {
      width: '550px',
      data: {name: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.fetchNodeInfos(false);
    });
  }
    
}
