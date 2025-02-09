describe('Create User', () => {
  it('Should submit and show a success pop up', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#submitBtn').click()

    cy.get('.popup').contains('Registration Successful!');
    cy.get('.popup > button').click()
  })

  it('Should show error message when email and confirm email do not match', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe2@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#confirmEmailError').contains('Email addresses do not match');
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when full name is omitted', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#nameError').contains('Please enter your full name');
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when email is omitted', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#emailError').contains('Please enter a valid email address')
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when email confirmation is omitted', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#confirmEmailError').contains('Email addresses do not match');
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when password is omitted', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')

    cy.get('#passwordErrorShort').contains('Please enter a password at least 8 characters long');
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when password is too short', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('short!')

    cy.get('#passwordErrorShort').contains('Please enter a password at least 8 characters long');
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when password is too weak', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('longbutweak')

    cy.get('#passwordErrorWeak').contains('Please enter a stronger password');
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should show error message when field is emptied after form completion', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#email').clear()

    cy.get('#emailError').contains('Please enter a valid email address')
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should not accept a number as an email', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John Doe')
    cy.get('#email').type('123')
    cy.get('#confirmEmail').type('123')
    cy.get('#password').type('Password!123')

    cy.get('#emailError').contains('Please enter a valid email address')
    cy.get('#submitBtn').should('be.disabled');
  })

  it('Should not accept only first name in user full name', () => {
    cy.visit('http://127.0.0.1:5500/frontend/index.html')

    cy.get('#submitBtn').should('be.disabled');

    cy.get('#name').type('John')
    cy.get('#email').type('johndoe@gmail.com')
    cy.get('#confirmEmail').type('johndoe@gmail.com')
    cy.get('#password').type('Password!123')

    cy.get('#nameError').contains('Please enter your full name');
    cy.get('#submitBtn').should('be.disabled');
  })
})