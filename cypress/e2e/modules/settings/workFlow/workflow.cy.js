/// <reference types= "cypress" />
import faker from "@faker-js/faker";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import WorkFlow_PO from "../../../../support/pageObjects/settings_PO/workflows_PO/WorkFlow_PO";

const workflowName = faker.lorem.sentence();
const stageOneName = faker.lorem.sentence();
const stageTwoName = faker.lorem.sentence();

describe("Test in workflow inside settings", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const workflow_PO = new WorkFlow_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnWorkflowMenu();

        cy.wait(3000);
    });

    context("Workflow add button dependent test", () => {
        beforeEach(() => {
            const validationErrors = [
                "The Name field is required.",
                "Stage Name is required",
                "Stage Name is required",
            ];
            cy.wrap(validationErrors).as("errorMessage");

            cy.clickOnAddButton();

            workflow_PO.verifyExistenceOfPointsToRemember();
        });

        it("Should show validation error message if form is submitted empty", function () {
            workflow_PO
                .clickOnSaveButton()
                .checkValidationErrors(this.errorMessage);
        });

        context("Form fill dependent test", () => {
            beforeEach(() => {
                workflow_PO.fillElements(
                    workflowName,
                    stageOneName,
                    stageTwoName
                );
            });

            it("Should show validation error message if we add additional workflow stage empty and save", () => {
                workflow_PO
                    .clickOnAddMoreStage()
                    .clickOnSaveButton()
                    .checkValidationErrors(["Stage Name is required"]);
            });

            context("Verifying status of added workflow", () => {
                beforeEach(() => {
                    workflow_PO
                        .verifyingCheckedStatusOfOfficeOptionsFields()
                        .clickOnSaveButton()
                        .verifyExistenceOfWorkflowName(workflowName)
                        .verifyStatusOfRecentlyCreatedWorkflow(
                            "contain",
                            "Active"
                        )
                        .verifyTotalPartnersCountOfRecentlyCreatedWorkflow();
                });

                it("Deactivate and then activate the existing workflow", () => {
                    workflow_PO
                        .clickOnFirstActivityButton()
                        .clickOnDeactivateButton()
                        .verifyStatusOfRecentlyCreatedWorkflow(
                            "contain",
                            "Inactive"
                        )
                        .clickOnFirstActivityButton()
                        .clickOnActivateButton()
                        .verifyStatusOfRecentlyCreatedWorkflow(
                            "contain",
                            "Active"
                        );
                });

                it("Should edit workflow and verify existence of edited workflow in table", () => {
                    const updatedWorkflowName = faker.lorem.sentence();
                    const updatedStageOneName = faker.lorem.sentence();
                    const updatedStageTwoName = faker.lorem.sentence();

                    workflow_PO
                        .clickOnFirstActivityButton()
                        .clickOnEditButton()
                        .clearAllFields()
                        .fillElements(
                            updatedWorkflowName,
                            updatedStageOneName,
                            updatedStageTwoName
                        )
                        .clickOnUpdateButton()
                        .verifyExistenceOfWorkflowName(updatedWorkflowName);
                });

                it("Should edit workflow and validate if we save with empty fields ", function () {
                    workflow_PO
                        .clickOnFirstActivityButton()
                        .clickOnEditButton()
                        .clearAllFields()
                        .clickOnUpdateButton()
                        .checkValidationErrors(this.errorMessage);
                });
            });
        });

        it("Should exists only two stages by default", () => {
            workflow_PO
                .verifyTwoDefaultStages()
                .verifyExistenceOfSubActions()
                .verifyAbsenceOfDeleteButtonForDefaultStages();
        });

        it("Should populate new input field when we click on add new stages", () => {
            cy.get(" .ag-stages-item-container > .ag-stages-item")
                .its("length")
                .then((stageCount) => {
                    workflow_PO.clickOnAddMoreStage();

                    cy.get(" .ag-stages-item-container > .ag-stages-item")
                        .its("length")
                        .then((count) => {
                            const newStageCount = count;
                            expect(newStageCount).eq(stageCount + 1);
                        });
                });
        });

        it("Click on add more stages button and verify the max number of stages to be 20", () => {
            for (let i = 1; i <= 18; i++) {
                workflow_PO.clickOnAddMoreStage();
            }
            cy.get(" .ag-stages-item-container > .ag-stages-item")
                .its("length")
                .then((totalCount) => {
                    expect(totalCount).eq(20);
                });

            cy.get(".blueButton.ag-align-center").should("not.be.visible");
        });

        //@wip, facing issue in implementing drag&drop
        // it("Should drag and drop the stages", () => {
        //     workflow_PO.fillElements(workflowName, "1", "2");

        // cy.get(
        //     ".ag-stages .ag-stages-field:nth-of-type(1)  >.ag-stages-item-container >.ag-stages-item >label>.col-hr-2 >use"
        // ).trigger("mouseup", { force: true });
        // cy.get(
        //     ".ag-stages .ag-stages-field:nth-of-type(2)  >.ag-stages-item-container >.ag-stages-item >label>.col-hr-2 >use"
        // ).click({force: true})
        //     .trigger("mousemove", { force: true })
        //     .trigger("mouseup", { force: true });

        // cy.get(
        //     ".ag-stages .ag-stages-field:nth-of-type(1)  >.ag-stages-item-container >.ag-stages-item >label >.col-hr-2>use"
        // ).click({force: true}).trigger("mouseup", { force: true }, { which: 1 });
        // cy.get(
        //     ".ag-stages .ag-stages-field:nth-of-type(2)  >.ag-stages-item-container >.ag-stages-item >label >.col-hr-2"
        // ).click({force: true})
        //     .trigger("mousemove", { force: true })
        //     .trigger("mouseup", { force: true });

        //cy.get('.ag-stages .ag-stages-field:nth-of-type(1)').drag('.ag-stages .ag-stages-field:nth-of-type(2)')

        //     const dataTransfer = new DataTransfer();
        //     cy.get(
        //         ".ag-stages .ag-stages-field:nth-of-type(1)  >.ag-stages-item-container >.ag-stages-item >label>.col-hr-2 >use"
        //     )
        //         .click({ force: true })
        //         .trigger("dragstart", { dataTransfer }, { force: true });
        //     cy.get(
        //         ".ag-stages .ag-stages-field:nth-of-type(2)  >.ag-stages-item-container >.ag-stages-item >label>.col-hr-2 >use"
        //     ).trigger("drop", { dataTransfer });
        //     cy.get(
        //         ".ag-stages .ag-stages-field:nth-of-type(1)  >.ag-stages-item-container >.ag-stages-item >label>.col-hr-2 >use"
        //     ).trigger("dragend");

        // cy.get(' .ag-stages .ag-stages-field:nth-of-type(1)  >.ag-stages-item-container >.ag-stages-item >label >.col-hr-2').trigger("mousedown").wait(1500).trigger("mousemove");
        // cy.get(' .ag-stages .ag-stages-field:nth-of-type(2)  >.ag-stages-item-container >.ag-stages-item >label>.col-hr-2 ').trigger("mouseup")
        // });
    });
});
