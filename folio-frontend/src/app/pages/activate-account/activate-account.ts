import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services/authentication.service';

@Component({
  imports: [],
  selector: 'app-activate-account',
  styleUrl: './activate-account.css',
  templateUrl: './activate-account.html',
})
export class ActivateAccount {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  code = signal<string[]>(['', '', '', '', '', '']);
  submitted = signal<boolean>(false);
  isOkay = signal<boolean>(true);
  message = signal<string>('');

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
    input.value = value;

    const updated = [...this.code()];
    updated[index] = value;
    this.code.set(updated);

    if (value && index < 5) {
      this.focusInput(index + 1);
    }

    if (this.isCodeComplete()) {
      this.confirmAccount(this.getFullCode());
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const updated = [...this.code()];
      if (updated[index]) {
        updated[index] = '';
        this.code.set(updated);
      } else if (index > 0) {
        updated[index - 1] = '';
        this.code.set(updated);
        this.focusInput(index - 1);
      }
    }
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 6) || '';
    const updated = ['', '', '', '', '', ''];
    pasted.split('').forEach((char, i) => updated[i] = char);
    this.code.set(updated);

    const inputs = this.codeInputs.toArray();
    inputs.forEach((el, i) => el.nativeElement.value = updated[i]);

    const nextEmpty = updated.findIndex(c => c === '');
    this.focusInput(nextEmpty === -1 ? 5 : nextEmpty);

    if (this.isCodeComplete()) {
      this.confirmAccount(this.getFullCode());
    }
  }

  focusInput(index: number) {
    const inputs = this.codeInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  getFullCode(): string {
    return this.code().join('');
  }

  isCodeComplete(): boolean {
    return this.code().every(c => c !== '');
  }

  private confirmAccount(token: string) {
    this.authService.confirm({ token })
      .then(() => {
        this.message.set('Your account has been successfully activated. Now you can proceed to login.');
        this.submitted.set(true);
        this.isOkay.set(true);
      })
      .catch(() => {
        this.message.set('Token has been expired or invalid.');
        this.submitted.set(true);
        this.isOkay.set(false);
      });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  tryAgain() {
    this.submitted.set(false);
    this.isOkay.set(true);
    this.message.set('');
    this.code.set(['', '', '', '', '', '']);
    const inputs = this.codeInputs.toArray();
    inputs.forEach(el => el.nativeElement.value = '');
    setTimeout(() => this.focusInput(0), 100);
  }
}
