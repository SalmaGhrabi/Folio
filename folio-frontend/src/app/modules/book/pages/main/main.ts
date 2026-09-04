import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Menu} from '../../components/menu/menu';

@Component({
  imports: [
    RouterOutlet,
    Menu
  ],
  selector: 'app-main',
  styleUrl: './main.css',
  templateUrl: './main.html',
})
export class Main {}
