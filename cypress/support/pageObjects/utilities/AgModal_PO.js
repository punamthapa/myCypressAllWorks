class AgModal_PO {
    verifyExistenceOfAgModal(modalShouldExists = true) {
        const modalSelector = ".ag-modal";

        if (modalShouldExists) {
            cy.get(modalSelector).should("exist");
        } else {
            cy.get(modalSelector).should("be.hidden");
        }

        return this;
    }

    verifyExistenceOfAgModalTitle(title) {
        cy.get(".ag-modal__title > span").should("have.text", title);

        return this;
    }
}

export default AgModal_PO;
