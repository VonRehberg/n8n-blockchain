import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';

@Component({
  selector: 'app-block-details',
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.scss']
})
export class BlockDetailsComponent {
  live = true;
  constructor(
    private snackbar: MatSnackBar,
    public dataService: DataService,
    public dialog: MatDialog) {}
  
  stringify(data) {
    return JSON.stringify(data, undefined, "  ");
  }

  async verify() {
    const key = stringToArrayBuffer(atob(this.dataService.selectedBlock.publicKey.replace("-----BEGIN PUBLIC KEY-----\n", "").replace("-----END PUBLIC KEY-----", "")));
    const publicKey = await crypto.subtle.importKey("spki", key, {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"} as RsaHashedImportParams, false, ["verify"]);
    const result = await crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"}, publicKey, hexStringToByteArray(this.dataService.selectedBlock.signature), new TextEncoder().encode(JSON.stringify(this.dataService.selectedBlock.payload)));
    if (result === true) {
      this.snackbar.open("Signature is valid", "OK");
    } else {
      this.snackbar.open("Signature is not valid", "OK");
    }
  }  
}

const generateHash = async (message) => {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(message);

  const digest = await window.crypto.subtle.digest('SHA-256', buffer);

  // Convert to hex string
  return [...new Uint8Array(digest)]
    .map(v => v.toString(16).padStart(2, '0')).join('');;
};

function stringToArrayBuffer(byteString){
  var byteArray = new Uint8Array(byteString.length);
  for(var i=0; i < byteString.length; i++) {
      byteArray[i] = byteString.codePointAt(i);
  }
  return byteArray;
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function hexStringToByteArray(hexString) {
  var numBytes = hexString.length / 2;
  var byteArray = new Uint8Array(numBytes);
  for (var i=0; i<numBytes; i++) {
      byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
  }
  return byteArray;
}