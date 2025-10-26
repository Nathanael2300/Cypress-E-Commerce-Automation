import 'cypress-mochawesome-reporter/register';

describe('Login feature', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  class loginPage {
    fillfield(field) {
      return function (value) {
        cy.get(field).type(value);
      };
    }

    checkfield(element) {
      return function (condition) {
        return function (field) {
          cy.get(element).should(condition, field);
        };
      };
    }

    buttonClick(element) {
      return function (condition) {
        cy.get(element).contains(condition).click();
      }
    }
  }

  it('Should log-in successfully with valid credentials', () => {
    cy.fixture('login').then((user) => {
      const login = new loginPage();

      login.checkfield(".login_logo")("have.text")("Swag Labs");
      login.fillfield("#user-name")(user.loginValid.username);
      login.fillfield("#password")(user.loginValid.password);
      login.buttonClick("input")("Login");
      login.checkfield(".title")("contain.text")("Products");
    });
  });
  afterEach(() => {
    cy.screenshot(); 
  });
});
