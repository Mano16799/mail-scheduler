import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { email } from '../interfaces/email';
import { mailConfiguration } from '../interfaces/mail-configuration';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  constructor(private httpClient: HttpClient) {}
  emails:any
  isMailSaved:boolean=false
  saveMailConfig(data: mailConfiguration) {
    return this.httpClient.post<any>('http://localhost:3001/mail-configurations', data)
  }

  getMailConfigs() {
   return this.httpClient.get<any>('http://localhost:3001/mail-configurations')
  }

  saveMail(data:email){
    return this.httpClient.post<any>('http://localhost:3001/emails', data)
  }

  getAllMails(){
    return this.httpClient.get<any>('http://localhost:3001/emails')
  }

  deleteSelectedMail(id:number){
    return this.httpClient.delete<any>('http://localhost:3001/emails'+'/'+id)
  }

  deleteSelectedMailConfig(id:number){
    return this.httpClient.delete<any>('http://localhost:3001/mail-configurations'+'/'+id)
  }


}


