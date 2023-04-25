/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Partners_PO from "../../../support/pageObjects/partners_PO/Partners_PO";

describe("Test in document subtab of partner module", () => {
    const homePage_PO = new HomePage_PO();
    const partner_PO = new Partners_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnPartnerModule();
    });

    //@todo verify added attachment count from table rows
    it("Should verify the added attachments count", () => {
        const numberOfAttachments = 3;
        const partnerName = faker.random.words();
        const email = faker.internet.email();

        cy.clickOnAddButton();

        cy.wait(2000);

        partner_PO
            .selectCurrencyCode()
            .enterEmail(email)
            .enterPartnerName(partnerName)
            .selectMasterCategory()
            .selectPartnerType()
            .selectWorkflow()
            .clickOnSaveButton()
            .clickOnFirstPartnerName()
            .clickOnDocumentTab()
            .attachDeviceAttachment(numberOfAttachments)
            .verifyAddedAttachments(numberOfAttachments);
    });
});
