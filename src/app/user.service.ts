import { effect, inject, Injectable, signal } from '@angular/core';
import { UserModel } from './models/user.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'https://ponyracer.ninja-squad.com';
  private http = inject(HttpClient);

  private user = signal<UserModel | undefined>(this.retrieveUser());
  public readonly currentUser = this.user.asReadonly();

  constructor() {
    effect(
      () => {
        if (this.user()) {
          window.localStorage.setItem(REMEMBER_ME, JSON.stringify(this.user()));
        } else {
          window.localStorage.removeItem(REMEMBER_ME);
        }
      },
      { debugName: 'loginEffect' }
    );
  }

  authenticate(login: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>(this.url + '/api/users/authentication', { login: login, password: password }).pipe(
      tap((user: UserModel) => {
        this.user.set(user);
      })
    );
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    return this.http.post<UserModel>(this.url + '/api/users', { login: login, password: password, birthYear: birthYear });
  }

  logout() {
    this.user.set(undefined);
  }

  private retrieveUser(): UserModel | undefined {
    if (window.localStorage.getItem(REMEMBER_ME)) {
      return JSON.parse(window.localStorage.getItem(REMEMBER_ME)!);
    } else {
      return undefined;
    }
  }
}

export const REMEMBER_ME = 'rememberMe';
