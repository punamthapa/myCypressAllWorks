/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import { getRandomString } from "../../../../../utilities/helpers/general";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import CustomFields_PO from "../../../../support/pageObjects/settings_PO/customFields_PO/CustomFields_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import AgDrawer_PO from "../../../../support/pageObjects/utilities/AgDrawer_PO";
import FormFields_PO from "../../../../support/pageObjects/utilities/FormFields_PO";
import CustomFieldsTabs_PO from "../../../../support/settingsTabPO/CustomFieldsTabs_PO";

describe("Custom Fields setting client module", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const agDrawer_PO = new AgDrawer_PO();
    const customFields_PO = new CustomFields_PO();
    const formFields_PO = new FormFields_PO();
    const applicationTab_PO = new CustomFieldsTabs_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnCustomFields();
        applicationTab_PO.clickOnApplicationTab();

        cy.wait(2000);
    });

    //@todo section name verification need to be done
    context("Click on Add button dependent test", () => {
        beforeEach(() => {
            cy.clickOnAddButton();
        });

        it("Should verify the options of 'Select Workflow' dropdown in the drawer", () => {
            customFields_PO
                .getActiveWorkflowNamesFromApi()
                .clickOnSelectWorkflowDropdown()
                .verifyWorkflowNamesWithApiFetchedWorkflowNames();
        });

        it("Should verify if 'Select Module' has 'Application' module selected and dropdown has 'Client', 'Partner', 'Product' and 'Application' options", () => {
            customFields_PO
                .verifyApplicationAsSelectedInSelectModule()
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
            customFields_PO
                .clickOnSaveButton()
                .checkEmptyValidationErrorsInApplicationCustomField();
        });

        context("Generate custom field name dependent test", function () {
            const sectionNameIndexInTable = 5;

            beforeEach(function () {
                const customFieldName = getRandomString();

                cy.wrap(customFieldName).as("customFieldName");
            });

            it("Should add new custom field with 'Text' field type with mandatory and show in list properties , click on 'Save' button and verify if it is added.", function () {
                customFields_PO
                    .addApplicationCustomFieldWithTextFieldType(
                        this.customFieldName
                    )
                    .clickOnMakeFieldMandatoryCheckbox()
                    .clickShowFieldOnListViewCheckBox()
                    .clickOnSaveButton()
                    .verifyMandatoryFieldsExistenceInFirstEntryWithTextType(
                        this.customFieldName,
                        sectionNameIndexInTable
                    )
                    .verifyMandatoryPropertyInTable()
                    .verifyListViewPropertyInTable();
            });

            it("Should add new custom field with 'Number' field type, click on 'Save' button and verify it", function () {
                customFields_PO
                    .addApplicationCustomFieldWithNumberFieldType(
                        this.customFieldName
                    )
                    .clickOnSaveButton()
                    .verifyMandatoryFieldsExistenceInFirstEntryWithNumberType(
                        this.customFieldName,
                        sectionNameIndexInTable
                    );
            });

            context(
                "Add custom field with 'Dropdown' field type dependent test",
                function () {
                    beforeEach(function () {
                        customFields_PO.addApplicationCustomFieldWithDropdownFieldType(
                            this.customFieldName
                        );
                    });

                    it("Should add new custom field with 'Dropdown' field type, options and multiple selection property, click on 'Save' button and verify it", function () {
                        customFields_PO
                            .addDropdownOptions()
                            .clickOnMultipleDropdownSelectionCheckbox()
                            .clickOnSaveButton()
                            .verifyMandatoryFieldsExistenceInFirstEntryWithDropdownType(
                                this.customFieldName,
                                sectionNameIndexInTable
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
                        customFields_PO.addApplicationCustomFieldWithDateFieldType(
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
                                this.customFieldName,
                                sectionNameIndexInTable
                            );

                        agDrawer_PO.verifyExistenceOfAgDrawer();
                    });

                    context("Click on Save button dependent test", function () {
                        beforeEach(function () {
                            customFields_PO.clickOnSaveButton();

                            cy.wait(2000);
                        });

                        it("Should add new custom field with 'Date' field type, click on 'Save' button and verify if it is added", function () {
                            customFields_PO.verifyMandatoryFieldsExistenceInFirstEntryWithDateType(
                                this.customFieldName,
                                sectionNameIndexInTable
                            );
                        });

                        it("Should add custom field with custom field name that has already been added and verify unique validation error", function () {
                            customFields_PO.verifyMandatoryFieldsExistenceInFirstEntryWithDateType(
                                this.customFieldName,
                                sectionNameIndexInTable
                            );

                            cy.clickOnAddButton();

                            customFields_PO
                                .addApplicationCustomFieldWithDateFieldType(
                                    this.customFieldName
                                )
                                .clickOnSaveButton()
                                .verifyUniqueCustomNameValidationError();
                        });

                        it("Should edit section name from table and verify if it is edited", () => {
                            const newSectionName = faker.random.words();

                            customFields_PO
                                .clickOnFirstSectionNameInTable(
                                    sectionNameIndexInTable
                                )
                                .typeSectionNameInInputBox(newSectionName)
                                .clickOnTickButton()
                                .verifyUpdatedSectionNameInTable(
                                    newSectionName,
                                    sectionNameIndexInTable
                                );
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
                                const sectionColumnIndex = 4;

                                customFields_PO
                                    .clearNameTypeSection(sectionColumnIndex)
                                    .clickOnUpdateButton()
                                    .checkEmptyValidationErrorsInApplicationCustomField();
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
                                        newCustomFieldName,
                                        sectionNameIndexInTable
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
                                        newCustomFieldName,
                                        sectionNameIndexInTable
                                    );

                                agDrawer_PO.verifyExistenceOfAgDrawer();
                            });
                        });

                        it("Should pop the error if we try to edit the custom field name of same section that already exists", function () {
                            cy.clickOnAddButton();

                            customFields_PO
                                .addApplicationCustomFieldWithTextFieldType(
                                    this.customFieldName
                                )
                                .clickOnSaveButton();

                            cy.wait(2000);

                            customFields_PO.verifyUniqueCustomNameValidationError();
                        });

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

                        it("Should delete custom field and verify if it is deleted", function () {
                            customFields_PO
                                .clickOnDeleteButtonInsideActionButtonOfActiveTab()
                                .clickOnAcceptButton();

                            cy.waitingForComponentToMount();

                            customFields_PO.verifyCustomFieldNonExistenceInFirstEntry(
                                this.customFieldName
                            );
                        });

                        context(
                            "Deactivate custom field dependent test",
                            function () {
                                beforeEach(() => {
                                    customFields_PO
                                        .clickOnDeactivateButtonInsideActionButton()
                                        .clickOnAcceptButton();

                                    cy.wait(2000);
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
