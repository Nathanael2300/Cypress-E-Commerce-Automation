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
        cy.get(element).click();
      }
    }
  
    it('Should log-in and log-out successfully', () => {
      cy.fixture('login').then((user) => {
        const login = new loginPage();
  
        login.checkfield(".login_logo")("have.text")("Swag Labs");
        login.fillfield("#user-name")(user.loginValid.username);
        login.fillfield("#password")(user.loginValid.password);
        login.buttonClick("#login-button");
        login.checkfield(".title")("have.text")("Products");
  
        login.buttonClick("#react-burger-menu-btn");
        login.buttonClick("#logout_sidebar_link");
        login.checkfield(".login_logo")("have.text")("Swag Labs");
      });
    });
  });
  