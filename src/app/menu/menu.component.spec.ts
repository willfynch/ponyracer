import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    })
  );

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar')!;
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should have the class `collapse`')
      .toContain('collapse');

    const button = element.querySelector('button')!;
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.click();

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar')!;
    expect(navbar.classList)
      .withContext('The element with the id `#navbar` should have not the class `collapse` after a click')
      .not.toContain('collapse');
  });

  it('should use routerLink to navigate', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).withContext('You should have two routerLink: one to the races, one to the home').toBe(2);
  });
});
