describe('List Component', () => {
  beforeEach(() => {
    // Login before each test
    cy.fixture('credentials.json').then((credentials) => {
      const { validUser } = credentials;
      cy.login(validUser.username, validUser.password);
      cy.url().should('include', '/list');
    });
  });

  it('should display initial cat facts', () => {
    // Check if virtual scroll viewport exists and has height
    cy.get('cdk-virtual-scroll-viewport')
      .should('exist')
      .invoke('height')
      .should('be.gt', 0);

    // Wait for facts to load and check if we have at least one fact
    cy.get('.bg-gray-200')
      .should('have.length.at.least', 1)
      .and('be.visible');
  });

  it('should load more facts on scroll', () => {
    // Get initial number of facts
    cy.get('.bg-gray-200').then($initialFacts => {
      const initialCount = $initialFacts.length;

      // Scroll to bottom
      cy.get('cdk-virtual-scroll-viewport').scrollTo('bottom', { ensureScrollable: false });

      // Check if more facts were loaded
      cy.get('.bg-gray-200', { timeout: 10000 })
        .should('have.length.gt', initialCount);
    });
  });

  it('should preserve scroll position when new fact is added', () => {
    // Scroll to a specific position
    cy.get('cdk-virtual-scroll-viewport').scrollTo(0, 200);

    // Get current first visible fact
    cy.get('.bg-gray-200').first().invoke('text').then((initialText) => {
      // Wait a moment for potential updates
      cy.wait(1000);

      // Verify the same fact is still visible
      cy.get('.bg-gray-200').first().invoke('text').should('eq', initialText);
    });
  });

  it('should show error after continuous scrolling', () => {
    let errorFound = false;

    // Function to scroll until error appears
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

    // Start scrolling
    scrollAndCheck();

    // Verify error message appears
    cy.get('.bg-red-100', { timeout: 30000 })
      .should('be.visible')
      .and('contain', 'Propably you know everything about cats now');

    // Verify Start Over button
    cy.get('button')
      .contains('Start over')
      .should('be.visible')
      .and('be.enabled');
  });

  it('should handle Start Over after reaching the limit', () => {
    let errorFound = false;

    // Function to scroll until error appears
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

    // First scroll until we get the error
    scrollUntilError();

    // Wait for error and Start Over button
    cy.get('.bg-red-100', { timeout: 30000 })
      .should('be.visible')
      .and('contain', 'Propably you know everything about cats now');

    cy.get('button')
      .contains('Start over')
      .should('be.visible')
      .and('be.enabled')
      .click();

    // After clicking Start Over:
    // 1. Error message should disappear
    cy.get('.bg-red-100').should('not.exist');

    // 2. Loading indicator should appear and then disappear
    cy.get('mat-progress-bar').should('exist');
    cy.get('mat-progress-bar').should('not.exist');

    // 3. New facts should be loaded at least 1 and mo nore than 20
    cy.get('.bg-gray-200')
      .should('have.length.at.least', 1).should('have.length.below', 20)
      .and('be.visible');

    // 4. Viewport should be scrolled to top
    cy.get('cdk-virtual-scroll-viewport')
      .invoke('scrollTop')
      .should('eq', 0);
  });

  it('should logout and redirect to login page', () => {
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
  });
});
