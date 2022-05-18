import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mailConfiguration } from '../interfaces/mail-configuration';
import { MailService } from '../services/mail.service';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent implements OnInit {
  fromPage: any={
    accountName: "",
      email: "",
      password: "",
      incomingServer: "",
      incomingServerPort: "",
      outgoingServer: "",
      outgoingServerPort: "",
      id:0
  };

  constructor(private mailService: MailService, public dialogRef: MatDialogRef<DialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data.pageValue;
    console.log(this.fromPage.id);    
  }

  ngOnInit(): void {
    this.newAccountForm = new FormGroup({
      accName: new FormControl(this.fromPage.accountName, [Validators.required]),
      email: new FormControl(this.fromPage.email, [Validators.required]),
      password: new FormControl(this.fromPage.password, [Validators.required]),
      incomServer: new FormControl(this.fromPage.incomingServer, [Validators.required]),
      incomServerport: new FormControl(this.fromPage.incomingServerPort, [Validators.required]),
      outGoServer: new FormControl(this.fromPage.outgoingServer, [Validators.required]),
      outGoServerPort: new FormControl(this.fromPage.outgoingServerPort, [Validators.required]),
    });
  }

  newAccountForm = new FormGroup({
    accName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    incomServer: new FormControl('', [Validators.required]),
    incomServerport: new FormControl('', [Validators.required]),
    outGoServer: new FormControl('', [Validators.required]),
    outGoServerPort: new FormControl('', [Validators.required]),
  });

  get accName() { return this.newAccountForm.controls['accName'] }
  get email() { return this.newAccountForm.controls['email'] }
  get password() { return this.newAccountForm.controls['password'] }
  get incomServer() { return this.newAccountForm.controls['incomServer'] }
  get incomServerPort() { return this.newAccountForm.controls['incomServerport'] }
  get outGoServer() { return this.newAccountForm.controls['outGoServer'] }
  get outGoServerPort() { return this.newAccountForm.controls['outGoServerPort'] }

  saveAccount() {
    if(this.fromPage.accountName!==''){
      this.mailService.deleteSelectedMailConfig(this.fromPage.id).subscribe()
    }
    const data: mailConfiguration = {
      accountName: this.accName.value,
      email: this.email.value,
      password: this.password.value,
      incomingServer: this.incomServer.value,
      incomingServerPort: this.incomServerPort.value,
      outgoingServer: this.outGoServer.value,
      outgoingServerPort: this.outGoServerPort.value
    }
    this.mailService.saveMailConfig(data).subscribe({
      next: () => console.log('new account added sucessfully')
    })
  }
}
