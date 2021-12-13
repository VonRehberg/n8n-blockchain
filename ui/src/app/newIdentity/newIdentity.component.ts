import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { NewIdentityData, DataService } from '../data.service';

@Component({
  selector: 'app-new-identity',
  templateUrl: './newIdentity.component.html',
  styleUrls: ['./newIdentity.component.scss']
})
export class NewIdentityComponent implements OnInit {
    @ViewChild('stepper')
    _stepper: MatStepper;
    nextDisabled = false;
    nodeNotInitialized = false;
    isLoading = false;
    nameFormGroup: FormGroup;
    constructor(
        private snackbar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<NewIdentityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NewIdentityData,
        public dataService: DataService) { }


    ngOnInit() {
        this.nameFormGroup = this._formBuilder.group({
            nameCtrl: ['Your Name', Validators.required],
        });
    }
    
    onCancelClick(): void {
        this.dialogRef.close(false);
    }
    next() {
        if (this._stepper.selectedIndex === 0) {
            this._stepper.next();
            this.isLoading = true;
            this.dataService.createIdentity(this.data.name).subscribe((data: any) => {
                this.isLoading = false;
                var a = document.createElement('a');
                var blob = new Blob([data.privateKey], {'type':'application/octet-stream'});
                a.href = window.URL.createObjectURL(blob);
                a.download = 'privateKey' + this.data.name + '.pem';
                a.click();
            }, (error) => {
                this.isLoading = false;
                this._stepper.previous();
                this.snackbar.open("Failed to create identity", "OK");
            });
        } else {
            this.dialogRef.close(true);
        }
    }
}