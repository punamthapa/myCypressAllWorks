/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Enquiries_PO from "../../../support/pageObjects/enquiries_PO/Enquiries_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import LeadForms_PO from "../../../support/pageObjects/settings_PO/leadForms_PO/LeadForms_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";

describe("Test for document tab in enquiry module", () => {
    const homePage_PO = new HomePage_PO();
    const enquiries_PO = new Enquiries_PO();
    const settings_PO = new Setting_PO();
    const leadForms_PO = new LeadForms_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        cy.wait(5000);
    });

    context("Create lead form dependent test", () => {
        before(() => {
            const leadFormName = faker.random.words();
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            homePage_PO.clickOnSettingMenu();

            settings_PO.clickOnLeadForm();

            leadForms_PO
                .clickOnAddLeadFormButton()
                .fillLeadFormName(leadFormName)
                .selectRelatedOfficeName()
                .clickOnLeadFormSaveButton()
                .clickOnLeadFormUrl()
                .fillLeadFormElements(firstName, lastName);

            cy.wait(2000);

            leadForms_PO.clickOnSubmitFormButton();

            cy.wait(2000);

            cy.go("back");

            cy.waitingForComponentToMount();

            homePage_PO.clickOnEnquiries();

            cy.wait(2000);

            enquiries_PO.clickOnFirstEnquiry();
        });

        it("Should verify the added attachments count", () => {
            const numberOfAttachments = 3;

            enquiries_PO.clickOnDocumentTab();

            cy.waitingForComponentToMount();

            enquiries_PO
                .attachDeviceAttachment(numberOfAttachments)
                .verifyAddedAttachments(numberOfAttachments);
        });
    });
});
