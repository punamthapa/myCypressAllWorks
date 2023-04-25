class Setting_PO {
    clickOnWorkflowMenu() {
        cy.get("[href='#/settings/workflows/workflow-list']").click({
            force: true,
        });
    }

    clickOnTemplateMenu() {
        cy.get('[href="#/settings/templates"]').click({ force: true });
    }

    clickOnGeneralMenu() {
        cy.get("[href='#/settings/general']").click();
    }

    clickOnCustomFields() {
        cy.get("[href='#/settings/custom-fields/client']").click();
    }

    clickOnTagmanagamentField() {
        cy.get("[href='#/settings/tag-management']").click();
    }

    clickOnLeadForm() {
        cy.get('[href="#/settings/lead-forms"]').click();
    }

    clickOnApiIntegrations() {
        cy.get('[href="#/settings/api"]').click({ force: true });
    }
}

export default Setting_PO;
