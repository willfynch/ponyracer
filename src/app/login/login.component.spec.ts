import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['authenticate']);
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', component: LoginComponent }]), { provide: UserService, useValue: userService }]
    });
  });

  it('should have a title', async () => {
    const harness = await RouterTestingHarness.create('/login');

    // then we should have a title
    const element = harness.routeNativeElement!;
    expect(element.querySelector('h1')).withContext('The template should have a `h1` tag').not.toBeNull();
    expect(element.querySelector('h1')!.textContent).withContext('The title should be `Log in`').toContain('Log in');
  });

  it('should have a disabled button if the form is incomplete', async () => {
    const harness = await RouterTestingHarness.create('/login');

    const element = harness.routeNativeElement!;
    expect(element.querySelector('button')).withContext('The template should have a button').not.toBeNull();
    expect(element.querySelector('button')!.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);
  });

  it('should be possible to log in if the form is complete', async () => {
    const harness = await RouterTestingHarness.create('/login');

    const element = harness.routeNativeElement!;
    const loginInput = element.querySelector('input')!;
    expect(loginInput).withContext('You should have an input for the login').not.toBeNull();
    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput).withContext('You should have an input with the type `password` for the password').not.toBeNull();
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));

    harness.detectChanges();

    // then we should have a submit button enabled
    expect(element.querySelector('button')!.hasAttribute('disabled'))
      .withContext('The button should be enabled if the form is valid')
      .toBe(false);
  });

  it('should display error messages if fields are dirty and invalid', async () => {
    const harness = await RouterTestingHarness.create('/login');

    const element = harness.routeNativeElement!;
    const loginInput = element.querySelector('input')!;
    expect(loginInput).withContext('You should have an input for the login').not.toBeNull();
    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    loginInput.value = '';
    loginInput.dispatchEvent(new Event('input'));
    harness.detectChanges();
    const loginError = element.querySelector('div.mb-3 div')!;
    expect(loginError).withContext('You should have an error message if the login field is required and dirty').not.toBeNull();
    expect(loginError.textContent).withContext('The error message for the login field is incorrect').toContain('Login is required');

    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    harness.detectChanges();

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput).withContext('You should have an input with the type `password` for the password').not.toBeNull();
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    harness.detectChanges();
    const passwordError = element.querySelector('div.mb-3 div')!;
    expect(passwordError).withContext('You should have an error message if the password field is required and dirty').not.toBeNull();
    expect(passwordError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('Password is required');
  });

  it('should call the user service and redirect if success', async () => {
    const harness = await RouterTestingHarness.create('/login');

    const subject = new Subject<UserModel>();
    userService.authenticate.and.returnValue(subject);

    const element = harness.routeNativeElement!;
    const loginInput = element.querySelector('input')!;
    expect(loginInput).withContext('You should have an input for the login').not.toBeNull();
    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput).withContext('You should have an input with the type `password` for the password').not.toBeNull();
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));
    harness.detectChanges();

    element.querySelector('button')!.click();

    // then we should have called the user service method
    expect(userService.authenticate).toHaveBeenCalledWith('login', 'password');

    subject.next({} as UserModel);
    await harness.fixture.whenStable();
    harness.detectChanges();

    // and redirect to the home
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/');
  });

  it('should call the user service and display a message if failed', async () => {
    const harness = await RouterTestingHarness.create('/login');

    const subject = new Subject<UserModel>();
    userService.authenticate.and.returnValue(subject);

    const element = harness.routeNativeElement!;
    expect(element.querySelector('.alert')).withContext('You should not have an error message before trying to log in').toBeNull();
    const loginInput = element.querySelector('input')!;
    expect(loginInput).withContext('You should have an input for the login').not.toBeNull();
    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput).withContext('You should have an input with the type `password` for the password').not.toBeNull();
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));
    harness.detectChanges();

    element.querySelector('button')!.click();

    // then we should have called the user service method
    expect(userService.authenticate).toHaveBeenCalledWith('login', 'password');

    subject.error(new Error());
    await harness.fixture.whenStable();
    harness.detectChanges();

    // and not redirect to the home
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/login');

    expect(element.querySelector('.alert'))
      .withContext('You should have a div with a class `alert` to display an error message')
      .not.toBeNull();
    expect(element.querySelector('.alert')!.textContent).toContain('Nope, try again');
  });
});
