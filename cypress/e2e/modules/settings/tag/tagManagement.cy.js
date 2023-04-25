/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import CustomTagManagement_PO from "../../../../support/pageObjects/settings_PO/customTag_PO/CustomTagManagement_PO";
import FormFields_PO from "../../../../support/pageObjects/utilities/FormFields_PO";

describe("Tag Management Module", function () {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const customTagManagement_PO = new CustomTagManagement_PO();
    const formFields_PO = new FormFields_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnTagmanagamentField();

        cy.wait(3000);
    });

    it("Should show validation error if  mandatory fields are not added in 'Add new custom tag' drawer after clicking on 'Save' button ", () => {
        cy.clickOnAddButton();
        customTagManagement_PO.clickOnSaveButton();
        cy.checkValidationErrors(["The name field is required."]);
    });

    context("Add custom tag dependent test", () => {
        beforeEach(() => {
            const customTagName = faker.random.words();
            cy.wrap(customTagName).as("customTag");

            cy.clickOnAddButton();
            customTagManagement_PO
                .typeTagNameInInputField(customTagName)
                .clickOnSaveButton();

            cy.waitingForComponentToMount();
            customTagManagement_PO.verifyExistenceOfCreatedTagName(
                customTagName
            );
        });

        it("Should check the unique validation if the added tag already exists in the system", function () {
            cy.clickOnAddButton();
            customTagManagement_PO
                .typeTagNameInInputField(this.customTag)
                .clickOnSaveButton();

            cy.checkValidationErrors([
                "Tags " + this.customTag + " already exists in the system.",
            ]);
        });

        it("Should delete custom tag and verify if it is deleted", function () {
            customTagManagement_PO
                .clickOnActivityButton()
                .clickOnRemoveOption();

            cy.waitingForComponentToMount();
            customTagManagement_PO.verifyDeletionOfCreatedTagName(
                this.customTag
            );
        });

        it("Should edit custom tag and verify if it is edited", function () {
            const newCustomTagName = faker.random.words();
            customTagManagement_PO
                .clickOnActivityButton()
                .clickOnEditOption()
                .clearEditInputField()
                .clickOnSaveButton();
            cy.checkValidationErrors("The name field is required.");

            customTagManagement_PO
                .typeTagNameInInputField(newCustomTagName)
                .clickOnSaveButton();

            cy.waitingForComponentToMount();
            customTagManagement_PO.verifyExistenceOfCreatedTagName(
                newCustomTagName
            );
        });

        it("Should check for the unique validation while editing the existing custom tag", function () {
            cy.get("tbody > :nth-child(2) > :nth-child(1)")
                .invoke("text")
                .then((existingTagName) => {
                    customTagManagement_PO
                        .clickOnActivityButton()
                        .clickOnEditOption()
                        .clearEditInputField();

                    cy.get("form > div > div > input").type(existingTagName);
                    customTagManagement_PO.clickOnSaveButton();
                    cy.checkValidationErrors(
                        "Tags already exists in the system."
                    );
                });
        });

        it("Should search the typed listed tag from the list", function () {
            formFields_PO.typeInSearchBox(this.customTag);

            cy.waitingForComponentToMount();

            formFields_PO.searchWithinTable(this.customTag);
        });
    });
});
