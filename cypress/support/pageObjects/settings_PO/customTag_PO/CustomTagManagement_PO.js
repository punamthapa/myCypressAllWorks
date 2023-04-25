class CustomTagManagement_PO {
    typeTagNameInInputField(customTagName) {
        cy.get("form > div > div > input").click().type(customTagName);

        return this;
    }

    verifyExistenceOfCreatedTagName(customTagName) {
        cy.get(".col-v-3.tableWrapper")
            .first()
            .should("contain", customTagName);

        return this;
    }

    clickOnActivityButton() {
        cy.get(
            ":nth-child(1) > :nth-child(6) > span > .ag-menu-container"
        ).click({ force: true });

        return this;
    }

    clickOnEditOption() {
        cy.get(".ag-menu__item > button:nth-of-type(1)").click({ force: true });
        cy.get("div#confirmModal > .modal-dialog");
        cy.get(".accept").click({ force: true });

        return this;
    }

    clickOnRemoveOption() {
        cy.get(".ag-menu__item > button:nth-of-type(2)").click({ force: true });
        cy.get("div#confirmModal > .modal-dialog");
        cy.get(".accept").click({ force: true });

        return this;
    }

    clickOnSaveButton() {
        cy.get(".form > .ag-justify-end > .blueButton")
            .contains("Save")
            .click({ force: true });

        return this;
    }

    clearEditInputField() {
        cy.get("form > div > div > input").click().clear();

        return this;
    }

    verifyDeletionOfCreatedTagName(customTag) {
        cy.get("tbody > :nth-child(1) > :nth-child(1)").should(
            "not.contain",
            customTag
        );

        return this;
    }
}
export default CustomTagManagement_PO;
