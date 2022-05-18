import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable,filter,pipe } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { AuthService } from '../services/auth.service';
import { MailService } from '../services/mail.service';
import { Router } from '@angular/router';
import { mailConfiguration } from '../interfaces/mail-configuration';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent {
  //ripple props
  centered = false;
  disabled = false;
  unbounded = false;
  radius!: number;
  color!: string;
  //class props
  userMailConfig: any
  activeMailConfig!: number
  selectedMailConfig!:mailConfiguration
  allMails: any
  selectedMail: any
  count: number = 0

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private authServ: AuthService,
    private mailService: MailService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    this.mailService.getMailConfigs().subscribe({
      next: (data) => {
        this.userMailConfig = data.filter((dat: any) => dat.email == this.authServ.currentUser.email)
      },
      error: () => { }
    })
  }

  ngOnInit(): void {
  }
  //mail compose form related functions
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

  //to save the form details entered by user
  saveEmail() {
    if (this.count > 0) {
      this.mailService.deleteSelectedMail(this.selectedMail.id).subscribe()
      this.count = 0
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

  //method which will be called to update the mail list on change
  updateEmails() {
    setTimeout(()=>{
      this.mailService.getAllMails().subscribe({
        next: (data) => {
          this.allMails = data.filter((dat: any) => dat.mailConfigurationId == this.activeMailConfig)
        },
        error: () => { }
      })
    },100)
  }

  //method to discard the form entries
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

  //method to retreive the selected mail details
  getMailById(id: number) {
    this.mailService.getAllMails().subscribe({
      next: (data) => {
        this.selectedMail = data.filter((dat: any) => dat.id === id)[0]
      },
      error: () => { }
    })
  }

  //method to update the selected existing mail
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
    }, 100)

  }

  //mail config related methods
  openDialog() {    
    const dialogRef = this.dialog.open(DialogContentComponent,{
      data: { pageValue: this.getMailConfigById() }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.mailService.getMailConfigs().subscribe({
        next: (data) => {
          this.userMailConfig = data.filter((dat: any) => dat.email == this.authServ.currentUser.email)
        },
        error: () => { }
      })
    });
  }

  storeActiveMailConfigID(id: number) {
    this.activeMailConfig = id
    this.updateEmails()
    this.getMailConfigById()
  }

  getMailConfigById(){
    this.selectedMailConfig =  this.userMailConfig.filter((config:any)=>config.id==this.activeMailConfig)[0]
    return this.selectedMailConfig
  }
  //to log out
  logOut() {
    this.authServ.logout()
    this.router.navigate(['/authenticate'])
  }
}
