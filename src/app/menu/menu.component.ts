import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [RouterLink]
})
export class MenuComponent {
  readonly navbarCollapsed = signal(true);

  toggleNavbar(): void {
    this.navbarCollapsed.update(isCollapsed => !isCollapsed);
  }
}
