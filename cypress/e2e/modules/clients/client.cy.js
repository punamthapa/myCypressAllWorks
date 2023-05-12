/// <reference types= "cypress" />

import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Clients_PO from "../../../support/pageObjects/clients_PO/Clients_PO";
import Faker_PO from "../../../support/faker/Faker_PO";

const clients_PO = new Clients_PO();
const faker_PO = new Faker_PO();

describe("Test in client submodule", () => {
    const homePage_PO = new HomePage_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnClients();

        cy.wait(3000);
    });

    context("Add client dependent test", () => {
        beforeEach(() => {
            const firstName = faker_PO.firstName();
            const lastName = faker_PO.lastName();
            const email = faker_PO.email();
            const fullName = firstName + " " + lastName;

            cy.wrap(firstName).as("firstName");
            cy.wrap(lastName).as("lastName");
            cy.wrap(email).as("email");
            cy.wrap(fullName).as("fullName");

            clients_PO
                .clickOnAddButton()
                .fillFormElements(firstName, lastName, email)
                .selectRandomAssignee()
                .selectRandomApplication()
                .clickOnSaveButton();

            cy.reload();

            clients_PO.verifyInputDataInLists(
                "contain",
                firstName,
                lastName,
                email
            );
        });

        it("Should verify added client in client profile", function () {
            clients_PO
                .clickOnFirstClient()
                .verifyClientNameInProfile(this.fullName);
        });

        it("Should edit client and verify in table row and client profile", function () {
            const updatedFirstName = faker_PO.firstName();
            const updatedLastName = faker_PO.lastName();
            const updatedEmail = faker_PO.email();
            const updatedfullName = updatedFirstName + " " + updatedLastName;

            clients_PO
                .clickOnFirstActivityButton()
                .clickOnEditOption()
                .editFormDetails(
                    updatedFirstName,
                    updatedLastName,
                    updatedEmail
                )
                .clickOnSaveButton();

            cy.wait(3000);

            clients_PO
                .verifyInputDataInLists(
                    "contain",
                    updatedFirstName,
                    updatedLastName,
                    updatedEmail
                )
                .clickOnFirstClient()
                .verifyClientNameInProfile(updatedfullName);
        });

        it.only("Should verify added application in client application tab", function () {
            clients_PO.clickOnFirstClient().clickOnApplicationTab();

            cy.wait(2000);

            clients_PO.verifyAddedApplicationInCLient();
        });

        it.only("Should archive client", function () {
            clients_PO.clickOnFirstClient().clickOnApplicationTab();

            cy.wait(2000);
            clients_PO
                .clickOnAddedApplication()
                .clickOnDiscontinueBtn()
                .clickOnDiscontinueReasonDropdown()
                .enterNotes(note)
                .clickOnConfirmButton();
        });
    });
});
