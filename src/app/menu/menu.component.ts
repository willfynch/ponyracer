import { Component, signal } from '@angular/core';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  readonly navbarCollapsed = signal(true);

  toggleNavbar(): void {
    this.navbarCollapsed.update(isCollapsed => !isCollapsed);
  }
}
