import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pr-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  router = inject(Router);

  authenticationFailed = signal(false);

  loginForm: FormGroup = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });

  authenticate(): void {
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;
    this.userService.authenticate(login, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.authenticationFailed.set(true)
    });
  }
}
