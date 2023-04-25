/// <reference types="cypress"/>

import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Users_PO from "../../../../support/pageObjects/teams_PO/Users_PO";
import faker from "@faker-js/faker";
import "@testing-library/cypress/add-commands";

describe("Test of Inactive section in user", () => {
    const homePage_PO = new HomePage_PO();
    const users_PO = new Users_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();
    });

    context("Make user inactive dependent test ", () => {
        before(() => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            //static email is used since third party email integration is not done
            const email = "sahil.ranjit+" + firstName + "@globalyhub.com";
            const fullName = firstName + " " + lastName;
            const position = faker.random.word();

            cy.wrap(firstName).as("firstName");
            cy.wrap(lastName).as("lastName");
            cy.wrap(email).as("email");
            cy.wrap(fullName).as("fullName");
            cy.wrap(position).as("position");

            homePage_PO.clickOnTeamsUser();

            cy.wait(3000);

            users_PO
                .clickOnInviteUser()
                .fillFirstName(firstName)
                .fillLastName(lastName)
                .fillEmail(email)
                .fillPosition(position)
                .selectRole()
                .clickOnInviteButton()
                .clickOnAcceptButton();

            //@todo to accept invitation from gmail since we are using sahil email
            cy.pause().reload();

            users_PO.clickOnMakeInactive().clickOnSaveButton();

            cy.reload();
        });

        it("Should verify inactive user does not exist in active list", function () {
            users_PO
                .verifyName(this.fullName, "not.contain")
                .verifyEmail(this.email, "not.contain");
        });

        it("Should verify inactive user exists in inactive list", function () {
            users_PO.clickOnInactiveTab();

            cy.wait(5000);

            users_PO
                .verifyName(this.fullName)
                .verifyEmail(this.email)
                .verifyPosition(this.position)
                .verifyRole();
        });
    });
});
