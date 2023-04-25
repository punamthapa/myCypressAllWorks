/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import { getRandomString } from "../../../../../utilities/helpers/general";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import CustomFields_PO from "../../../../support/pageObjects/settings_PO/customFields_PO/CustomFields_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import AgDrawer_PO from "../../../../support/pageObjects/utilities/AgDrawer_PO";
import FormFields_PO from "../../../../support/pageObjects/utilities/FormFields_PO";
import CustomFieldsTabs_PO from "../../../../support/settingsTabPO/CustomFieldsTabs_PO";

describe("Custom Fields setting partner module", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const agDrawer_PO = new AgDrawer_PO();
    const customFields_PO = new CustomFields_PO();
    const formFields_PO = new FormFields_PO();
    const partnerTab_PO = new CustomFieldsTabs_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnCustomFields();

        partnerTab_PO.clickOnPartnerTab();

        cy.wait(2000);
    });

    context("Click on Add button dependent test", () => {
        beforeEach(() => {
            cy.clickOnAddButton();
        });

        it("Should verify existence of 'Select Module', 'Section Name', 'Custom Field Name' and 'Select Field Type' sections,and  'Cancel', 'Save' and 'Save and New' buttons in 'Add new Custom Field'  drawer ", () => {
            agDrawer_PO
                .verifyExistenceOfAgDrawer()
                .verifyExistenceOfAgDrawerTitle("Add new Custom Field");

            customFields_PO.verifyExistenceOfSectionsInCustomFieldDrawer();
        });

        it("Should verify if 'Select Module' has 'Partner' module selected and dropdown has 'Client', 'Partner', 'Product' and 'Application' options", () => {
            customFields_PO
                .verifyPartnerAsSelectedInSelectModule()
                .clickOnSelectModuleDropdown()
                .verifySelectModuleDropdownOptions();
        });

        it("Should verify if 'Select Field Type' dropdown has 'Text', 'Number', 'Date' and 'Dropdown' options in the drawer. Type in search bar to see whether it's functional, then select the searched field and verify if it is selected", () => {
            customFields_PO
                .clickOnFieldTypeDropdown()
                .verifyFieldTypeDropdownOptions()
                .typeDateInFieldType()
                .verifyDateAsSelectedInFieldType();
        });

        it("Should select 'Dropdown' in 'Select Field Type' and 'Add Dropdown Option below' label, 'Add Options' button, 'Add new option' input box, 'Allow Multiple Dropdown Selections' checkbox should be visible. Click on '+Add Options', validation error should be displayed in input box", () => {
            customFields_PO
                .typeDropdownInFieldType()
                .verifyDropdownAsSelectedInFieldType()
                .verifyDropdownFields()
                .clickOnAddOptionButton()
                .verifyEmptyOptionNameValidationError();
        });

        it("Should show validation error if  mandatory fields are not added in 'Add new custom field' drawer after clicking on 'Save' button.", function () {
            customFields_PO.clickOnSaveButton().checkEmptyValidationErrors();
        });

        context("Generate custom field name dependent test", function () {
            beforeEach(function () {
                const customFieldName = getRandomString();

                cy.wrap(customFieldName).as("customFieldName");
            });

            it("Should add new custom field with 'Text' field type with mandatory and show in list properties , click on 'Save' button and verify if it is added.", function () {
                customFields_PO
                    .addCustomFieldWithTextFieldType(this.customFieldName)
                    .clickOnMakeFieldMandatoryCheckbox()
                    .clickShowFieldOnListViewCheckBox()
                    .clickOnSaveButton()
                    .verifyMandatoryFieldsExistenceInFirstEntryWithTextType(
                        this.customFieldName
                    )
                    .verifyMandatoryPropertyInTable()
                    .verifyListViewPropertyInTable();
            });

            it("Should add new custom field with 'Number' field type, click on 'Save' button and verify it", function () {
                customFields_PO
                    .addCustomFieldWithNumberFieldType(this.customFieldName)
                    .clickOnSaveButton()
                    .verifyMandatoryFieldsExistenceInFirstEntryWithNumberType(
                        this.customFieldName
                    );
            });

            context(
                "Add custom field with 'Dropdown' field type dependent test",
                function () {
                    beforeEach(function () {
                        customFields_PO.addCustomFieldWithDropdownFieldType(
                            this.customFieldName
                        );
                    });

                    it("Should add new custom field with 'Dropdown' field type, options and multiple selection property, click on 'Save' button and verify it", function () {
                        customFields_PO
                            .addDropdownOptions()
                            .clickOnMultipleDropdownSelectionCheckbox()
                            .clickOnSaveButton()
                            .verifyMandatoryFieldsExistenceInFirstEntryWithDropdownType(
                                this.customFieldName
                            )
                            .verifyMultipleSelectionPropertyInTable();
                    });

                    it("Should add custom field with 'Dropdown' field type, add options that has already been added and verify unique validation error", function () {
                        const dropdownOption = getRandomString();

                        customFields_PO
                            .typeOptionsName(dropdownOption)
                            .clickOnAddOptionButton()
                            .typeOptionsName(dropdownOption)
                            .clickOnAddOptionButton()
                            .verifyOptionUniqueValidationError();
                    });

                    it("Should add custom field with 'Dropdown' field type, no options and verify validation error", function () {
                        customFields_PO
                            .clickOnSaveButton()
                            .verifyEmptyOptionValidationError();
                    });
                }
            );

            context(
                "Add custom field with date field type dependent test",
                function () {
                    beforeEach(function () {
                        customFields_PO.addCustomFieldWithDateFieldType(
                            this.customFieldName
                        );
                    });

                    it("Should show validation error if we add custom field name greater than 30 characters", () => {
                        customFields_PO
                            .typeCustomNameGreaterThan30Characters()
                            .clickOnSaveButton()
                            .verifyCustomNameTextLimitationError();
                    });

                    it("Should add all the mandatory fields in custom field drawer, click on 'Cancel' button and verify custom field is not added", function () {
                        customFields_PO
                            .clickOnCancelButton()
                            .verifyCustomFieldNonExistenceInFirstEntry(
                                this.customFieldName
                            );
                    });

                    it("Should add new custom field with mandatory fields, click the 'Save and New' button, and verify that it has been added and 'Add new Custom Field' drawer has been opened.", function () {
                        customFields_PO
                            .clickOnSaveAndNewButton()
                            .verifyMandatoryFieldsExistenceInFirstEntryWithDateType(
                                this.customFieldName
                            );

                        agDrawer_PO.verifyExistenceOfAgDrawer();
                    });

                    context("Click on Save button dependent test", function () {
                        beforeEach(function () {
                            customFields_PO.clickOnSaveButton();

                            cy.waitingForComponentToMount();
                        });

                        it("Should add new custom field with 'Date' field type, click on 'Save' button and verify if it is added", function () {
                            customFields_PO.verifyMandatoryFieldsExistenceInFirstEntryWithDateType(
                                this.customFieldName
                            );
                        });

                        it("Should add custom field with custom field name that has already been added and verify unique validation error", function () {
                            customFields_PO.verifyMandatoryFieldsExistenceInFirstEntryWithDateType(
                                this.customFieldName
                            );

                            cy.clickOnAddButton();

                            customFields_PO
                                .addCustomFieldWithDateFieldType(
                                    this.customFieldName
                                )
                                .clickOnSaveButton()
                                .verifyUniqueCustomNameValidationError();
                        });

                        it("Should edit section name from table and verify if it is edited", () => {
                            const newSectionName = faker.random.words();

                            customFields_PO
                                .clickOnFirstSectionNameInTable()
                                .typeSectionNameInInputBox(newSectionName)
                                .clickOnTickButton()
                                .verifyUpdatedSectionNameInTable(
                                    newSectionName
                                );
                        });

                        it("Should pop the error if we try to edit the custom field name of same section that already exists", function () {
                            cy.clickOnAddButton();

                            customFields_PO
                                .addCustomFieldWithTextFieldType(
                                    this.customFieldName
                                )
                                .clickOnSaveButton();

                            cy.waitingForComponentToMount();

                            customFields_PO.verifyUniqueCustomNameValidationError();
                        });

                        it("Should delete custom field and verify if it is deleted", function () {
                            customFields_PO
                                .clickOnDeleteButtonInsideActionButtonOfActiveTab()
                                .clickOnAcceptButton();

                            cy.waitingForComponentToMount();

                            customFields_PO.verifyCustomFieldNonExistenceInFirstEntry(
                                this.customFieldName
                            );
                        });

                        // Because just one data is displayed in the table, other tests will fail if we use cy.waitingForComponentToMount().As alternative, cy.wait() is used
                        it("Should search by typed custom name", function () {
                            formFields_PO
                                .typeInSearchBox(this.customFieldName)
                                .clickOnSearchButton();

                            cy.waitingForComponentToMount();

                            formFields_PO
                                .searchWithinTable(this.customFieldName)
                                .clearTextInSearchBar()
                                .clickOnSearchButton();

                            cy.wait(3000);
                        });

                        context("Click on Edit button dependent test", () => {
                            beforeEach(() => {
                                customFields_PO.clickOnEditButtonInsideActionButton();
                            });

                            it("Should edit custom field , click on 'Cancel' button, verify that custom field is not edited", () => {
                                const newCustomFieldName = getRandomString();

                                customFields_PO
                                    .typeInCustomFieldNameInputBox(
                                        newCustomFieldName
                                    )
                                    .clickOnCancelButton()
                                    .verifyCustomFieldNonExistenceInFirstEntry(
                                        newCustomFieldName
                                    );
                            });

                            it("Should verify existence of 'Edit Custom Field' drawer, its title and 'Select module' disability after clicking on 'Edit' button from action button ", () => {
                                agDrawer_PO
                                    .verifyExistenceOfAgDrawer()
                                    .verifyExistenceOfAgDrawerTitle(
                                        "Edit Custom Field"
                                    );

                                customFields_PO.checkSelectModuleDisableProperty();
                            });

                            it("Should pop the error if we save the blank mandatory fields while editing", () => {
                                customFields_PO
                                    .clearNameTypeSection()
                                    .clickOnUpdateButton()
                                    .checkEmptyValidationErrors();
                            });

                            it("Should verify visibility of section name, custom field name and field type when clicking on edit", () => {
                                customFields_PO.verifyMandatoryFieldVisibility();
                            });

                            it("Should pop the error if edited custom field name is greater than 30 character", () => {
                                customFields_PO
                                    .typeCustomNameGreaterThan30Characters()
                                    .clickOnUpdateButton()
                                    .verifyCustomNameTextLimitationError();
                            });

                            it("Should edit custom field, click on 'Update' button and verify edited fields", function () {
                                const newCustomFieldName = getRandomString();

                                customFields_PO
                                    .typeInCustomFieldNameInputBox(
                                        newCustomFieldName
                                    )
                                    .typeNumberInFieldType()
                                    .clickOnUpdateButton()
                                    .verifyMandatoryFieldsExistenceInFirstEntryWithNumberType(
                                        newCustomFieldName
                                    );
                            });

                            it("Should edit custom field, click on 'Update and New' button, verify edited fields and drawer is opened", function () {
                                const newCustomFieldName = getRandomString();

                                customFields_PO
                                    .typeInCustomFieldNameInputBox(
                                        newCustomFieldName
                                    )
                                    .typeNumberInFieldType()
                                    .clickOnUpdateAndNewButton()
                                    .verifyMandatoryFieldsExistenceInFirstEntryWithNumberType(
                                        newCustomFieldName
                                    );

                                agDrawer_PO.verifyExistenceOfAgDrawer();
                            });
                        });

                        context(
                            "Deactivate custom field dependent test",
                            function () {
                                beforeEach(() => {
                                    customFields_PO
                                        .clickOnDeactivateButtonInsideActionButton()
                                        .clickOnAcceptButton();

                                    cy.waitingForComponentToMount();
                                });

                                it("Should activate custom field, verify its absence in Inactive tab and presence in active tab", function () {
                                    customFields_PO
                                        .clickOnInactiveButton()
                                        .verifyCustomFieldExistenceInFirstEntry(
                                            this.customFieldName
                                        )
                                        .clickOnActivateButtonInsideActionButton()
                                        .clickOnAcceptButton()
                                        .verifyCustomFieldNonExistenceInFirstEntry(
                                            this.customFieldName
                                        )
                                        .clickOnActiveButton()
                                        .verifyCustomFieldExistenceInFirstEntry(
                                            this.customFieldName
                                        );
                                });

                                it("Should delete inactive custom field and verify if it is deleted", function () {
                                    customFields_PO
                                        .clickOnInactiveButton()
                                        .verifyCustomFieldExistenceInFirstEntry(
                                            this.customFieldName
                                        )
                                        .clickOnDeleteButtonInsideActionButtonOfInactiveTab()
                                        .clickOnAcceptButton()
                                        .verifyCustomFieldNonExistenceInFirstEntry(
                                            this.customFieldName
                                        );
                                });
                            }
                        );
                    });
                }
            );
        });
    });
});
