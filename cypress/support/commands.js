import Login_PO from "../support/pageObjects/Login_PO";
import HomePage_PO from "./pageObjects/HomePage_PO";
import { config } from "../../config/index";
import Pagination_PO from "./pageObjects/Pagination_PO";
import "cypress-v10-preserve-cookie";

const login_PO = new Login_PO();
const homepage_PO = new HomePage_PO();
Cypress.Commands.add("login", () => {
    login_PO
        .visitLoginPage()
        .clickOnLoginButton()
        .validateEmptyValidation()
        .fillInvalidCredential()
        .clickOnLoginButton()
        .verifyInvalidCredentialValidation()
        .fillValidCredentials()
        .clickOnLoginButton()
        .validateSuccessfulLogin();
});

Cypress.Commands.add("preserveAppCookie", () => {
    cy.preserveCookieOnce("laravel_token", "Agentcis");
});

Cypress.Commands.add("verifyDrawerExistence", () => {
    cy.get(".ag-drawer__container").should("exist");
});

Cypress.Commands.add("logout", () => {
    const redirectStatusCode = 302;

    cy.clearCookies();

    homepage_PO.clickOnLogOutMenu();

    cy.url().should("eq", config.app.base_url);

    cy.get(".loginWrapper > .LoginContainer.container").should("be.visible");

    cy.request({
        url: config.app.base_url + "overview",
        followRedirect: false,
    }).then((response) => {
        expect(response.status).to.eq(redirectStatusCode);
        expect(response.redirectedToUrl).to.eq(
            config.app.base_url + "auth/login"
        );
    });
});

Cypress.Commands.add("verifyPaginator", () => {
    const paginatorPO = new Pagination_PO();

    paginatorPO
        .verifyPaginationLabel()
        .verifyPaginatorLimitsOptions()
        .verifyPaginationButtonsExistence()
        .verifyStateOfBackButtonInPaginator()
        .verifyStateOfNextButtonInPaginator()
        .verifyRecordCountAndPageLimit()
        .selectPaginatorLimitAndVerifyItsExistence()
        .clickNextButtonInPaginatorUptoEnd();
});

Cypress.Commands.add("clickOnAddButton", () => {
    cy.get(".button").contains("Add").click({ force: true });
});

Cypress.Commands.add("checkValidationErrors", (validationErrors) => {
    cy.get(".ui.basic.js-input-error")
        .as("validationErrorSelector")
        .should("exist");

    cy.get("@validationErrorSelector").each(
        (validationErrorsSelector, index) => {
            expect(validationErrorsSelector).to.contain.text(
                validationErrors[index]
            );
        }
    );
});

Cypress.Commands.add("waitingForComponentToMount", () => {
    cy.intercept("GET", "/api/**").as("apiData");

    cy.wait("@apiData");
});

Cypress.Commands.add("waitForActive", () => {
    cy.intercept("GET", "/api/v2/roles/all").as("activeUsers");

    cy.wait("@activeUsers");
});

Cypress.Commands.add("findByActionName", (actionName) => {
    cy.get(`[data-dd-action-name="${actionName}"]`);
});
