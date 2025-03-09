describe('List Component', () => {
  beforeEach(() => {
    cy.fixture('credentials.json').then((credentials) => {
      const { validUser } = credentials;
      cy.login(validUser.username, validUser.password);
      cy.url().should('include', '/list');
    });
  });

  it('should display initial cat facts', () => {
    cy.get('cdk-virtual-scroll-viewport')
      .should('exist')
      .invoke('height')
      .should('be.gt', 0);

    cy.get('.bg-gray-200')
      .should('have.length.at.least', 1)
      .and('be.visible');
  });

  it('should load more facts on scroll', () => {
    cy.get('.bg-gray-200').then($initialFacts => {
      const initialCount = $initialFacts.length;

      cy.get('cdk-virtual-scroll-viewport').scrollTo('bottom', { ensureScrollable: false });

      cy.get('.bg-gray-200', { timeout: 10000 })
        .should('have.length.gt', initialCount);
    });
  });

  it('should preserve scroll position when new fact is added', () => {
    cy.get('cdk-virtual-scroll-viewport').scrollTo(0, 200);

    cy.get('.bg-gray-200').first().invoke('text').then((initialText) => {
      cy.wait(1000);

      cy.get('.bg-gray-200').first().invoke('text').should('eq', initialText);
    });
  });

  it('should show error after continuous scrolling', () => {
    let errorFound = false;

    const scrollAndCheck = () => {
      if (!errorFound) {
        cy.document().then(doc => {
          const errorElement = doc.querySelector('.bg-red-100');
          errorFound = errorElement !== null;
          if (!errorFound) {
            cy.get('cdk-virtual-scroll-viewport')
              .scrollTo('bottom', { ensureScrollable: false })
              .wait(50)
              .then(() => scrollAndCheck());
          }
        });
      }
    };

    scrollAndCheck();

    cy.get('.bg-red-100', { timeout: 30000 })
      .should('be.visible')
      .and('contain', 'Probably you know everything about cats now');

    cy.get('button')
      .contains('Start over')
      .should('be.visible')
      .and('be.enabled');
  });

  it('should handle Start Over after reaching the limit', () => {
    let errorFound = false;

    const scrollUntilError = () => {
      if (!errorFound) {
        cy.document().then(doc => {
          const errorElement = doc.querySelector('.bg-red-100');
          errorFound = errorElement !== null;
          if (!errorFound) {
            cy.get('cdk-virtual-scroll-viewport')
              .scrollTo('bottom', { ensureScrollable: false })
              .wait(50)
              .then(() => scrollUntilError());
          }
        });
      }
    };

    scrollUntilError();

    cy.get('.bg-red-100', { timeout: 30000 })
      .should('be.visible')
      .and('contain', 'Probably you know everything about cats now');

    cy.get('button')
      .contains('Start over')
      .should('be.visible')
      .and('be.enabled')
      .click();

    cy.get('.bg-red-100').should('not.exist');

    cy.get('mat-progress-bar').should('exist');
    cy.get('mat-progress-bar').should('not.exist');

    cy.get('.bg-gray-200')
      .should('have.length.at.least', 1).should('have.length.below', 20)
      .and('be.visible');

    cy.get('cdk-virtual-scroll-viewport')
      .invoke('scrollTop')
      .should('eq', 0);
  });

  it('should logout and redirect to login page', () => {
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
  });
});
