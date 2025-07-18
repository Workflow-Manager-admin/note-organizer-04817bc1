import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <form class="signup-form" (submit)="onSubmit($event)">
    <h2>Sign Up</h2>
    <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required autocomplete="username"/>
    <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required autocomplete="new-password"/>
    <button type="submit" [disabled]="loading">Sign Up</button>
    <a href="#" (click)="showLogin($event)">Already have an account? Log in</a>
    <div *ngIf="error" class="error">{{error}}</div>
  </form>
  `,
  styles: [`
    .signup-form {
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
    .signup-form h2 {
      text-align: center;
      color: #1976d2;
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    .signup-form input {
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid #ccc;
      padding: 0.7rem 0.8rem;
      width: 100%;
    }
    .signup-form button {
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
    .signup-form a {
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
export class SignupComponent {
  @Output() signup = new EventEmitter<{email: string, password: string}>();
  @Output() showLoginScreen = new EventEmitter<void>();
  email = '';
  password = '';
  loading = false;
  error: string|null = null;

  onSubmit(e: Event) {
    e.preventDefault();
    this.error = null;
    this.loading = true;
    this.signup.emit({ email: this.email, password: this.password });
  }

  showLogin(e: Event) {
    e.preventDefault();
    this.showLoginScreen.emit();
  }
}
