/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Prospects_PO from "../../../support/pageObjects/clients_PO/Prospects_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";

const prospects_PO = new Prospects_PO();

describe("Test in prospects submodule", () => {
    const homePage_PO = new HomePage_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnClients();

        cy.wait(3000);
    });

    context("Add prospects dependent test", () => {
        beforeEach(() => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const email = faker.internet.email();

            cy.wrap(firstName).as("firstName");
            cy.wrap(lastName).as("lastName");
            cy.wrap(email).as("email");

            prospects_PO.clickOnProspectTab();

            cy.waitingForComponentToMount();

            prospects_PO
                .clickOnAddButton()
                .fillFormElements(firstName, lastName, email);

            cy.wait(3000);

            prospects_PO.selectRandomAssignee();

            cy.wait(2000);

            prospects_PO.clickOnSaveButton();

            cy.wait(5000);

            prospects_PO.verifyInputDataInLists(
                "contain",
                firstName,
                lastName,
                email
            );
        });

        it("Should edit added prospects and verify its existence", () => {
            const editedFirstName = faker.name.firstName();
            const editedLastName = faker.name.lastName();
            const editedEmail = faker.internet.email();

            prospects_PO
                .clickOnFirstActivityButton()
                .clickOnEditOption()
                .editFormDetails(editedFirstName, editedLastName, editedEmail)
                .clickOnSaveButton()
                .verifyInputDataInLists(
                    "contain",
                    editedFirstName,
                    editedLastName,
                    editedEmail
                );
        });

        it("Should archive first prospects and verify it", function () {
            prospects_PO
                .clickOnFirstActivityButton()
                .clickOnArchiveOption()
                .clickOnAcceptButton();

            cy.wait(3000);

            prospects_PO.verifyInputDataInLists(
                "not.contain",
                this.firstName,
                this.lastName,
                this.email
            );
        });

        it("Should add application in prospect and verify the prospects in client lists ", function () {
            prospects_PO.clickOnFirstProspects();

            cy.wait(3000);

            prospects_PO
                .clickOnApplicationTab()
                .clickOnAddApplicationButton()
                .selectRandomWorkflow()
                .selectRandomPartner()
                .selectRandomProduct()
                .clickOnSaveButton();

            homePage_PO.clickOnClients();

            prospects_PO.verifyInputDataInLists(
                "contain",
                this.firstName,
                this.lastName,
                this.email
            );
        });
    });
});
