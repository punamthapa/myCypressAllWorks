class DocumentType_PO {
    enterDocumentTypeName(documentTypeName) {
        cy.get(".input-field>.form-control").clear().type(documentTypeName);

        return this;
    }

    clickOnSaveButton() {
        cy.get(".form > .ag-justify-end > .blueButton").click();

        return this;
    }

    clickOnThreeDotActionButton() {
        cy.get("table>tbody>tr>td")
            .eq(5)
            .find(".ag-menu-container")
            .click({ force: true });

        return this;
    }

    verifyFirstStatusValue(status) {
        cy.get("table>tbody>tr>td").eq(3).should("contain", status);
        return this;
    }

    verifyFirstDocumentTypeValue(name) {
        cy.get("table>tbody>tr>td").eq(0).should("contain", name);
        return this;
    }

    verifyStatusOnThreeDotActionButton(status) {
        cy.get(".ag-menu__item.ag-scroll>a").last().should("contain", status);
    }

    clickOnRenameButton() {
        cy.get(".ag-menu__item.ag-scroll>a").first().click({ force: true });

        return this;
    }

    verifyErrorMessage(errorClass, errorMessage) {
        cy.get(errorClass)
            .should("contain.text", errorMessage)
            .should("be.visible");
    }

    clickOnAcceptButtonInAgModal() {
        cy.get(".modal-content > .modal-body > .redButton").click();

        return this;
    }

    verifyPageTitle() {
        cy.get(".ag-setting-block.settings-body__margin > div > h4").should(
            "have.text",
            "Workflows"
        );
    }
}
export default DocumentType_PO;
