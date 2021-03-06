import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectComponent } from '../connect/connect.component';
import { DataService } from '../data.service';
import { AddNodeComponent } from '../addNode/addNode.component';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent {
  constructor(
    private snackbar: MatSnackBar,
    public dataService: DataService,
    public dialog: MatDialog) {}
  
  openConnectDialog() {
    const dialogRef = this.dialog.open(ConnectComponent , {
      width: '550px',
      data: {endpoint: '192.168.188.20:63417'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.fetchNodeInfos(false);
    });
  }

  openAddNodeDialog() {
    const dialogRef = this.dialog.open(AddNodeComponent , {
      width: '550px',
      data: {endpoint: '192.168.188.20:63417'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.fetchNodeInfos(false);
    });
  }

  connectTo(node) {
    this.dataService.setEndpointAndCheck(node.endpoint).subscribe(() => {
      this.dataService.fetchNodeInfos(false);
    }, (error) => {
      this.snackbar.open("Failed to connect", "OK");
    })
  }
    
}
