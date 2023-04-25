/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Prospects_PO from "../../../support/pageObjects/clients_PO/Prospects_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Notes_PO from "../../../support/pageObjects/notes_PO/Notes_PO";

describe("Test in prospects submodule", () => {
    const homePage_PO = new HomePage_PO();
    const prospects_PO = new Prospects_PO();
    const notes_PO = new Notes_PO();

    before(() => {
        cy.login();

        cy.preserveAppCookie();

        homePage_PO.clickOnClients();

        cy.wait(3000);
    });

    context("Add prospects and notes dependent test", () => {
        before(() => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const title = faker.random.words();
            const description = faker.random.words();
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

            prospects_PO.clickOnFirstProspects();

            cy.wait(2000);

            prospects_PO.clickOnNotesTab();

            notes_PO
                .clickOnAddButton()
                .enterNoteTitle(title)
                .enterNoteDescription(description)
                .clickOnSubmitButton()
                .verifyTitleInCard("contain", title)
                .verifyDescriptionInCard("contain", description);
        });

        it("Should edit notes and verify it", () => {
            const editedTitle = faker.random.words();
            const editedDescription = faker.random.words();

            notes_PO
                .clickOnActionButtonOfNotes()
                .clickOnEditOption()
                .enterNoteTitle(editedTitle)
                .enterNoteDescription(editedDescription)
                .clickOnSubmitButton()
                .verifyTitleInCard("contain", editedTitle)
                .verifyDescriptionInCard("contain", editedDescription);
        });

        it("Should delete notes and verify its deletion", () => {
            cy.get(".stretched .column:nth-of-type(1) .truncate").then(
                (titleSelector) => {
                    const titleText = titleSelector.text();

                    notes_PO.clickOnActionButtonOfNotes().clickOnDeleteOption();

                    cy.contains(titleText).should("not.exist");
                }
            );
        });
    });
});
