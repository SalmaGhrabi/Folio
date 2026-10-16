import {Component, signal} from '@angular/core';
import {RegistrationRequest} from '../../services/models/registration-request';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';

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
    }).catch(err => {
      console.error('Registration error:', err);
      if (err.error?.validationErrors) {
        this.errorMessage.set(err.error.validationErrors);
      } else if (err.error?.error) {
        this.errorMessage.set([err.error.error]);
      } else {
        this.errorMessage.set(['Une erreur est survenue lors de l\'inscription.']);
      }
    })
  }

  login() {
    this.router.navigate(['login']);
  }
}
