import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  fullname: string;
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
}
