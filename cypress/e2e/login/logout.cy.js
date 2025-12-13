import 'cypress-mochawesome-reporter/register';

describe('Logout feature', () => {
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
  
    it('Should log-in and log-out successfully', () => {
      cy.fixture('login').then((user) => {
        const loginout = new loginPage();
  
        loginout.checkfield(".login_logo")("have.text")("Swag Labs");
        loginout.fillfield("#user-name")(user.loginValid.username);
        loginout.fillfield("#password")(user.loginValid.password);
        loginout.buttonClick("input")("Login");
        loginout.checkfield(".title")("contain.text")("Products");
  
        loginout.buttonClick("button")("Open Menu");
        loginout.buttonClick("a")("Logout");
        loginout.checkfield(".login_logo")("contain.text")("Swag Labs");
      });
    });
    afterEach(() => {
      cy.screenshot(); 
    });
  });
  
