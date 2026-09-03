import {Component, signal} from '@angular/core';
import {RegistrationRequest} from '../../services/models/registration-request';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import {Token} from '../../services/token/token';

@Component({
  imports: [
    FormsModule
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {

  registerRequest: RegistrationRequest = {email: '', firstname: '', lastname: '', password: ''};
  errorMessage = signal<string[]>([]);
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  register() {
    this.errorMessage.set([]);
    this.authService.register({
        body: this.registerRequest
    }).then(result => {
      this.router.navigate(['activate-account']);
    }).catch(error => {
      if (error.error?.validationErrors) {
        this.errorMessage.set(error.error.validationErrors);
      } else if (error.error?.errorMessage) {
        this.errorMessage.set([error.error.errorMessage]);
      } else {
        this.errorMessage.set(['Something went wrong. Please try again.']);
      }
    })
  }

  login() {
    this.router.navigate(['login']);
  }
}
