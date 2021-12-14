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
    privateKey: CryptoKey;
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
        authorCtrl: ['Name', Validators.required],
          dataCtrl: ['Data', Validators.required],
          signatureCtrl: ['Signature', Validators.required]
      });
    }
    
    onCancelClick(): void {
        this.dialogRef.close(false);
    }
    async next() {
      if (!this.privateKey) {
        return;
      }
      if (this._stepper.selectedIndex === 0) {
        this._stepper.next();
      } else {
        this.isLoading = true;
        this.dataService.createTransaction(this.data).subscribe(() => {
          this.dialogRef.close(true);
        }, (error) => {
          this.isLoading = false;
          this.snackbar.open("Failed to write transaction: " + error.message, "OK");
        });
        // Write Transaction
        // this.dialogRef.close(true);
      }
    }

    async handleDataChange() {
      this.data.signature = buf2hex(await crypto.subtle.sign({name: 'RSASSA-PKCS1-v1_5', hash: "SHA-256"}, this.privateKey, new TextEncoder().encode(this.data.data)));
    }

    handlePrivateKeyChange(event) {
      const element = event.currentTarget as HTMLInputElement;
      const reader = new FileReader();
      reader.onload = async (file: any) => {
        try {
          const keyContent = reader.result as string;

          const key = stringToArrayBuffer(atob(keyContent.replace("-----BEGIN PRIVATE KEY-----\n", "").replace("-----END PRIVATE KEY-----", "")));

          this.privateKey = await crypto.subtle.importKey("pkcs8", key, {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"} as RsaHashedImportParams, false, ["sign"]);
          this.next();
        } catch (e) {
          this.snackbar.open('Failed to read key', 'OK');
        }
      }
      reader.readAsText(element.files[0]);
      try {
        this.data.author = element.files[0].name.replace("privateKey-", "").replace(".pem", "");
      } catch (e) {
        console.log(e);
      }
    }
}
function stringToArrayBuffer(byteString){
  var byteArray = new Uint8Array(byteString.length);
  for(var i=0; i < byteString.length; i++) {
      byteArray[i] = byteString.codePointAt(i);
  }
  return byteArray;
}
function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}