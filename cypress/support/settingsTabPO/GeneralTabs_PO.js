class GeneralTabs_PO {
    clickOnDiscontinuedReasonsTab() {
        cy.get("[href='#/settings/general/discontinued-reason']").click();
    }

    clickOnOthersTab() {
        cy.get("[href='#/settings/general/others']").click();
    }
}

export default GeneralTabs_PO;
