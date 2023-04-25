/// <reference types= "cypress"/>

import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Users_PO from "../../../../support/pageObjects/teams_PO/Users_PO";
import faker from "@faker-js/faker";
import "@testing-library/cypress/add-commands";

describe("Test of Active section in user", () => {
    const homePage_PO = new HomePage_PO();
    const user_PO = new Users_PO();

    before(() => {
        cy.login();

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        //static email is used since third party email integration is not done
        const email = "elisha.dongol+" + firstName + "@globalyhub.com";
        const fullName = firstName + " " + lastName;
        const position = faker.random.word();

        cy.wrap(firstName).as("firstName");
        cy.wrap(lastName).as("lastName");
        cy.wrap(email).as("email");
        cy.wrap(fullName).as("fullName");
        cy.wrap(position).as("position");

        homePage_PO.clickOnTeamsUser();

        cy.wait(3000);

        user_PO
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
    });

    beforeEach(() => {
        cy.preserveAppCookie().reload();
    });

    it("Should verify the subsection in users landing page", () => {
        user_PO.verifySubSection();
    });

    it("Should verify user exists in the active list after accepting invitation", function () {
        user_PO
            .verifyName(this.fullName)
            .verifyEmail(this.email)
            .verifyPosition(this.position)
            .verifyRole();
    });

    it("Verify the functionality of searchbar", function () {
        user_PO
            .searchForUser(this.fullName)
            .verifyName(this.firstName)
            .verifyEmail(this.email)
            .verifyPosition(this.position)
            .searchForUser(" ");
    });

    context("Test for making user inactive", () => {
        beforeEach(() => {
            user_PO.clickOnMakeInactive();
        });

        it("Verify the functionality of Cancel button", function () {
            user_PO.clickOnCancelButton();

            cy.wait(4000);

            user_PO.verifyName(this.fullName);
        });

        it("Verify user does not exists in the list after making user inactive", function () {
            user_PO
                .clickOnSaveButton()
                .verifyName(this.fullName, "not.contain");
        });
    });

    context("Edit user dependent test", () => {
        beforeEach(() => {
            user_PO.clickOnEditButton();

            cy.wait(3000);
        });

        it("Should verify existence of edit page", () => {
            user_PO.verifyEditPage();

            cy.go("back");
        });

        it("Should show validation error message if we update without mandatory fields ", () => {
            user_PO
                .fillLastName(" ")
                .fillFirstName(" ")
                .fillPosition(" ")
                .clickOnUpdateButton()
                .verifyEmptyValidationErrors();

            cy.go("back");
        });

        context("Test after fill edited data", () => {
            beforeEach(() => {
                const newFirstName = faker.name.firstName();
                const newLastName = faker.name.lastName();
                const newFullName = newFirstName + " " + newLastName;
                const newPosition = faker.random.word();

                cy.wrap(newFirstName).as("newFirstName");
                cy.wrap(newLastName).as("newLastName");
                cy.wrap(newFullName).as("newFullName");
                cy.wrap(newPosition).as("newPosition");

                user_PO
                    .fillFirstName(newFirstName)
                    .fillLastName(newLastName)
                    .fillPosition(newPosition);
            });

            it("Verify the functionality of Cancel button", function () {
                user_PO.clickOnCancelButton();

                cy.wait(4000);

                user_PO.verifyUserName(this.newFirstName, "not.contain");
            });

            it("Verify the user has edited details", function () {
                user_PO
                    .clickOnUpdateButton()
                    .verifyUserName(this.newFirstName, "not.contain");

                homePage_PO.clickOnTeamsUser();

                cy.wait(3000);

                user_PO
                    .verifyName(this.newFullName)
                    .verifyPosition(this.newPosition);
            });
        });
    });
});
