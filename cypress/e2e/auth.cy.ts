describe('Authentication', () => {
  beforeEach(() => {
    cy.fixture('credentials.json').as('credentials');
  });

  it('should successfully login and redirect to list page', () => {
    cy.get('@credentials').then((credentials: any) => {
      const { validUser } = credentials;
      cy.login(validUser.username, validUser.password);
      cy.url().should('include', '/list');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.get('@credentials').then((credentials: any) => {
      const { invalidUser } = credentials;
      cy.login(invalidUser.username, invalidUser.password);
      cy.get('.text-red-500').should('contain', 'Invalid credentials!');
    });
  });

  it('should require login to access protected routes', () => {
    cy.visit('/list');
    cy.url().should('include', '/login');
  });

  it('should persist login state', () => {
    cy.get('@credentials').then((credentials: any) => {
      const { validUser } = credentials;
      cy.login(validUser.username, validUser.password);
      cy.url().should('include', '/list');

      cy.reload();
      cy.url().should('include', '/list');
    });
  });

  it('should logout successfully', () => {
    cy.get('@credentials').then((credentials: any) => {
      const { validUser } = credentials;
      cy.login(validUser.username, validUser.password);
      cy.url().should('include', '/list');

      cy.get('button').contains('Logout').click();
      cy.url().should('include', '/login');

      cy.visit('/list');
      cy.url().should('include', '/login');
    });
  });
});
