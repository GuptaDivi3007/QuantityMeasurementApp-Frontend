import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.css']
})
export class AuthFormComponent {

  isLogin = true;

  // Login
  email = '';
  password = '';

  // Signup
  registerName = '';
  registerEmail = '';
  registerPassword = '';

  // Messages
  errorMsg = '';
  successMsg = '';

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.isLogin) {

      // 🔐 LOGIN
      this.api.login(this.email, this.password).subscribe({
        next: (res: string) => {

          console.log('LOGIN RESPONSE:', res);

          if (
            res.trim().toLowerCase() === 'user not found' ||
            res.trim().toLowerCase() === 'invalid password'
          ) {
            this.errorMsg = res;
          } else {
            localStorage.setItem('token', res);
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          this.errorMsg = 'Could not connect to server.';
        }
      });

    } else {

      // 📝 SIGNUP
      this.api.register(
        this.registerName,
        this.registerEmail,
        this.registerPassword
      ).subscribe({
        next: (res: string) => {

          console.log('REGISTER RESPONSE:', '[' + res + ']');

          if (res.trim().toLowerCase() === 'user registered successfully') {

            // ✅ SHOW SUCCESS MESSAGE
            this.successMsg = 'User registered successfully! Please login.';

            // ✅ CLEAR FIELDS
            this.registerName = '';
            this.registerEmail = '';
            this.registerPassword = '';

            // ✅ SWITCH TO LOGIN AFTER DELAY
            setTimeout(() => {
              this.successMsg = '';
              this.isLogin = true;
            }, 1500);

          } else {
            this.errorMsg = res;
          }
        },
        error: () => {
          this.errorMsg = 'Could not connect to server.';
        }
      });
    }
  }
}