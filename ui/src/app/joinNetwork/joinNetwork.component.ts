import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ConnectData, DataService } from '../data.service';

@Component({
  selector: 'app-join-network',
  templateUrl: './joinNetwork.component.html',
  styleUrls: ['./joinNetwork.component.scss']
})
export class JoinNetworkComponent implements OnInit {
    @ViewChild('stepper')
    _stepper: MatStepper;
    nextDisabled = false;
    endpointFormGroup: FormGroup;
    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<JoinNetworkComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConnectData,
        public dataService: DataService) { }


    ngOnInit() {
        this.endpointFormGroup = this._formBuilder.group({
            endpointCtrl: ['192.168.0.1:1234', Validators.required],
        });
    }
    
    onCancelClick(): void {
        this.dialogRef.close(false);
    }
    connect(): void {
        this.dialogRef.close(true);
    }
    next() {
        if (this._stepper.selectedIndex === 0) {
            this._stepper.next();
            this.dataService.setEndpointAndCheck(this.data.endpoint).subscribe(() => {
                if (!this.dataService.isEndpointSetup) {
                    this.nextDisabled = true;
                }
            });
        } else {
            this.connect();
        }
    }

    setupNode() {
        this.dataService.setupNode().subscribe(() => {
            this.nextDisabled = false;
        });
    }
}