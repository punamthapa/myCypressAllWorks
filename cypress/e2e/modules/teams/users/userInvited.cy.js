/// <reference types= "cypress" />

import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Users_PO from "../../../../support/pageObjects/teams_PO/Users_PO";
import faker from "@faker-js/faker";
import "@testing-library/cypress/add-commands";

describe("Test of invited user inside Teams", () => {
    const homePage_PO = new HomePage_PO();
    const users_PO = new Users_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie().reload();

        homePage_PO.clickOnTeamsUser();

        cy.wait(3000);
    });

    it("Should verify the subsection in users landing page", () => {
        users_PO.verifySubSection();
    });

    context("Click on 'Invite User' button test", () => {
        beforeEach(() => {
            users_PO.clickOnInviteUser();
        });

        it("Should verify modal title", () => {
            users_PO.verifyModalTitle();
        });

        it("Should show validation error message if we invite user without mandatory fields", () => {
            users_PO.selectRelatedOfficeName();

            cy.wait(2000);

            users_PO.clickOnInviteButton().verifyEmptyValidationErrors();
        });

        context("Invite user dependent test", () => {
            beforeEach(function () {
                const firstName = faker.name.firstName();
                const lastName = faker.name.lastName();
                const email = "sahil.ranjit+" + firstName + "@globalyhub.com";
                const fullName = firstName + " " + lastName;

                cy.wrap(firstName).as("firstName");
                cy.wrap(lastName).as("lastName");
                cy.wrap(email).as("email");
                cy.wrap(fullName).as("fullName");

                users_PO.fillNameAndEmail(firstName, lastName, email);
            });

            it("Should verify the functionality of cancel button in invite user modal", function () {
                users_PO
                    .clickOnCancelButton()
                    .verifyNameAndEmail(
                        this.fullName,
                        this.email,
                        "not.contain"
                    );
            });

            it("Should verify selected office and role in invite user list", () => {
                users_PO
                    .selectRole()
                    .selectRelatedOfficeName()
                    .clickOnInviteButton()
                    .clickOnAcceptButton();

                cy.waitForActive();

                users_PO.clickOnSubSection("Invited");

                cy.wait(5000);

                users_PO.verifyOffice();
            });

            context("Invite user with default office dependent test", () => {
                beforeEach(() => {
                    users_PO.selectRole().clickOnInviteButton();
                });

                it("Should verify the functionality of cancel button while inviting user", function () {
                    users_PO
                        .clickOnPopUpCancelButton()
                        .verifyNameAndEmail(
                            this.fullName,
                            this.email,
                            "not.contain"
                        );
                });

                context(
                    "Invite user with default office dependent test",
                    () => {
                        beforeEach(() => {
                            users_PO.clickOnAcceptButton();

                            cy.waitForActive();

                            users_PO.clickOnSubSection("Invited");

                            cy.wait(5000);
                        });

                        it("Should verify invited user name and email in the list", function () {
                            users_PO
                                .verifyNameAndEmail(this.fullName, this.email)
                                .verifyRole();
                        });

                        it("Should verify the uniqueness of email", function () {
                            users_PO
                                .clickOnInviteUser()
                                .fillNameAndEmail(
                                    this.firstName,
                                    this.lastName,
                                    this.email
                                )
                                .selectRole()
                                .clickOnInviteButton()
                                .clickOnAcceptButton();

                            cy.wait(3000);

                            users_PO.verifyUniqueEmailMessage();
                        });

                        it("Should verify the functionality of search bar", function () {
                            users_PO
                                .searchForUser(this.firstName)
                                .verifyNameAndEmail(this.fullName, this.email);
                        });

                        context("Cancel Invitation dependent test", () => {
                            beforeEach(() => {
                                users_PO.clickOnCancelInvitation();
                            });

                            it("Should verify the functionality of cancel button in popup", function () {
                                users_PO
                                    .clickOnPopUpCancelButton()
                                    .verifyNameAndEmail(
                                        this.fullName,
                                        this.email
                                    );
                            });

                            it("Should verify invitation is removed after canceling invitation", function () {
                                users_PO.clickOnAcceptButton();

                                cy.wait(2000);

                                users_PO.verifyNameAndEmail(
                                    this.fullName,
                                    this.email,
                                    "not.contain"
                                );
                            });
                        });
                    }
                );
            });
        });
    });
});
