describe('Ponyracer', () => {
  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  function startBackend(): void {
    cy.intercept('POST', 'api/users/authentication', user).as('authenticateUser');
    cy.intercept('GET', 'api/races?status=PENDING', []).as('getRaces');
  }

  function storeUserInLocalStorage(): void {
    localStorage.setItem('rememberMe', JSON.stringify(user));
  }

  beforeEach(() => {
    startBackend();
    localStorage.setItem('preferred-lang', 'en');
  });

  it('should display title on home page', () => {
    cy.visit('/');
    cy.contains('h1', 'Ponyracer');
    cy.contains('small', 'Always a pleasure to bet on ponies');
    cy.get('.btn-primary').contains('Login').should('have.attr', 'href', '/login');
    cy.get('.btn-primary').contains('Register').should('have.attr', 'href', '/register');
  });

  const navbarBrand = '.navbar-brand';
  const navbarLink = '.nav-link';

  it('should display a navbar', () => {
    cy.visit('/');
    cy.get(navbarBrand).contains('PonyRacer').should('have.attr', 'href', '/');
    cy.get(navbarLink).should('not.exist');
  });

  it('should display a navbar collapsed on small screen', () => {
    storeUserInLocalStorage();
    cy.viewport('iphone-6+');
    cy.visit('/');
    cy.contains(navbarBrand, 'PonyRacer');
    cy.get(navbarLink).should('not.be.visible');

    // toggle the navbar
    cy.get('.navbar-toggler').click();
    cy.get(navbarLink).should('be.visible');

    // toggle the navbar again
    cy.get('.navbar-toggler').click();
    cy.get(navbarLink).should('not.be.visible');
  });

  it('should display the logged in user in navbar and logout', () => {
    storeUserInLocalStorage();
    cy.visit('/races');
    cy.wait('@getRaces');

    // user stored should be displayed
    cy.get('#current-user').should('contain', 'cedric').and('contain', '1,000');

    // logout
    cy.get('span.fa.fa-power-off').click();

    // should be redirected to home page
    cy.location('pathname')
      .should('eq', '/')
      // and localStorage should be empty
      .and(() => expect(localStorage.getItem('rememberMe')).to.eq(null));
    cy.get(navbarLink).should('not.exist');

    // user is not displayed in navbar
    cy.get('#current-user').should('not.exist');

    // and home page offers the login link
    cy.get('.btn-primary').contains('Login').should('have.attr', 'href', '/login');
  });
});
