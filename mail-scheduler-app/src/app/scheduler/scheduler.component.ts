import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { AuthService } from '../services/auth.service';
import { MailService } from '../services/mail.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  userMailConfig: any
  activeMailConfig!: number
  allMails: any
  selectedMail: any
  count: number = 0
  storeActiveMailID(id: number) {
    this.activeMailConfig = id
    console.log('current', this.activeMailConfig);
    this.updateEmails()
  }

  updateEmails() {
    setTimeout(()=>{
      this.mailService.getAllMails().subscribe({
        next: (data) => {
          this.allMails = data.filter((dat: any) => dat.mailConfigurationId == this.activeMailConfig)
        },
        error: () => { }
      })
    },200)
  }

  constructor(private authService: AuthService, private mailService: MailService, public dialog: MatDialog) {
    this.mailService.getMailConfigs().subscribe({
      next: (data) => {
        this.userMailConfig = data.filter((dat: any) => dat.email == this.authService.currentUser.email)
      },
      error: () => { }
    })
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.mailService.getMailConfigs().subscribe({
        next: (data) => {
          this.userMailConfig = data.filter((dat: any) => dat.email == this.authService.currentUser.email)
        },
        error: () => { }
      })
    });
  }

  schedulerForm = new FormGroup({
    to: new FormControl('', [Validators.required]),
    cc: new FormControl(''),
    bcc: new FormControl(''),
    subject: new FormControl(''),
    body: new FormControl('', [Validators.required]),
    dateTime: new FormControl('', [Validators.required])
  });
  get toValue() { return this.schedulerForm.controls['to']; }
  get ccValue() { return this.schedulerForm.controls['cc']; }
  get bccValue() { return this.schedulerForm.controls['bcc']; }
  get subjectValue() { return this.schedulerForm.controls['subject']; }
  get bodyValue() { return this.schedulerForm.controls['body']; }
  get dateTimeValue() { return this.schedulerForm.controls['dateTime']; }

  saveEmail() {
    if(this.count>0){
      this.mailService.deleteSelectedMail(this.selectedMail.id).subscribe()
    }
    let email = {
      to: this.toValue.value,
      cc: this.ccValue.value,
      bcc: this.bccValue.value,
      subject: this.subjectValue.value,
      body: this.bodyValue.value,
      scheduledDate: this.dateTimeValue.value.split('T')[0],
      scheduledTime: this.dateTimeValue.value.split('T')[1].substring(0, 5),
      scheduledDateTime: this.dateTimeValue.value,
      mailConfigurationId: this.activeMailConfig
    }
    this.discardTheForm()
    this.mailService.saveMail(email).subscribe()
    this.updateEmails()
  }

  discardTheForm() {
    this.schedulerForm = new FormGroup({
      to: new FormControl('', [Validators.required]),
      cc: new FormControl(''),
      bcc: new FormControl(''),
      subject: new FormControl(''),
      body: new FormControl('', [Validators.required]),
      dateTime: new FormControl('', [Validators.required])
    });
  }

  getMailById(id: number) {
    this.mailService.getAllMails().subscribe({
      next: (data) => {
        this.selectedMail = data.filter((dat: any) => dat.id === id)[0]
      },
      error: () => { }
    })
  }

  updateMailDetails(id: number) {
    this.count++;
    this.getMailById(id);
    setTimeout(() => {
      this.schedulerForm = new FormGroup({
        to: new FormControl(this.selectedMail.to, [Validators.required]),
        cc: new FormControl(this.selectedMail.cc),
        bcc: new FormControl(this.selectedMail.bcc),
        subject: new FormControl(this.selectedMail.subject),
        body: new FormControl(this.selectedMail.body, [Validators.required]),
        dateTime: new FormControl(this.selectedMail.scheduledDateTime, [Validators.required])
      })
    }
      , 100)

  }
  //ripple props
  centered = false;
  disabled = false;
  unbounded = false;

  radius!: number;
  color!: string;
}
