import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { DataService, NewTransactionData } from '../data.service';

@Component({
  selector: 'app-write-content',
  templateUrl: './writeContent.component.html',
  styleUrls: ['./writeContent.component.scss']
})
export class WriteContentComponent implements OnInit {
    @ViewChild('stepper')
    _stepper: MatStepper;
    nextDisabled = false;
    nodeNotInitialized = false;
    isLoading = false;
    privateKey: ArrayBuffer;
    privateKeyFormGroup: FormGroup;
    contentFormGroup: FormGroup;
    constructor(
        private snackbar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<WriteContentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NewTransactionData,
        public dataService: DataService) { }


    ngOnInit() {
      this.privateKeyFormGroup = this._formBuilder.group({
          privateKeyCtrl: ['Private Key File', Validators.required],
      });
      this.contentFormGroup = this._formBuilder.group({
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
            // Write Transaction
        } else {
            this.dialogRef.close(true);
        }
    }

    handlePrivateKeyChange(event) {
      const element = event.currentTarget as HTMLInputElement;
      const reader = new FileReader();
      reader.onload = async (file: any) => {
        const keyContent = reader.result as string;

        this.privateKey = stringToArrayBuffer(atob(keyContent.replace("-----BEGIN PRIVATE KEY-----\n", "").replace("-----END PRIVATE KEY-----", "")));
        this.next();

        try {
          const key = await crypto.subtle.importKey("pkcs8", this.privateKey, {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"} as RsaHashedImportParams, false, ["sign"]);
          console.log(buf2hex(await crypto.subtle.sign({name: 'RSASSA-PKCS1-v1_5', hash: "SHA-256"}, key, new TextEncoder().encode("blaaaaaa"))));
        } catch (e) {
          console.error(e);
        }
      }
      reader.readAsText(element.files[0]);
    }
}
function stringToArrayBuffer(byteString){
  var byteArray = new Uint8Array(byteString.length);
  for(var i=0; i < byteString.length; i++) {
      byteArray[i] = byteString.codePointAt(i);
  }
  return byteArray;
}
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}