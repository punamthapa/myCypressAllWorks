class GeneralPartnerProductType_PO {
    verifyPageTitle() {
        cy.get(".ag-setting-block.settings-body__margin > div > h4").should(
            "have.text",
            " General"
        );
        return this;
    }

    verifyTabTitles() {
        const generalTabTitles = [
            "Product / Partner Type",
            "Discontinued Reasons",
            "Others",
        ];

        cy.get(".nav.nav-tabs.defaultNav> li").each(($el, index) => {
            expect($el).to.have.text(generalTabTitles[index]);
        });
    }

    selectMasterCategory(masterCategories) {
        cy.get("div[name='master_category'] > div[role='combobox']").click({
            force: true,
        });

        cy.get(".ag-select-search-input").click().type(masterCategories);

        cy.get(".ag-select-list-wrapper > ul > li").first().click();

        return this;
    }

    enterTypeName(typeName) {
        cy.get('form.novalidate.ui.form.col-v-4 > div> input[label="name"]')
            .click({ force: true })
            .clear()
            .type(typeName);

        return this;
    }

    clickSaveButton() {
        cy.get('button[type="submit"]').contains("Save").click();

        return this;
    }

    clickOnProductType() {
        cy.get(".ag-capsule >li").last().click({ force: true });
    }

    clickOnProductTypeRadioButton() {
        cy.get(".category-type__radio").last().click();

        return this;
    }

    verifyAddedType(categoryColumnIndex, assertion, content) {
        cy.get(
            `table>tbody>tr:last-child > td:nth-child(${categoryColumnIndex})`
        ).should(assertion, content);

        return this;
    }

    verifyAddedTypeInList(typeName, containAssertion = "contain") {
        const addedTypeCategoryColumnIndex = 1;

        this.verifyAddedType(
            addedTypeCategoryColumnIndex,
            containAssertion,
            typeName
        );

        return this;
    }

    verifyMasterCategoryOfType(masterCategories, assertion = "contain") {
        const masterCategoryColumnIndex = 2;

        this.verifyAddedType(
            masterCategoryColumnIndex,
            assertion,
            masterCategories
        );

        return this;
    }

    verifyTypeStatus(status, assertion = "contain") {
        const statusColumnIndex = 3;

        this.verifyAddedType(statusColumnIndex, assertion, status);

        return this;
    }

    clickOnActivityButton(index) {
        cy.wait(2000);

        cy.get(
            "tbody>tr:last-child>td:nth-of-type(4) .ag-menu-container"
        ).click();

        cy.wait(2000);

        cy.get(
            `.ag-menu.ag-menu--left.ag-menu--shown > div > button:nth-of-type(${index})`
        ).click();
    }

    clickOnActivateButton() {
        const activateButtonIndex = 2;

        this.clickOnActivityButton(activateButtonIndex);

        cy.get(".accept").contains("Confirm").click();

        return this;
    }

    clickOnDeactivateButton() {
        this.clickOnActivateButton();

        return this;
    }

    clickEditButton() {
        const editButtonIndex = 1;

        this.clickOnActivityButton(editButtonIndex);

        return this;
    }

    clickDeleteButton() {
        const deleteButtonIndex = 3;

        this.clickOnActivityButton(deleteButtonIndex);

        cy.get(".accept").contains("Delete").click();

        return this;
    }

    checkNameUniqueness() {
        const uniquePartnerNameErrorMessage = [
            "The name has already been taken.",
        ];

        cy.checkValidationErrors(uniquePartnerNameErrorMessage);
    }

    checkEmptyValidationError() {
        const errorMessage = [
            "Master category is required.",
            "Partner type is required.",
        ];

        cy.checkValidationErrors(errorMessage);
    }

    checkProductEmptyValidationError() {
        const errorMessage = [
            "Master category is required.",
            "Product type is required.",
        ];

        cy.checkValidationErrors(errorMessage);
    }

    clickCancelButton() {
        cy.get(".ag-justify-end > .button.defaultButton").click();

        return this;
    }
}

export default GeneralPartnerProductType_PO;
