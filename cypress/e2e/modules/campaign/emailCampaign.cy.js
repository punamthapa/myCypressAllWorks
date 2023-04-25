/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import EmailCampaign_PO from "../../../support/pageObjects/campaign_PO/EmailCampaign_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";

describe("Test in Email Campaign Module", function () {
    const homePage_PO = new HomePage_PO();
    const emailCampaign_PO = new EmailCampaign_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnCampaignModule();
    });

    context("Click on create new campaign button  dependent test", () => {
        beforeEach(() => {
            emailCampaign_PO
                .clickOnEmailCampaign()
                .clickOnCreateNewCampaignButton();
        });

        //@bug
        // it.skip("Should show validation message error while submitting without filling mandatory field", function () {
        //     emailCampaign_PO.clickOnNextButton().verifyEmptyValidationError();
        // });

        context("Fill form dependent test", () => {
            beforeEach(() => {
                const campaignName = faker.random.words();
                const name = faker.random.words();
                const subject = faker.random.words();

                cy.wrap(campaignName).as("campaignName");

                emailCampaign_PO.fillForm(campaignName, name, subject);
            });

            it("Should verify the functionality of cancel button", function () {
                emailCampaign_PO
                    .clickOnAcceptButton()
                    .verifyInputDataInLists("not.contain", this.campaignName)
                    .verifyUrlOfEmailCampaign();
            });

            it("Should move campaign detail stage to design templates stage", function () {
                emailCampaign_PO.clickOnNextButton().verifyNextStepClass();
            });

            it("Should save campaign information as draft", function () {
                emailCampaign_PO.clickOnSaveDraftButton();

                cy.wait(5000);

                emailCampaign_PO
                    .verifyCampaignName("contain", this.campaignName)
                    .verifyStatusOfRecentlyCreatedCampaign("contain", "Draft");
            });
        });
    });
});
