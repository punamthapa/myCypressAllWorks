class Notes_PO {
    clickOnAddButton() {
        cy.get(".blueButton.button.text-uppercase").contains("Add").click();

        return this;
    }

    enterNoteTitle(title) {
        cy.get("input[name='title']").click().clear().type(title);

        return this;
    }

    enterNoteDescription(description) {
        cy.get(".ql-editor > p").click().clear().type(description);

        return this;
    }

    clickOnSubmitButton() {
        cy.get('button[type="submit"]').contains("Submit").click();

        return this;
    }

    verifyTitleInCard(containAssertion, title) {
        cy.get(".stretched .column:nth-of-type(1) .truncate").should(
            containAssertion,
            title
        );

        return this;
    }

    verifyDescriptionInCard(containAssertion, description) {
        cy.get(".stretched .column:nth-of-type(1) .description")
            .eq(0)
            .should(containAssertion, description);

        return this;
    }

    clickOnActionButtonOfNotes() {
        cy.get(".notesTerms-dropdown ").eq(0).click();

        return this;
    }

    clickOnDeleteOption() {
        cy.get(".transition>.item").contains("Delete").click();
        cy.get(".accept").contains("Delete").click();

        return this;
    }

    clickOnEditOption() {
        cy.get(".transition>.item").contains("Edit").click();

        return this;
    }
}

export default Notes_PO;
