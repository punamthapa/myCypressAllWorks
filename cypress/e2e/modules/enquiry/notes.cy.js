/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Enquiries_PO from "../../../support/pageObjects/enquiries_PO/Enquiries_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Notes_PO from "../../../support/pageObjects/Notes_PO";
import LeadForms_PO from "../../../support/pageObjects/settings_PO/leadForms_PO/LeadForms_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";

describe("Test for notes tab in enquiry module", () => {
    const homePage_PO = new HomePage_PO();
    const enquiries_PO = new Enquiries_PO();
    const settings_PO = new Setting_PO();
    const leadForms_PO = new LeadForms_PO();
    const notes_PO = new Notes_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        cy.wait(5000);
    });

    context("Create lead form and notes dependent test", () => {
        beforeEach(() => {
            const leadFormName = faker.random.words();
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const title = faker.random.words();
            const description = faker.random.words();

            homePage_PO.clickOnSettingMenu();

            settings_PO.clickOnLeadForm();

            leadForms_PO
                .clickOnAddLeadFormButton()
                .fillLeadFormName(leadFormName)
                .selectRelatedOfficeName()
                .clickOnLeadFormSaveButton()
                .clickOnLeadFormUrl()
                .fillLeadFormElements(firstName, lastName);

            leadForms_PO.clickOnSubmitFormButton();

            cy.wait(2000);

            cy.go("back");

            cy.waitingForComponentToMount();

            homePage_PO.clickOnEnquiries();

            cy.wait(2000);

            enquiries_PO.clickOnFirstEnquiry();

            cy.clickOnAddButton();

            enquiries_PO.clickOnAddNotesAndTermsTab();

            notes_PO
                .clickOnAddButton()
                .enterNoteTitle(title)
                .enterNoteDescription(description)
                .clickOnSubmitButton()
                .verifyTitleInCard("contain", title)
                .verifyDescriptionInCard("contain", description);
        });

        it("Should edit notes and verify it", () => {
            const updatedTitle = faker.random.words();
            const updatedDescription = faker.random.words();

            notes_PO
                .clickOnActionButtonOfNotes()
                .clickOnEditOption()
                .enterNoteTitle(updatedTitle)
                .enterNoteDescription(updatedDescription)
                .clickOnSubmitButton()
                .verifyTitleInCard("contain", updatedTitle)
                .verifyDescriptionInCard("contain", updatedDescription);
        });

        it("Should delete notes and verify its deletion", () => {
            cy.get(".stretched .column:nth-of-type(1) .truncate").then(
                (titleSelector) => {
                    const titleText = titleSelector.text();

                    notes_PO.clickOnActionButtonOfNotes().clickOnDeleteOption();

                    cy.get(".ag-card-header")
                        .first()
                        .should("not.exist", titleText);
                }
            );
        });
    });
});
