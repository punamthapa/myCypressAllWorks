/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import GeneralPartnerProductType_PO from "../../../../support/pageObjects/settings_PO/general_PO/GeneralPartnerProductType_PO";
import { MASTER_CATEGORIES } from "../../../../../constants/masterCategories";

describe("General setting product type submodule", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const generalProductType_PO = new GeneralPartnerProductType_PO();

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
        generalProductType_PO.verifyPageTitle().verifyTabTitles();
    });

    context("Click on 'Add Type' dependent test", () => {
        beforeEach(function () {
            const productTypeName = faker.random.words();
            const keys = Object.keys(MASTER_CATEGORIES);
            const randomIndex = keys[Math.floor(Math.random() * keys.length)];
            const randomCategory = MASTER_CATEGORIES[randomIndex];

            cy.wrap(productTypeName).as("productTypeName");
            cy.wrap(randomCategory).as("randomCategory");

            generalProductType_PO.clickOnProductType();

            cy.clickOnAddButton();

            generalProductType_PO.clickOnProductTypeRadioButton();

            cy.wait(2000);
        });

        it("Should show validation error message while submitting without mandatory fields", () => {
            generalProductType_PO
                .clickSaveButton()
                .checkProductEmptyValidationError();
        });

        context(
            "Add product type and select master category dependent test",
            function () {
                beforeEach(function () {
                    generalProductType_PO
                        .selectMasterCategory(this.randomCategory)
                        .enterTypeName(this.productTypeName);
                });

                it("Should verify the functionality of Cancel button", function () {
                    generalProductType_PO
                        .clickCancelButton()
                        .verifyAddedTypeInList(
                            this.productTypeName,
                            "not.contain"
                        )
                        .verifyMasterCategoryOfType(
                            this.randomCategory,
                            "not.contain"
                        );
                });

                context("Click on 'Save' button dependent test", function () {
                    beforeEach(function () {
                        generalProductType_PO.clickSaveButton();

                        cy.wait(2000);
                    });

                    it("Should verify the added product type is in the list", function () {
                        generalProductType_PO
                            .verifyAddedTypeInList(this.productTypeName)
                            .verifyMasterCategoryOfType(this.randomCategory)
                            .verifyTypeStatus("Active");
                    });

                    it("Should deactivate last product type, activate it and verify status in the table", () => {
                        generalProductType_PO
                            .clickOnDeactivateButton()
                            .verifyTypeStatus("Inactive")
                            .clickOnActivateButton()
                            .verifyTypeStatus("Active");
                    });

                    it("Should delete the last product type in the list of product types and verify its existence in the table", function () {
                        generalProductType_PO
                            .clickDeleteButton()
                            .verifyAddedTypeInList(
                                this.productTypeName,
                                "not.contain"
                            );
                    });

                    context("Edit product type dependent test", () => {
                        beforeEach(function () {
                            const editedProductTypeName = faker.random.words();

                            cy.wrap(editedProductTypeName).as(
                                "editedProductTypeName"
                            );

                            generalProductType_PO
                                .clickEditButton()
                                .enterTypeName(editedProductTypeName)
                                .clickSaveButton();

                            cy.wait(2000);

                            generalProductType_PO.clickEditButton();
                        });

                        it("Should verify edited product type exists in the list", function () {
                            generalProductType_PO
                                .verifyAddedTypeInList(
                                    this.editedProductTypeName
                                )
                                .verifyMasterCategoryOfType(
                                    this.randomCategory
                                );
                        });

                        it("Should check empty validation error message while editing product type", function () {
                            generalProductType_PO
                                .selectMasterCategory(this.randomCategory)
                                .enterTypeName(" ")
                                .clickSaveButton()
                                .checkProductEmptyValidationError();
                        });
                    });

                    context(
                        "Check uniqueness of product type name dependent test",
                        () => {
                            beforeEach(() => {
                                cy.clickOnAddButton();

                                generalProductType_PO.clickOnProductTypeRadioButton();
                            });

                            it("Should verify the uniqueness of product name", function () {
                                generalProductType_PO
                                    .selectMasterCategory(this.randomCategory)
                                    .enterTypeName(this.productTypeName)
                                    .clickSaveButton()
                                    .checkNameUniqueness();
                            });

                            it("Should verify the uniqueness of product name after editing product name", function () {
                                const newProductTypeName = faker.random.words();

                                generalProductType_PO
                                    .selectMasterCategory(this.randomCategory)
                                    .enterTypeName(newProductTypeName)
                                    .clickSaveButton();

                                cy.wait(2000);

                                generalProductType_PO
                                    .clickEditButton()
                                    .enterTypeName(this.productTypeName)
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
