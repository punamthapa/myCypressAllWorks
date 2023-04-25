/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import GeneralPartnerProductType_PO from "../../../../support/pageObjects/settings_PO/general_PO/GeneralPartnerProductType_PO";
import { MASTER_CATEGORIES } from "../../../../../constants/masterCategories";

describe("General setting partner type submodule", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const generalPartnerType_PO = new GeneralPartnerProductType_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnGeneralMenu();

        cy.wait(3000);
    });

    it("Should verify appropriate tab titles and page's title is 'General'", () => {
        generalPartnerType_PO.verifyPageTitle().verifyTabTitles();
    });

    context("Click on 'Add Type' dependent test", () => {
        beforeEach(function () {
            const partnerTypeName = faker.random.words();
            const keys = Object.keys(MASTER_CATEGORIES);
            const randomIndex = keys[Math.floor(Math.random() * keys.length)];
            const randomCategory = MASTER_CATEGORIES[randomIndex];

            cy.wrap(partnerTypeName).as("partnerTypeName");
            cy.wrap(randomCategory).as("randomCategory");

            cy.clickOnAddButton();

            cy.wait(2000);
        });

        it("Should show validation error message while submitting without mandatory fields", () => {
            generalPartnerType_PO.clickSaveButton().checkEmptyValidationError();
        });

        context(
            "Add partner type and select master category dependent test",
            function () {
                beforeEach(function () {
                    generalPartnerType_PO
                        .selectMasterCategory(this.randomCategory)
                        .enterTypeName(this.partnerTypeName);
                });

                it("Should verify the functionality of Cancel button", function () {
                    generalPartnerType_PO
                        .clickCancelButton()
                        .verifyAddedTypeInList(
                            this.partnerTypeName,
                            "not.contain"
                        )
                        .verifyMasterCategoryOfType(
                            this.randomCategory,
                            "not.contain"
                        );
                });

                context("Click on 'Save' button dependent test", function () {
                    beforeEach(function () {
                        generalPartnerType_PO.clickSaveButton();

                        cy.wait(2000);
                    });

                    it("Should verify the added partner type is in the list", function () {
                        generalPartnerType_PO
                            .verifyAddedTypeInList(this.partnerTypeName)
                            .verifyMasterCategoryOfType(this.randomCategory)
                            .verifyTypeStatus("Active");
                    });

                    it("Should deactivate last partner type, activate it and verify status in the table", () => {
                        generalPartnerType_PO
                            .clickOnDeactivateButton()
                            .verifyTypeStatus("Inactive")
                            .clickOnActivateButton()
                            .verifyTypeStatus("Active");
                    });

                    it("Should delete the last partner type in the list of partner types and verify its existence in the table", function () {
                        generalPartnerType_PO
                            .clickDeleteButton()
                            .verifyAddedTypeInList(
                                this.partnerTypeName,
                                "not.contain"
                            );
                    });

                    context("Edit partner type dependent test", () => {
                        beforeEach(function () {
                            const editedPartnerTypeName = faker.random.words();

                            cy.wrap(editedPartnerTypeName).as(
                                "editedPartnerTypeName"
                            );

                            generalPartnerType_PO
                                .clickEditButton()
                                .enterTypeName(editedPartnerTypeName)
                                .clickSaveButton();

                            cy.wait(2000);

                            generalPartnerType_PO.clickEditButton();
                        });

                        it("Should verify edited partner type exists in the list", function () {
                            generalPartnerType_PO
                                .verifyAddedTypeInList(
                                    this.editedPartnerTypeName
                                )
                                .verifyMasterCategoryOfType(
                                    this.randomCategory
                                );
                        });

                        it("Should check empty validation error message while editing partner type", function () {
                            generalPartnerType_PO
                                .selectMasterCategory(this.randomCategory)
                                .enterTypeName(" ")
                                .clickSaveButton()
                                .checkEmptyValidationError();
                        });
                    });

                    context(
                        "Check uniqueness of partner type name dependent test",
                        () => {
                            beforeEach(() => {
                                cy.clickOnAddButton();
                            });

                            it("Should verify the uniqueness of partner name", function () {
                                generalPartnerType_PO
                                    .selectMasterCategory(this.randomCategory)
                                    .enterTypeName(this.partnerTypeName)
                                    .clickSaveButton()
                                    .checkNameUniqueness();
                            });

                            it("Should verify the uniqueness of partner name after editing partner name", function () {
                                const newPartnerTypeName = faker.random.words();

                                generalPartnerType_PO
                                    .selectMasterCategory(this.randomCategory)
                                    .enterTypeName(newPartnerTypeName)
                                    .clickSaveButton();

                                cy.wait(2000);

                                generalPartnerType_PO
                                    .clickEditButton()
                                    .enterTypeName(this.partnerTypeName)
                                    .clickSaveButton()
                                    .checkNameUniqueness();
                            });
                        }
                    );
                });
            }
        );
    });
});
