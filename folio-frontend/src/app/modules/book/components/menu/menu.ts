import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

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
  protected readonly isCollapsed = signal<boolean>(true);

  protected readonly username = signal<string>('Salma');

  protected readonly navItems: readonly NavItem[] = [
    { label: 'Home', route: '/books', icon: 'fa-home-alt', exact: true },
    { label: 'My books', route: '/my-books', icon: 'fa-book' },
    { label: 'My waiting list', route: '/my-waiting-list', icon: 'fa-heart' },
    { label: 'Returned books', route: '/my-returned-books', icon: 'fa-arrows-turn-right' },
    { label: 'Borrowed books', route: '/my-borrowed-books', icon: 'fa-clock' },
  ];

  protected toggleMenu(): void {
    this.isCollapsed.update(state => !state);
  }

  protected logout(): void {
    this.router.navigate(['/login']);
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
  }
}
