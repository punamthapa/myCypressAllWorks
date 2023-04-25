/// <reference types= "cypress" />

import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Partners_PO from "../../../support/pageObjects/partners_PO/Partners_PO";
import faker from "@faker-js/faker";

describe("Test in partner module", () => {
    const homePage_PO = new HomePage_PO();
    const partner_PO = new Partners_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnPartnerModule();
    });

    it("Should verify the tab title in partner tab", () => {
        partner_PO.verifyTabTitle();
    });

    context("Click on add button  dependent test", () => {
        beforeEach(() => {
            cy.clickOnAddButton();
        });

        it("Should verify empty validation error when adding new partner", () => {
            partner_PO.clickOnSaveButton().checkEmptyValidationErrors();
        });

        context("Add new partner type dependent test", () => {
            beforeEach(() => {
                const partnerName = faker.random.words();
                const email = faker.internet.email();

                cy.wrap(partnerName).as("partnerName");
                cy.wrap(email).as("email");

                cy.wait(2000);

                partner_PO
                    .selectCurrencyCode()
                    .enterEmail(email)
                    .enterPartnerName(partnerName)
                    .selectMasterCategory()
                    .selectPartnerType()
                    .selectWorkflow()
                    .clickOnSaveButton()
                    .verifyInputDataInLists("contain", partnerName, email)
                    .verifyWorkflow()
                    .verifyPartnerType();
            });

            it("Should delete partner and verify its inexistence in partner list", function () {
                partner_PO
                    .clickOnActivityButton()
                    .clickOnDeleteButton()
                    .verifyInputDataInLists(
                        "not.contain",
                        this.partnerName,
                        this.email
                    );
            });

            it("Should edit partner and verify partner name, email and workflow in partner list", () => {
                const updatedPartnerName = faker.random.words();
                const updatedEmail = faker.internet.email();

                partner_PO
                    .clickOnActivityButton()
                    .clickOnEditButton()
                    .enterEmail(updatedEmail)
                    .enterPartnerName(updatedPartnerName)
                    .removeWorkflow()
                    .selectWorkflow()
                    .clickOnUpdateButton()
                    .clickOnPartnerListButton();

                cy.wait(2000);

                partner_PO
                    .verifyInputDataInLists(
                        "contain",
                        updatedPartnerName,
                        updatedEmail
                    )
                    .verifyWorkflow();
            });
        });
    });
});
