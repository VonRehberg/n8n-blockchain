import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ConnectData, DataService } from '../data.service';

@Component({
  selector: 'app-add-node',
  templateUrl: './addNode.component.html',
  styleUrls: ['./addNode.component.scss']
})
export class AddNodeComponent implements OnInit {
    @ViewChild('stepper')
    _stepper: MatStepper;
    nextDisabled = false;
    nodeNotInitialized = false;
    username;
    password;
    isLoading = false;
    endpointFormGroup: FormGroup;
    constructor(
        private snackbar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AddNodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConnectData,
        public dataService: DataService) { }


    ngOnInit() {
        this.endpointFormGroup = this._formBuilder.group({
            endpointCtrl: ['192.168.0.1:1234', Validators.required],
            usernameCtrl: ['username', Validators.required],
            passwordCtrl: ['password', Validators.required],
        });
    }
    
    onCancelClick(): void {
        this.dialogRef.close(false);
    }
    connect(): void {
        this.isLoading = true;
        this.dataService.joinNetwork(this.data.endpoint, this.username, this.password).subscribe((data) => {
            this.isLoading = false;
            this.dialogRef.close(true);
        }, (error) => {
            this.isLoading = false;
            this.snackbar.open("Failed to Join Network", "OK");
        });
    }
    next() {
        if (this._stepper.selectedIndex === 0) {
            this._stepper.next();
            this.isLoading = true;
            this.dataService.checkEndpointBy(this.data.endpoint).subscribe((data: any) => {
                this.isLoading = false;
                if (!data.isInitialized) {
                    this.nodeNotInitialized = true;
                    this.nextDisabled = true;
                }
            });
        } else {
            this.connect();
        }
    }

    setupNode() {
        this.isLoading = true;
        this.dataService.setupNodeBy(this.data.endpoint, this.username, this.password).subscribe(() => {
            this.isLoading = false;
            this.nextDisabled = false;
            this.nodeNotInitialized = false;
        }, (error) => {
            this.isLoading = false;
            this.snackbar.open("Failed to Setup Node", "OK");
        });
    }
}