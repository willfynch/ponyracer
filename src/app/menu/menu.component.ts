import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [RouterLink, CommonModule]
})
export class MenuComponent {
  userService = inject(UserService);
  router = inject(Router);

  readonly navbarCollapsed = signal(true);
  readonly user = this.userService.currentUser;

  toggleNavbar(): void {
    this.navbarCollapsed.update(isCollapsed => !isCollapsed);
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/');
  }
}
