class AgDrawer_PO {
    verifyExistenceOfAgDrawer(drawerShouldExists = true) {
        const drawerSelector = ".ag-drawer";

        if (drawerShouldExists) {
            cy.get(drawerSelector).should("exist");
        } else {
            cy.get(drawerSelector).should("be.hidden");
        }

        return this;
    }

    verifyExistenceOfAgDrawerTitle(title) {
        cy.get(".ag-drawer")
            .find("h4")
            .then((titleSelector) => {
                const titleText = titleSelector
                    .text()
                    .trim()
                    .replace(/\n \s+/g, " ");

                expect(titleText).to.contain(title);
            });

        return this;
    }
}

export default AgDrawer_PO;
