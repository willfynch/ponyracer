import { inject, Injectable, signal } from '@angular/core';
import { UserModel } from './models/user.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'https://ponyracer.ninja-squad.com';
  private http = inject(HttpClient);

  private user = signal<UserModel | undefined>(undefined);
  public readonly currentUser = this.user.asReadonly();

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
}
