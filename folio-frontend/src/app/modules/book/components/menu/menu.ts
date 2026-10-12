import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TokenService} from '../../../../services/token/token';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Menu {
  private readonly router = inject(Router);
  private tokenService = inject(TokenService);
  protected readonly isCollapsed = signal<boolean>(true);

  protected readonly username = signal(this.tokenService.username);

  protected readonly navItems: readonly NavItem[] = [
    { label: 'Home', route: '/books', icon: 'fa-home-alt', exact: true },
    { label: 'My books', route: '/books/my-books', icon: 'fa-book' },
    { label: 'My waiting list', route: '/books/my-waiting-list', icon: 'fa-heart' },
    { label: 'Returned books', route: '/books/my-returned-books', icon: 'fa-arrows-turn-right' },
    { label: 'Borrowed books', route: '/books/my-borrowed-books', icon: 'fa-clock' },
  ];

  protected toggleMenu(): void {
    this.isCollapsed.update(state => !state);
  }

  protected logout(): void {
    localStorage.removeItem('token');
    window.location.reload();
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
  }
}
