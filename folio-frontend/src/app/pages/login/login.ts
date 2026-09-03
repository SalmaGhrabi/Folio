import { Component, signal } from '@angular/core';
import {AuthenticationRequest} from '../../services/models/authentication-request';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import {Token} from '../../services/token/token';
@Component({
  imports: [
    FormsModule
  ],

  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMessage = signal<string[]>([]);
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: Token
  ) {
  }

  login() {
    this.errorMessage.set([]);
    this.authService.authenticate({
        body: this.authRequest
      }).then((res) => {
        this.tokenService.token = res.token as string;
      this.router.navigate(['books']);
    }).catch((err) => {
      if (err.error?.validationErrors) {
        this.errorMessage.set(err.error.validationErrors);
      } else {
        this.errorMessage.set([err.error?.error]);
      }
    })
  }

  register() {
    this.router.navigate(['register']);
  }
}
