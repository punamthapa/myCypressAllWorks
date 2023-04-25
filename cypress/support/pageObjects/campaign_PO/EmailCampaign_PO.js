class EmailCampaign_PO {
    clickOnEmailCampaign() {
        cy.get("#campaignMenu  li > a").click({ force: true });

        return this;
    }

    clickOnCreateNewCampaignButton() {
        cy.get("[data-dd-action-name='create-new-campaign']").click({
            force: true,
        });

        return this;
    }

    fillForm(campaignName, name, subject) {
        cy.get("input[name='campaignName']").clear().type(campaignName);
        cy.get("div[name='name'] > input[name='name']").clear().type(name);
        cy.get(".ql-editor> p").clear().type(subject);

        return this;
    }

    verifyInputDataInLists(containAssertion, campaignName) {
        cy.get("tbody tr:nth-of-type(1) .text-primary-blue").should(
            containAssertion,
            campaignName
        );

        return this;
    }

    clickOnCancelButton() {
        cy.get('[data-dd-action-name="cancel-campaign"]').click({
            force: true,
        });

        return this;
    }

    clickOnAcceptButton() {
        this.clickOnCancelButton();

        cy.get(".accept").contains("Accept").click();

        return this;
    }

    verifyUrlOfEmailCampaign() {
        cy.url().should("include", "campaign/email/overview");
    }

    clickOnNextButton() {
        cy.get('[ data-dd-action-name="create-campaign-next-step"]').click({
            force: true,
        });

        return this;
    }

    verifyEmptyValidationError() {
        const emptyValidationErrors = [
            "The Name field is required.",
            "The Sender Name field is required.",
            "The Sender Email field is required.",
            "The Subject field is required.",
        ];
        cy.checkValidationErrors(emptyValidationErrors);
    }

    verifyNextStepClass() {
        cy.get(".stepper-item-counter>span")
            .eq(1)
            .should("have.class", "current");
    }

    clickOnSaveDraftButton() {
        this.clickOnCancelButton();

        cy.get(".cancel").contains("Save Draft").click();
    }

    verifyCampaignName(containAssertion, campaignName) {
        const campaignNameColumnIndex = 1;

        cy.get(
            `table>tbody>tr:first-child> td:nth-child(${campaignNameColumnIndex})>span>.text-primary-blue`
        ).should(containAssertion, campaignName);

        return this;
    }

    verifyStatusOfRecentlyCreateCampaign(containAssertion, status) {
        const statusColumnIndex = 2;

        cy.get(
            `table>tbody>tr:first-child> td:nth-child(${statusColumnIndex})>.ag-flex > .marginNone`
        ).should(containAssertion, status);

        return this;
    }
}

export default EmailCampaign_PO;
