import { config } from "../../../config/index";

class Login_PO {
    EMAIL_FIELD_SELECTOR = "#email";
    PASSWORD_FIELD_SELECTOR = "#password";
    VALIDATION_ERROR_SELECTOR = ".errorInput";

    visitLoginPage() {
        cy.visit(config.app.base_url);

        return this;
    }

    fillInvalidCredential() {
        cy.get(this.EMAIL_FIELD_SELECTOR).type("invalid@email.com");
        cy.get(this.PASSWORD_FIELD_SELECTOR).type("invalid_password");

        return this;
    }

    verifyInvalidCredentialValidation() {
        cy.get(this.VALIDATION_ERROR_SELECTOR)
            .first()
            .should("have.text", "These credentials do not match our records.");

        return this;
    }

    fillValidCredentials() {
        const appEmail = config.app.email;
        const appPassword = config.app.password;

        cy.get(this.EMAIL_FIELD_SELECTOR)
            .clear()
            .type(appEmail)
            .should("have.value", appEmail);

        cy.get(this.PASSWORD_FIELD_SELECTOR)
            .clear()
            .type(appPassword)
            .should("have.value", appPassword);

        return this;
    }

    clickOnLoginButton() {
        cy.get("#loginButton").click();

        return this;
    }

    validateEmptyValidation() {
        cy.get(this.VALIDATION_ERROR_SELECTOR)
            .first()
            .should("have.text", "The email field is required.");

        cy.get(this.VALIDATION_ERROR_SELECTOR)
            .last()
            .should("have.text", "The password field is required.");

        return this;
    }

    validateSuccessfulLogin() {
        cy.url().should("include", "/overview");

        cy.get(".loginWrapper > .LoginContainer.container").should("not.exist");
    }
}

export default Login_PO;
