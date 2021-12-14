import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { ConnectComponent } from '../connect/connect.component';
import { DataService } from '../data.service';
import { WriteContentComponent } from '../writeContent/writeContent.component';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent {
  constructor(
    public dataService: DataService,
    public dialog: MatDialog) {}

  handleBlockSelect(block) {
    this.dataService.selectedBlock = block.extra;
  }

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showGridLines: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Blocks';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '# of Transactions';
  yAxisTickFormatting = (value) => {
    return Math.round(value) === value ? value : null;
  }
  animations: boolean = true;

  openConnectDialog() {
    const dialogRef = this.dialog.open(ConnectComponent, {
      width: '550px',
      data: {endpoint: '192.168.188.20:63417'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.fetchNodeInfos();
    });
  }

  openNewTransactionDialog() {
    const dialogRef = this.dialog.open(WriteContentComponent, {
      width: '750px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.fetchNodeInfos();
    });
  }
}
