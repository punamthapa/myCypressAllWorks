/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Prospects_PO from "../../../support/pageObjects/clients_PO/Prospects_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";

describe("Test in prospects submodule", () => {
    const homePage_PO = new HomePage_PO();
    const prospects_PO = new Prospects_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnClients();

        cy.wait(3000);
    });

    it("Should verify the added attachments count", () => {
        const numberOfAttachments = 3;
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const email = faker.internet.email();

        prospects_PO.clickOnProspectTab();

        cy.waitingForComponentToMount();

        prospects_PO
            .clickOnAddButton()
            .fillFormElements(firstName, lastName, email);

        cy.wait(3000);

        prospects_PO.selectRandomAssignee();

        cy.wait(2000);

        prospects_PO.clickOnSaveButton();

        cy.wait(2000);

        prospects_PO
            .clickOnFirstProspects()
            .clickOnDocumentTab()
            .attachDeviceAttachment(numberOfAttachments)
            .verifyAddedAttachments(numberOfAttachments);
    });
});
