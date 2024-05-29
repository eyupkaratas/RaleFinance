import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import User from '../../models/user';
import environment from '../../../environments/environment';
import AuthGlobalService from '../global/auth-global.service';

@Injectable({
  providedIn: 'root',
})
export default class AuthApiService {
  readonly #http = inject(HttpClient);

  readonly #authStore = inject(AuthGlobalService);

  readonly #API_URL = environment.API_URL;

  #performLoginAction(email: string, password: string): Observable<User> {
    return this.#http
      .post<User>(`${this.#API_URL}/login`, {
        email,
        password,
      })
      .pipe(
        tap((user) => this.#authStore.loginUser(user)),
        shareReplay()
      );
  }

  #performSignupAction(
    email: string,
    password: string,
    name: string,
    surname: string
  ): Observable<User> {
    return this.#http
      .post<User>(`${this.#API_URL}/signup`, {
        email,
        password,
        name,
        surname,
        goal_text: '',
        goal_amount: 0,
      })
      .pipe(shareReplay());
  }

  login(email: string, password: string): Observable<User> {
    return this.#performLoginAction(email, password);
  }

  signup(
    email: string,
    password: string,
    name: string,
    surname: string
  ): Observable<User> {
    return this.#performSignupAction(email, password, name, surname);
  }
}
