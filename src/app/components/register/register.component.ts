import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss', // Reuse the login styles if applicable
})
export class RegisterComponent {
  hide = true;
  registerForm: FormGroup;
  msg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6), // Example password validation
      ]),
      confirmpassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.authService.getAuthToken()) {
      this.router.navigateByUrl('');
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Additional validation for password match
      if (
        this.registerForm.value.password !==
        this.registerForm.value.confirmpassword
      ) {
        this.msg = 'Passwords do not match';
        return;
      }

      this.authService.registerUser(this.registerForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res && res.data) {
            // Assuming your API returns a success flag
            localStorage.setItem('token', res.data.token);
            this.router.navigateByUrl(''); // Redirect to login after successful registration
          } else {
            this.msg = res.message; // Display error message from API
          }
        },
        (error) => {
          console.error(error);
          this.msg = error.message; // Display the specific error message
        }
      );
    }
  }

  onLogin() {
    this.router.navigate(['login']);
  }
}
