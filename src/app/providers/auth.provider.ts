import {Role, User} from '@aaajm/client';
import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';

const {Admin, SuperAdmin} = Role;

type Token = {accessToken: string; refresshToken: string};
@Injectable({
  providedIn: 'root',
})
export class AuthProvider {
  private router = inject(Router);
  private savedUser = localStorage.getItem('current_user');
  private savedToken = localStorage.getItem('jwt_token');
  private _currentUser = signal<User | null>(
    this.savedUser ? JSON.parse(this.savedUser) : null
  );
  private _token = signal<Token | null>(
    this.savedToken ? JSON.parse(this.savedToken) : null
  );

  token = this._token.asReadonly();
  currentUser = this._currentUser.asReadonly();

  isLoggedIn = computed(() => this.currentUser() && this.token());
  isAdmin = computed(() => this.currentUser()?.role == 'ADMIN');

  labeledRole = {
    [Admin]: 'Administrateur',
  };

  setUser(user: User) {
    this._currentUser.set(user);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  setToken(token: Token) {
    localStorage.setItem('jwt_token', JSON.stringify(token));
    this._token.set(token);
  }

  getToken() {
    return this.token();
  }
  logout() {
    localStorage.clear();
    this._currentUser.set(null);
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}

export const AuthStorage = {
  accessToken: () =>
    JSON.parse(localStorage.getItem('jwt_token') || 'null')?.accessToken || '',
};
