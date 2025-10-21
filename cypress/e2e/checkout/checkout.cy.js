import { faker } from '@faker-js/faker';

let data = {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    postalcode: faker.location.zipCode(),
};

describe('Checkout feature', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    class checkOutPage {
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

        fillInField(element){
            return function(value){
                cy.get(element).type(value);
            }
        }

        buttonClick(element) {
            return function (value) {
                cy.get(element).contains(value).click();
            }
        }
    }
    it('Should finish the checkout', () => {
        cy.fixture('login').then((user) => {
            const check = new checkOutPage();

            check.checkfield(".login_logo")("have.text")("Swag Labs");
            check.fillfield("#user-name")(user.loginValid.username);
            check.fillfield("#password")(user.loginValid.password);
            check.buttonClick("#login-button")('Login');
            check.checkfield(".title")("contain.text")("Products");

            check.checkfield(".inventory_item_name")("contain.text")("Sauce Labs Bolt T-Shirt");
            check.buttonClick(".inventory_item_name")("Sauce Labs Bolt T-Shirt");
            check.checkfield("button")("contain.text")("Add to cart");
            check.buttonClick("button")("Add to cart");

            cy.get(".shopping_cart_badge").invoke("text").then((text) => {
                expect(Number(text)).to.be.greaterThan(0);
            });
            cy.get(".shopping_cart_badge").click();

            check.checkfield(".title")("contain.text")("Your Cart");
            check.checkfield(".cart_desc_label")("contain.text")("Description");
            check.checkfield(".inventory_item_name")("contain.text")("Sauce Labs Bolt T-Shirt");
            check.buttonClick("button")("Checkout");

            check.checkfield(".title")("contain.text")("Checkout: Your Information");
            check.fillInField("input[placeholder='First Name']")(data.firstname);
            check.fillInField("input[placeholder='Last Name']")(data.lastname);
            check.fillInField("input[placeholder='Zip/Postal Code']")(data.postalcode);
            check.checkfield("#continue")("contain.value")("Continue");
            check.buttonClick("#continue")("Continue");

            check.checkfield(".title")("contain.text")("Checkout: Overview");
            check.checkfield(".cart_desc_label")("contain.text")("Description");
            cy.get(".cart_item .cart_quantity").invoke("text").then((text) => {
                expect(Number(text)).to.be.greaterThan(0);
            });

            check.checkfield(".inventory_item_name")("contain.text")("Sauce Labs Bolt T-Shirt");
            check.checkfield(".inventory_item_desc")("contain.text")("Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.");
            check.checkfield(".inventory_item_price")("contain.text")("$15.99");
            check.checkfield(".summary_info_label")("contain.text")("Payment Information:");
            check.checkfield(".summary_value_label")("contain.text")("SauceCard #31337");
            check.checkfield(".summary_info_label")("contain.text")("Shipping Information:");
            check.checkfield(".summary_value_label")("contain.text")("Free Pony Express Delivery!");
            check.checkfield(".summary_info_label")("contain.text")("Price Total");
            check.checkfield(".summary_subtotal_label")("contain.text")("Item total: $15.99");
            check.checkfield(".summary_tax_label")("contain.text")("Tax: $1.28");
            check.checkfield(".summary_total_label")("contain.text")("Total: $17.27");
            check.buttonClick("button")("Finish");

            check.checkfield(".complete-header")("contain.text")("Thank you for your order!");
            check.checkfield(".complete-text")("contain.text")("Your order has been dispatched, and will arrive just as fast as the pony can get there!");
        });
    });
});