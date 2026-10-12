import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  fullname: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') ?? '';
  }

  get username(): string {
    const token = this.token;
    if (!token) {
      return '';
    }
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.fullname ?? '';
  }

  isTokenNotValid() {
    return !this.isTokenValid();
  }

  private isTokenValid() {
    const token = this.token;
    if (!token) {
      return false;
    }
    const decoded = jwtDecode<JwtPayload>(token);
    const isTokenExpired = decoded.exp<Math.floor(Date.now() / 1000);
    if (isTokenExpired) {
      localStorage.clear();
      return false;
    }
    return true;
  }
}
