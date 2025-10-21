describe('Cart feature', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    class cartPage {
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
        return function (value) {
            cy.get(element).contains(value).click();
        };
      }
    }
  
    it('Should add the product to the cart', () => {
      cy.fixture('login').then((user) => {
        const cart = new cartPage();
  
        cart.checkfield(".login_logo")("have.text")("Swag Labs");
        cart.fillfield("#user-name")(user.loginValid.username);
        cart.fillfield("#password")(user.loginValid.password);
        cart.buttonClick("#login-button")("Login");
        cart.checkfield(".title")("contain.text")("Products");
        cart.checkfield(".inventory_item_name")("contain.text")("Sauce Labs Bolt T-Shirt");
        cart.buttonClick(".inventory_item_name")("Sauce Labs Bolt T-Shirt")
        cart.checkfield(".btn.btn_primary.btn_small.btn_inventory")("contain.text")("Add to cart")
        cart.buttonClick(".btn.btn_primary.btn_small.btn_inventory")("Add to cart");
        cy.get(".shopping_cart_badge").invoke("text").then((text) => {
            expect(Number(text)).to.be.greaterThan(0);
          });
        cy.get(".shopping_cart_badge").click();
        cart.checkfield(".inventory_item_name")("contain.text")("Sauce Labs Bolt T-Shirt");
      });
    }); 
  });