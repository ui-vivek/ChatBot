import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true; 
  loginForm: FormGroup;
  msg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private routes: Router,
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        
      ]),
    });
  }
  ngOnInit(): void {
    // if(this.authService.getAuthToken()){
    //   this.routes.navigateByUrl('');
    // }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.verifyUser(this.loginForm.value).subscribe((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.routes.navigateByUrl('');
        } else {
          this.msg = res.message;
        }
      },(error) => {
        console.log(error)
       this.msg = "You have entered an invalid email or password"
      });
    }
  }

}
