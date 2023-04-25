import { getRandomString } from "../../../../../utilities/helpers/general";
import faker from "@faker-js/faker";
import FormFields_PO from "../../utilities/FormFields_PO";

const fieldTypeOption = {
    text: {
        value: "text",
        label: "Text",
    },
    number: {
        value: "number",
        label: "Number",
    },
    date: {
        value: "date",
        label: "Date",
    },
    dropdown: {
        value: "dropdown",
        label: "Dropdown",
    },
};
const buttonIndexes = {
    cancel: 0,
    save: 1,
    update: 1,
    saveAndNew: 2,
    updateAndNew: 2,
};
const sectionName = faker.random.words();
const tableFirstRowIndex = 1;
const firstCustomFieldNameIndexInTable = 1;
const formFields_PO = new FormFields_PO();

class CustomFields_PO {
    verifyExistenceOfSectionsInCustomFieldDrawer() {
        cy.get(".ag-drawer")
            .find("form>div>div")
            .first()
            .should("contain.text", "Select Module")
            .next()
            .should("contain.text", "Section Name")
            .next()
            .should("contain.text", "Custom Field Name")
            .next()
            .should("contain.text", "Select Field Type")
            .next()
            .first()
            .should("contain.text", "Make this field mandatory")
            .last()
            .should("contain.text", "Show this field on List View")
            .parent(".ag-flex.ag-flex-column.col-v-5")
            .last()
            .find("button")
            .first()
            .should("contain.text", "Cancel")
            .next()
            .should("contain.text", "Save")
            .next()
            .then((buttonSelector) => {
                const saveAndNewButtonText = buttonSelector
                    .text()
                    .trim()
                    .replace(/\n \s+/g, " ");

                expect(saveAndNewButtonText).to.contain("Save and New");
            });
    }

    typeInInputBox(selector, word) {
        cy.get(selector).click().type("{selectall}{backspace}").type(word);

        return this;
    }

    typeSectionNameInInputBox(newSectionName) {
        this.typeInInputBox("input[name='name']", newSectionName);

        return this;
    }

    typeInCustomFieldNameInputBox(customFieldName) {
        this.typeInInputBox(
            "div[name='name'] > input[name='name']",
            customFieldName
        );

        return this;
    }

    typeCustomNameGreaterThan30Characters() {
        const customFieldNameGreaterThan30Characters = getRandomString(31);

        this.typeInInputBox(
            "div[name='name'] > input[name='name']",
            customFieldNameGreaterThan30Characters
        );

        return this;
    }

    clickElement(elementSelector) {
        cy.get(elementSelector).click({
            force: true,
        });
    }

    getActiveWorkflowNamesFromApi() {
        cy.intercept("GET", "api/v2/workflows?only_active=true").as(
            "activeWorkflowList"
        );

        return this;
    }

    clickOnSelectModuleDropdown() {
        formFields_PO.clickOnDropdownFormField("module");

        return this;
    }

    clickOnFieldTypeDropdown() {
        formFields_PO.clickOnDropdownFormField("type");

        return this;
    }

    clickOnAddOptionButton() {
        this.clickElement("div[name='options'] > button");

        return this;
    }

    clickOnMakeFieldMandatoryCheckbox() {
        this.clickElement("input[value='is_required']");

        return this;
    }

    clickShowFieldOnListViewCheckBox() {
        this.clickElement("input[value='show_in_list']");

        return this;
    }

    clickOnMultipleDropdownSelectionCheckbox() {
        const multipleSelectionCheckboxIndex = 1;

        this.clickElement(
            `div:nth-of-type(${multipleSelectionCheckboxIndex}) > label > input[name='options']`
        );

        return this;
    }

    clickOnFirstSectionNameInTable(sectionColumnIndex = 4) {
        this.clickElement(
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${sectionColumnIndex}) > span > button`
        );

        return this;
    }

    clickOnTickButton() {
        const checkIconIndex = 1;

        this.clickElement(
            `div[name='section'] > div > button:nth-of-type(${checkIconIndex})`
        );

        return this;
    }

    clickOnAcceptButton() {
        this.clickElement("button[type='submit'].accept");

        return this;
    }

    clickOnInactiveButton() {
        this.clickElement("input[value='inactive']");

        return this;
    }

    clickOnActiveButton() {
        this.clickElement("input[value='active']");

        return this;
    }

    clickOnSelectSectionDropdown() {
        this.clickElement("div[name='section'] > div[role='combobox']");

        return this;
    }

    typeInSearchBarAndSelectFirstSearchedElement(
        elementSelector,
        searchedWord
    ) {
        this.clickElement(elementSelector);

        this.typeInInputBox(
            ".ag-select-search > .ag-select-search-input",
            searchedWord
        );

        cy.get("ul[role='listbox']>li").first().click();

        return this;
    }

    clickOnFormButton(buttonIndex) {
        cy.get(".ag-flex.ag-justify-end.col-v-5>button")
            .eq(buttonIndex)
            .click();
    }

    clickOnSaveButton() {
        this.clickOnFormButton(buttonIndexes.save);

        return this;
    }

    clickOnCancelButton() {
        this.clickOnFormButton(buttonIndexes.cancel);

        return this;
    }

    clickOnSaveAndNewButton() {
        this.clickOnFormButton(buttonIndexes.saveAndNew);

        return this;
    }

    clickOnUpdateButton() {
        this.clickOnFormButton(buttonIndexes.update);

        return this;
    }

    clickOnUpdateAndNewButton() {
        this.clickOnFormButton(buttonIndexes.updateAndNew);

        return this;
    }

    checkExistence(selector, existenceAsseration) {
        cy.get(selector).should(existenceAsseration);
    }

    shouldAsseration(selector, method, value) {
        cy.get(selector).should(method, value);

        return this;
    }

    verifyPropertyInTable(property) {
        const propertiesIndexInTable = 3;

        this.shouldAsseration(
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${propertiesIndexInTable})`,
            "contain.text",
            property
        );
    }

    verifyUpdatedSectionNameInTable(newSectionName, sectionColumnIndex = 4) {
        this.shouldAsseration(
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${sectionColumnIndex}) > span > button`,
            "contain.text",
            newSectionName
        );
    }

    verifyMandatoryPropertyInTable() {
        this.verifyPropertyInTable("Mandatory");

        return this;
    }

    verifyListViewPropertyInTable() {
        this.verifyPropertyInTable("List View");

        return this;
    }

    verifyMultipleSelectionPropertyInTable() {
        this.verifyPropertyInTable("Multiple Selection");

        return this;
    }

    verifySelectedText(selector, text) {
        cy.get(selector)
            .invoke("text")
            .wait(3000)
            .then((sectionNameSelector) => {
                expect(sectionNameSelector.trim()).to.contain(text);
            });

        return this;
    }

    verifySelectedFieldType(fieldTypeOption) {
        this.shouldAsseration(
            "div[role='combobox'] > input[name='type']",
            "have.value",
            fieldTypeOption
        );
    }

    verifyDateAsSelectedInFieldType() {
        this.verifySelectedFieldType(fieldTypeOption.date.value);
    }

    verifyDropdownAsSelectedInFieldType() {
        this.verifySelectedFieldType(fieldTypeOption.dropdown.value);

        return this;
    }

    verifyDropdownOptions(dropdownOptions) {
        cy.get("ul[role='listbox']>li").each((options, index) => {
            expect(options).to.contain.text(dropdownOptions[index]);
        });

        return this;
    }

    verifyDropdownFields() {
        const dropdownCheckboxLabelIndex = 1;
        const selectors = [
            "div[name='dropdown_option'] > label",
            "div[name='options'] > button",
            `.col-v-2 > div:nth-of-type(${dropdownCheckboxLabelIndex}) > label`,
        ];
        const labels = [
            "Add Dropdown Option below",
            "Add Options",
            "Allow Multiple Dropdown Selections",
        ];

        selectors.forEach((selectors, index) => {
            this.shouldAsseration(selectors, "contain.text", labels[index]);
        });

        this.checkExistence("input[placeholder='Add new option']", "exist");

        return this;
    }

    verifySelectModuleDropdownOptions() {
        const selectModuleOptions = [
            "Client",
            "Partner",
            "Product",
            "Application",
        ];

        this.verifyDropdownOptions(selectModuleOptions);

        return this;
    }

    verifyFieldTypeDropdownOptions() {
        const fieldType = ["Text", "Number", "Date", "Dropdown"];

        this.verifyDropdownOptions(fieldType);

        return this;
    }

    verifyMandatoryFieldsExistenceInFirstEntry(
        customFieldName,
        fieldTypeOption,
        sectionNameIndexInTable
    ) {
        const customFieldNameIndexInTable = 1,
            fieldTypeOptionIndexInTable = 2;

        const selectors = [
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${customFieldNameIndexInTable})`,
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${fieldTypeOptionIndexInTable})`,
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${sectionNameIndexInTable})`,
        ];
        const fields = [customFieldName, fieldTypeOption, sectionName];

        selectors.forEach((selectors, index) => {
            this.shouldAsseration(selectors, "contain", fields[index]);
        });

        return this;
    }

    verifyMandatoryFieldsExistenceInFirstEntryWithTextType(
        customFieldName,
        sectionNameIndexInTable = 4
    ) {
        this.verifyMandatoryFieldsExistenceInFirstEntry(
            customFieldName,
            fieldTypeOption.text.value,
            sectionNameIndexInTable
        );

        return this;
    }

    verifyMandatoryFieldsExistenceInFirstEntryWithDateType(
        customFieldName,
        sectionNameIndexInTable = 4
    ) {
        this.verifyMandatoryFieldsExistenceInFirstEntry(
            customFieldName,
            fieldTypeOption.date.value,
            sectionNameIndexInTable
        );

        return this;
    }

    verifyMandatoryFieldsExistenceInFirstEntryWithNumberType(
        customFieldName,
        sectionNameIndexInTable = 4
    ) {
        this.verifyMandatoryFieldsExistenceInFirstEntry(
            customFieldName,
            fieldTypeOption.number.value,
            sectionNameIndexInTable
        );

        return this;
    }

    verifyMandatoryFieldsExistenceInFirstEntryWithDropdownType(
        customFieldName,
        sectionNameIndexInTable = 4
    ) {
        this.verifyMandatoryFieldsExistenceInFirstEntry(
            customFieldName,
            fieldTypeOption.dropdown.value,
            sectionNameIndexInTable
        );

        return this;
    }

    typeOptionsName(dropdownOption) {
        cy.get(".ag-stage-item-input").last().click().type(dropdownOption);

        return this;
    }

    addDropdownOptions(wordCount = 3) {
        let randomOptions = [];

        for (let i = 0; i < wordCount; i++) {
            randomOptions.push(getRandomString());
        }

        for (let i = 1; i <= randomOptions.length; i++) {
            this.typeOptionsName(randomOptions[i - 1]);

            this.clickElement("div[name='options'] > button");
        }

        return this;
    }

    clickOnButtonInsideActionButton(buttonIndex) {
        cy.get("tbody > tr")
            .first()
            .find("td .ag-menu-container")
            .click({ force: true });

        cy.get(".ag-menu__item.ag-scroll>button")
            .eq(buttonIndex)
            .click({ force: true });

        return this;
    }

    clickOnEditButtonInsideActionButton() {
        const editButtonIndex = 0;

        this.clickOnButtonInsideActionButton(editButtonIndex);

        return this;
    }

    clickOnDeleteButtonInsideActionButton(deleteButtonIndex) {
        this.clickOnButtonInsideActionButton(deleteButtonIndex);
    }

    clickOnDeleteButtonInsideActionButtonOfInactiveTab() {
        const deleteButtonIndex = 1;

        this.clickOnDeleteButtonInsideActionButton(deleteButtonIndex);

        return this;
    }

    clickOnDeleteButtonInsideActionButtonOfActiveTab() {
        const deleteButtonIndex = 2;

        this.clickOnDeleteButtonInsideActionButton(deleteButtonIndex);

        return this;
    }

    clickOnDeactivateButtonInsideActionButton() {
        const deactivateButtonIndex = 1;

        this.clickOnButtonInsideActionButton(deactivateButtonIndex);

        return this;
    }

    clickOnActivateButtonInsideActionButton() {
        const activateButtonIndex = 0;

        this.clickOnButtonInsideActionButton(activateButtonIndex);

        return this;
    }

    checkSelectModuleDisableProperty() {
        cy.get("div[name='module'] > input[type='text']").should("be.disabled");
    }

    clearNameTypeSection(sectionColumnIndex = 3) {
        const typeColumnIndex = 1;

        cy.get("tbody>tr")
            .first()
            .find("td")
            .eq(sectionColumnIndex)
            .invoke("text")
            .then((sectionColumnSelector) => {
                cy.get("tbody>tr")
                    .first()
                    .find("td")
                    .eq(typeColumnIndex)
                    .invoke("text")
                    .wait(2000)
                    .then((fieldTypeColumnSelector) => {
                        this.typeInSearchBarAndSelectFirstSearchedElement(
                            "div[name='section'] > div[role='combobox']",
                            sectionColumnSelector
                        );

                        this.clickElement(
                            "div[name='section'] > div[role='combobox']>.ag-flex.ag-space-between"
                        );

                        cy.get("div[name='name'] > input[name='name']")
                            .click()
                            .clear();

                        this.typeInSearchBarAndSelectFirstSearchedElement(
                            "div[name='type'] > div[role='combobox']",
                            fieldTypeColumnSelector.trim()
                        );

                        this.clickElement(
                            "div[name='type'] > div[role='combobox']>.ag-flex.ag-space-between"
                        );
                    });
            });

        return this;
    }

    verifyTextInCustomFieldDrawer(selector, method, assertSelector) {
        cy.get(selector)
            .invoke(method)
            .then((textSelector) => {
                expect(textSelector.trim().toLowerCase()).to.contain(
                    assertSelector.toLowerCase()
                );
            });

        return this;
    }

    verifyMandatoryFieldVisibility() {
        cy.get("tbody>tr")
            .first()
            .find("td")
            .then((tableFirstRowselector) => {
                cy.wrap(tableFirstRowselector)
                    .eq(0)
                    .invoke("text")
                    .then((customFieldNameSelector) => {
                        cy.wrap(tableFirstRowselector)
                            .eq(1)
                            .invoke("text")
                            .then((fieldTypeSelector) => {
                                cy.wrap(tableFirstRowselector)
                                    .eq(3)
                                    .invoke("text")
                                    .wait(2000)
                                    .then((sectionNameSelector) => {
                                        this.verifyTextInCustomFieldDrawer(
                                            "div[name='name'] > input[name='name']",
                                            "val",
                                            customFieldNameSelector.trim()
                                        )
                                            .verifyTextInCustomFieldDrawer(
                                                "div[name='type'] > div[role='combobox']>.ag-flex.ag-space-between",
                                                "text",
                                                fieldTypeSelector.trim()
                                            )
                                            .verifyTextInCustomFieldDrawer(
                                                "div[name='section'] > div[role='combobox']>.ag-flex.ag-space-between",
                                                "text",
                                                sectionNameSelector.trim()
                                            );
                                    });
                            });
                    });
            });
    }

    addNewCustomField(customFieldName, fieldTypeOption) {
        this.typeInSearchBarAndSelectFirstSearchedElement(
            "div[name='section'] > div[role='combobox']",
            sectionName
        );
        this.typeInInputBox(
            "div[name='name'] > input[name='name']",
            customFieldName
        );
        this.typeInSearchBarAndSelectFirstSearchedElement(
            "div[name='type'] > div[role='combobox']",
            fieldTypeOption
        );
    }

    addCustomFieldWithDateFieldType(customFieldName) {
        this.addNewCustomField(customFieldName, fieldTypeOption.date.label);

        return this;
    }

    addCustomFieldWithTextFieldType(customFieldName) {
        this.addNewCustomField(customFieldName, fieldTypeOption.text.label);

        return this;
    }

    addCustomFieldWithDropdownFieldType(customFieldName) {
        this.addNewCustomField(customFieldName, fieldTypeOption.dropdown.label);

        return this;
    }

    addCustomFieldWithNumberFieldType(customFieldName) {
        this.addNewCustomField(customFieldName, fieldTypeOption.number.label);

        return this;
    }

    selectWorkflow() {
        this.clickOnSelectWorkflowDropdown();

        cy.get("ul[role='listbox']>li").then((workflowCount) => {
            const selectWorkflowIndex = Math.floor(
                Math.random() * workflowCount.length
            );

            cy.get(`ul[role='listbox'] > li:eq(${selectWorkflowIndex})`).click({
                force: true,
            });
        });

        return this;
    }

    addApplicationCustomFieldWithTextFieldType(customFieldName) {
        this.addCustomFieldWithTextFieldType(customFieldName).selectWorkflow();

        return this;
    }

    addApplicationCustomFieldWithDropdownFieldType(customFieldName) {
        this.addCustomFieldWithDropdownFieldType(
            customFieldName
        ).selectWorkflow();

        return this;
    }

    addApplicationCustomFieldWithDateFieldType(customFieldName) {
        this.addCustomFieldWithDateFieldType(customFieldName).selectWorkflow();

        return this;
    }

    addApplicationCustomFieldWithNumberFieldType(customFieldName) {
        this.addCustomFieldWithNumberFieldType(
            customFieldName
        ).selectWorkflow();

        return this;
    }

    checkExistenceInFirstEntry(customFieldName, containMethod) {
        this.shouldAsseration(
            `tr:nth-of-type(${tableFirstRowIndex}) > td:nth-of-type(${firstCustomFieldNameIndexInTable})`,
            containMethod,
            customFieldName
        );
    }

    verifyCustomFieldNonExistenceInFirstEntry(customFieldName) {
        this.checkExistenceInFirstEntry(customFieldName, "not.contain");

        return this;
    }

    verifyCustomFieldExistenceInFirstEntry(customFieldName) {
        this.checkExistenceInFirstEntry(customFieldName, "contain");

        return this;
    }

    verifySelectedModule(module, value) {
        this.verifySelectedText(
            "div[name='module'] > div[role='combobox']",
            module
        ).shouldAsseration(
            "div[role='combobox'] > input[name='entity']",
            "have.value",
            value
        );
    }

    verifyClientAsSelectedInSelectModule() {
        this.verifySelectedModule("Client", "client");

        return this;
    }

    verifyPartnerAsSelectedInSelectModule() {
        this.verifySelectedModule("Partner", "partner");

        return this;
    }

    verifyApplicationAsSelectedInSelectModule() {
        this.verifySelectedModule("Application", "application");

        return this;
    }

    verifyProductAsSelectedInSelectModule() {
        this.verifySelectedModule("Product", "product");

        return this;
    }

    typeDateInFieldType() {
        this.typeInSearchBarAndSelectFirstSearchedElement(
            "div[name='type'] > div[role='combobox']",
            fieldTypeOption.date.label
        );

        return this;
    }

    typeDropdownInFieldType() {
        this.typeInSearchBarAndSelectFirstSearchedElement(
            "div[name='type'] > div[role='combobox']",
            fieldTypeOption.dropdown.label
        );

        return this;
    }

    typeNumberInFieldType() {
        this.typeInSearchBarAndSelectFirstSearchedElement(
            "div[name='type'] > div[role='combobox']",
            fieldTypeOption.number.label
        );

        return this;
    }

    checkEmptyValidationErrors() {
        const emptyValidationErrors = [
            "The Section Id field is required.",
            "The Name field is required.",
            "The Type field is required.",
        ];

        cy.checkValidationErrors(emptyValidationErrors);
    }

    checkEmptyValidationErrorsInApplicationCustomField() {
        const emptyValidationErrors = [
            "The Section Id field is required.",
            "The Name field is required.",
            "The Type field is required.",
            "This field is required",
        ];

        cy.checkValidationErrors(emptyValidationErrors);
    }

    verifyCustomNameTextLimitationError() {
        const customNameTextLimitationError = [
            "The Field Name should not be greater than 30 characters",
        ];

        cy.checkValidationErrors(customNameTextLimitationError);
    }

    verifyEmptyOptionNameValidationError() {
        const emptyOptionNameValidationError = ["Option name cannot be empty."];

        cy.checkValidationErrors(emptyOptionNameValidationError);
    }

    verifyOptionUniqueValidationError() {
        const optionUniqueValidationError = ["Option already exists."];

        cy.checkValidationErrors(optionUniqueValidationError);
    }

    verifyEmptyOptionValidationError() {
        const emptyOptionValidationError = [
            "There must be at least one option.",
        ];

        cy.checkValidationErrors(emptyOptionValidationError);
    }

    verifyUniqueCustomNameValidationError() {
        const uniqueCustomNameValidationError = [
            "The name has already been taken.",
        ];

        cy.checkValidationErrors(uniqueCustomNameValidationError);
    }

    clickOnSelectWorkflowDropdown() {
        cy.get(".ag-stages-field div[role='combobox']").click({ force: true });

        return this;
    }

    getSectionNamesFromApi() {
        cy.intercept("GET", "api/v2/custom-fields/sections/**").as(
            "sectionNamesRequest"
        );

        return this;
    }

    verifyWorkflowNamesWithApiFetchedWorkflowNames() {
        cy.wait("@activeWorkflowList").then((result) => {
            let workflowNamesListFromApi = result.response.body.data.map(
                (data) => data.name
            );

            cy.get("ul[role='listbox'] > li").each(
                (workflowNamesList, index) => {
                    cy.wrap(workflowNamesList)
                        .invoke("text")
                        .then((workflowNames) => {
                            expect(workflowNames.trim()).to.equal(
                                workflowNamesListFromApi[index].trim()
                            );
                        });
                }
            );
        });
    }

    verifySectionNamesWithApiFetchedSectionNames() {
        cy.wait("@sectionNamesRequest").then((result) => {
            let sectionNamesListFromApi = result.response.body.data.map(
                (data) => data.name
            );

            cy.get("ul[role='listbox'] > li").each(
                (sectionNamesList, index) => {
                    cy.wrap(sectionNamesList)
                        .invoke("text")
                        .then((sectionNames) => {
                            expect(sectionNames.trim()).to.equal(
                                sectionNamesListFromApi[index].trim()
                            );
                        });
                }
            );
        });
    }
}

export default CustomFields_PO;
