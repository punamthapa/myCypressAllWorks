class WorkFlow_PO {
    verifyExistenceOfPointsToRemember() {
        cy.get(".background-white > .message >div >.header ").should(
            "contain",
            "Points to remember"
        );
        cy.get(" .background-white >.message >div >.list >li").should(
            "contain",
            "A workflow will always have atleast 2 stages by default"
        );

        return this;
    }
    clickOnSaveButton() {
        cy.get(".col-v-6 > .blueButton").contains("Save").click();

        return this;
    }

    clickOnUpdateButton() {
        cy.get(".col-v-6 > .blueButton").contains("Update").click();

        return this;
    }

    checkValidationErrors(validationErrors) {
        cy.get(".ui.basic.js-input-error").each(
            (validationErrorsSelector, index) => {
                expect(validationErrorsSelector).to.contain(
                    validationErrors[index]
                );
            }
        );
        return this;
    }

    fillElements(workflowName, stageOneName, stageTwoName) {
        cy.get("#workflowName").click().type(workflowName);
        cy.get(".ag-stage-item-input").first().click().type(stageOneName);
        cy.get(".ag-stage-item-input").last().click().type(stageTwoName);

        return this;
    }

    clickOnAddMoreStage() {
        cy.get("form > div> .ag-align-center").click();

        return this;
    }

    clickOnFirstActivityButton() {
        const activityButtonColumnIndex = 4;

        cy.get(
            `tbody>tr:last-child>td:nth-of-type(${activityButtonColumnIndex}) .ag-menu-container`
        ).click();

        return this;
    }

    verifyExistenceOfWorkflowName(workflowName) {
        cy.get("table>tbody>tr:last-child > td:first-child").should(
            "contain",
            workflowName
        );

        return this;
    }

    verifyStatusOfRecentlyCreatedWorkflow(containAssertion, Status) {
        const statusColumnIndex = 3;

        cy.get(
            `table>tbody>tr:last-child> td:nth-child(${statusColumnIndex})`
        ).should(containAssertion, Status);

        return this;
    }

    verifyTotalPartnersCountOfRecentlyCreatedWorkflow() {
        const totalPartnerColumnIndex = 2;

        cy.get(
            `table>tbody>tr:last-child > td:nth-child(${totalPartnerColumnIndex})`
        ).should("contain", "0");

        return this;
    }
    verifyingCheckedStatusOfOfficeOptionsFields() {
        cy.get("form > div > div > label > input")
            .eq(0)
            .should("be.checked")
            .and("have.value", "true");

        return this;
    }

    clearAllFields() {
        cy.get("#workflowName").click().clear();
        cy.get(".ag-stage-item-input").first().click().clear();
        cy.get(".ag-stage-item-input").last().click().clear();

        return this;
    }

    clickOnEditButton() {
        cy.get(".ag-menu__item > a").should("contain", " Edit").click();

        return this;
    }

    clickOnDeactivateButton() {
        cy.get(".ag-menu__item > .transparent-button")
            .should("contain", " Deactivate")
            .click();

        return this;
    }

    clickOnActivateButton() {
        cy.get(".ag-menu__item > :nth-child(1)")
            .should("contain", " Activate")
            .click();

        return this;
    }

    verifyTwoDefaultStages() {
        cy.get(" .ag-stages-item-container > .ag-stages-item")
            .its("length")
            .should("eq", 2);

        return this;
    }

    verifyExistenceOfSubActions() {
        cy.get(".ag-stages-field:nth-of-type(1)>div>div>div>button").then(
            ($subactionsElements) => {
                cy.get($subactionsElements)
                    .should("have.length", 4)
                    .and("exist");
            }
        );

        return this;
    }

    verifyAbsenceOfDeleteButtonForDefaultStages() {
        const indexOfDeleteStage = 5;

        cy.get(
            ` .ag-stages .ag-stages-field:nth-of-type(${indexOfDeleteStage})  [type='button']:nth-of-type(5)`
        ).should("not.exist");

        return this;
    }
}
export default WorkFlow_PO;
