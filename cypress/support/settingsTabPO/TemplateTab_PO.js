class TemplateTab_PO {
    clickOnSmsTemplate() {
        cy.get("[href= '#/settings/templates/sms']").click();
    }
}

export default TemplateTab_PO;
