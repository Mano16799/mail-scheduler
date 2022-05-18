import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  formData: any = {}
  constructor(private authService: AuthService, private router: Router) { }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    console.log("Destroyed");

  }

  ngOnInit(): void {
  }

  login() {
    var userData = {
      email: this.formData.email,
      password: this.formData.password
    }
    this.authService.login(userData).subscribe({
      next: (data: any) => {
        this.authService.isLoggedIn = true
        alert('login sucessful')
        this.router.navigate(['/home'])
      }
      ,
      error: (data: any) => {
        alert('no login details found')
        console.log(data);
      }
    })

  }

}

