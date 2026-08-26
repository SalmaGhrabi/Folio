import { Component, signal } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

@Component({
  imports: [BrowserModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('folio-frontend');
}
