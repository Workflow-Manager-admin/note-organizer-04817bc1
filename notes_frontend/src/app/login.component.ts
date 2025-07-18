import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <form class="login-form" (submit)="onSubmit($event)">
    <h2>Login</h2>
    <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required autocomplete="username"/>
    <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required autocomplete="current-password"/>
    <button type="submit" [disabled]="loading">Login</button>
    <a href="#" (click)="showSignup($event)">No account? Sign up</a>
    <div *ngIf="error" class="error">{{error}}</div>
  </form>
  `,
  styles: [`
    .login-form {
      background: #fff;
      border-radius: 7px;
      padding: 2rem 2rem 1.2rem 2rem;
      margin: 1rem auto;
      box-shadow: 0 2px 32px 0 rgba(25,118,210,.08);
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
    .login-form h2 {
      text-align: center;
      color: #1976d2;
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    .login-form input {
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid #ccc;
      padding: 0.7rem 0.8rem;
      width: 100%;
    }
    .login-form button {
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 0.6rem 0;
      font-size: 1.13rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1rem;
    }
    .login-form a {
      color: #ff4081;
      font-size: 0.99rem;
      margin-top: 0.4rem;
      text-align: center;
      cursor: pointer;
      text-decoration: underline;
    }
    .error {
      color: #e53935;
      font-size: 0.97rem;
      text-align: center;
      margin-top: 0.6em;
    }
  `]
})
export class LoginComponent {
  @Output() login = new EventEmitter<{email: string, password: string}>();
  @Output() showSignupScreen = new EventEmitter<void>();
  email = '';
  password = '';
  loading = false;
  error: string|null = null;

  onSubmit(e: Event) {
    e.preventDefault();
    this.error = null;
    this.loading = true;
    this.login.emit({ email: this.email, password: this.password });
  }

  showSignup(e: Event) {
    e.preventDefault();
    this.showSignupScreen.emit();
  }
}
