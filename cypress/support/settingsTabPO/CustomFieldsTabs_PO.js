class CustomFieldsTabs_PO {
    clickOnPartnerTab() {
        cy.get("[href='#/settings/custom-fields/partner']").click();
    }

    clickOnProductTab() {
        cy.get("[href='#/settings/custom-fields/product']").click();
    }

    clickOnApplicationTab() {
        cy.get("[href='#/settings/custom-fields/application']").click();
    }
}

export default CustomFieldsTabs_PO;
