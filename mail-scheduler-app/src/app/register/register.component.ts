import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { passwordValidator, confirmPasswordValidator } from '../customValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userDetailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    confirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator()])
  });

  
  get email() {return this.userDetailForm.controls['email'];}
  get password() { return this.userDetailForm.controls['password']; }
  get confirmPassword() { return this.userDetailForm.controls['confirmPassword']; }

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    var formData = {
      email:this.email.value,
      password:this.password.value
    }

    this.auth.register(formData)
    alert('signup succesful. please login to continue')
    this.router.navigate(['authenticate']);
  }
}

