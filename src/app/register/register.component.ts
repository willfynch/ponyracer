import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pr-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  registrationFailed = signal(false);

  loginCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(3)]));
  birthYearCtrl = this.formBuilder.control(
    null as null | number,
    Validators.compose([Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())])
  );
  passwordCtrl = this.formBuilder.control('', Validators.required);
  confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
  passwordFormGroup = this.formBuilder.group({
    password: this.passwordCtrl,
    confirmPassword: this.confirmPasswordCtrl
  });
  registerForm = this.formBuilder.group({
    login: this.loginCtrl,
    passwordGroup: this.passwordFormGroup,
    birthYear: this.birthYearCtrl
  });

  register() {
    if (!this.loginCtrl.value || !this.passwordCtrl.value || !this.birthYearCtrl.value) return;

    this.userService.register(this.loginCtrl.value, this.passwordCtrl.value, this.birthYearCtrl.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.registrationFailed.set(true);
      }
    });
  }

  passwordMatch(): PasswordMatchErrors {
    const password = this.passwordCtrl.value;
    const confirmPassword = this.confirmPasswordCtrl.value;

    if (password === confirmPassword) {
      return {
        matchingError: null
      };
    }
    return {
      matchingError: true
    };
  }
}

export type PasswordMatchErrors = {
  matchingError: null | boolean;
};
