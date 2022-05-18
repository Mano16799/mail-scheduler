import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '../interfaces/user';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  isLoggedIn: boolean = false;
  currentUser!: user;

  login(data: user) {
    this.currentUser = data
    return this.httpClient.post<any>('http://localhost:3000/authenticate', data)
  }


  logout() {
    this.isLoggedIn = false;
  }

  register(data: user) {
    this.httpClient.post<any>('http://localhost:3000/register', data).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error)
    });
  }


}
