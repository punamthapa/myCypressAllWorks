/// <reference types= "cypress" />

import Agent_PO from "../../../support/pageObjects/Agent_PO";
import faker from "@faker-js/faker";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";

describe("Test for Agent Module", () => {
    const agent_PO = new Agent_PO();
    const homePage_PO = new HomePage_PO();
    const validationErrors = [
        "The Name field is required.",
        "The Email field is required.",
        "The Related Offices field is required.",
    ];

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        const name = faker.random.words();
        const email = faker.internet.email();
        const primaryContactName = faker.random.words();

        cy.wrap(name).as("agentName");
        cy.wrap(email).as("agentEmail");
        cy.wrap(primaryContactName).as("primaryName");

        homePage_PO.clickOnAgentModule();

        cy.wait(3000);
    });

    it("Should verify pagination", () => {
        cy.verifyPaginator();
    });

    context("Click on 'Add' button dependent test", () => {
        beforeEach(() => {
            cy.clickOnAddButton();
        });

        it("Should check for empty validation", function () {
            agent_PO.clickOnSaveButton();

            cy.checkValidationErrors(validationErrors);
        });

        context("Click on 'Super Agent' type dependent test", function () {
            beforeEach(() => {
                agent_PO.clickOnSuperAgentType();
            });

            it("Should add agent type 'Super Agent' and structure 'Individual'", function () {
                agent_PO
                    .typeAgentName(this.agentName)
                    .typeAgentEmail(this.agentEmail)
                    .selectOfficeFromDropdown()
                    .clickOnSaveButton();

                cy.reload();

                agent_PO
                    .verifyInputDataInList(this.agentName, this.agentEmail)
                    .verifyAgentType("Super Agent")
                    .verifyAgentStructure("Individual")
                    .verifyOffice();
            });

            it("Should add agent type 'Super Agent' and structure 'Business'", function () {
                agent_PO
                    .clickOnBusinessStructure()
                    .typeAgentName(this.agentName)
                    .typePrimaryContactName(this.primaryName)
                    .typeAgentEmail(this.agentEmail)
                    .selectOfficeFromDropdown()
                    .clickOnSaveButton()
                    .verifyInputDataInList(this.agentName, this.agentEmail)
                    .verifyAgentType("Super Agent")
                    .verifyAgentStructure("Business")
                    .verifyOffice();
            });

            it("Should edit the agent and verify its existence", function () {
                agent_PO
                    .clickOnBusinessStructure()
                    .typeAgentName(this.agentName)
                    .typePrimaryContactName(this.primaryName)
                    .typeAgentEmail(this.agentEmail)
                    .selectOfficeFromDropdown()
                    .clickOnSaveButton()
                    .clickOnFirstActivityButton()
                    .clickOnEditButton()
                    .typeAgentName(this.agentName)
                    .typeAgentEmail(this.agentEmail)
                    .clickOnSaveButton()
                    .clickOnAgentListButton()
                    .verifyInputDataInList(this.agentName, this.agentEmail);
            });
        });

        context("Click on 'Sub Agent' type dependent test", function () {
            beforeEach(() => {
                agent_PO.clickOnSubAgentType();
            });

            it("Should add agent type 'Sub Agent' and structure 'Individual'", function () {
                agent_PO
                    .typeAgentName(this.agentName)
                    .typeAgentEmail(this.agentEmail)
                    .selectOfficeFromDropdown()
                    .clickOnSaveButton()
                    .verifyInputDataInList(this.agentName, this.agentEmail)
                    .verifyAgentType("Sub Agent")
                    .verifyAgentStructure("Individual")
                    .verifyOffice();
            });

            it("Should add agent type 'Sub Agent' and structure 'Business'", function () {
                agent_PO
                    .clickOnBusinessStructure()
                    .typeAgentName(this.agentName)
                    .typePrimaryContactName(this.primaryName)
                    .typeAgentEmail(this.agentEmail)
                    .selectOfficeFromDropdown()
                    .clickOnSaveButton()
                    .verifyInputDataInList(this.agentName, this.agentEmail)
                    .verifyAgentType("Sub Agent")
                    .verifyAgentStructure("Business")
                    .verifyOffice();
            });
        });

        context("Click on Agent with both type dependent test", () => {
            beforeEach(() => {
                agent_PO.clickOnSuperAgentType().clickOnSubAgentType();
            });

            it("Should add agent type 'Sub Agent' and 'Super Agent' and structure 'Business'", function () {
                agent_PO
                    .clickOnBusinessStructure()
                    .typeAgentName(this.agentName)
                    .typePrimaryContactName(this.primaryName)
                    .typeAgentEmail(this.agentEmail)
                    .selectOfficeFromDropdown()
                    .clickOnSaveButton()
                    .verifyInputDataInList(this.agentName, this.agentEmail)
                    .verifyAgentType("Super Agent, Sub Agent")
                    .verifyAgentStructure("Business")
                    .verifyOffice();
            });

            context("Add mandatory agent fields dependent test", () => {
                beforeEach(function () {
                    agent_PO
                        .typeAgentName(this.agentName)
                        .typeAgentEmail(this.agentEmail)
                        .selectOfficeFromDropdown()
                        .clickOnSaveButton();
                });

                it("Should add agent type 'Sub Agent' and 'Super Agent' and structure 'Individual'", function () {
                    agent_PO
                        .verifyInputDataInList(this.agentName, this.agentEmail)
                        .verifyAgentType("Super Agent, Sub Agent")
                        .verifyAgentStructure("Individual")
                        .verifyOffice();
                });

                context("Inactive agent dependent test", () => {
                    beforeEach(function () {
                        agent_PO
                            .clickOnFirstActivityButton()
                            .clickOnInactiveButton()
                            .clickOnInactiveTab();
                    });

                    it("Should inactive agent and verify existence in Inactive tab and non existence in Active tab ", function () {
                        agent_PO
                            .verifyInputDataInList(
                                this.agentName,
                                this.agentEmail
                            )
                            .clickOnActiveTab()
                            .verifyInputDataInList(
                                this.agentName,
                                this.agentEmail,
                                "not.contain"
                            );
                    });

                    context("Edit inactive agent dependent test", () => {
                        beforeEach(() => {
                            agent_PO
                                .clickOnFirstActivityButton()
                                .clickOnEditButton();
                        });

                        it("Should check for empty validation", () => {
                            agent_PO
                                .typeAgentName(" ")
                                .typeAgentEmail(" ")
                                .removeSelectedOffice()
                                .clickOnSaveButton();

                            cy.checkValidationErrors(validationErrors);
                        });

                        it("Should verify existence of edited agent", function () {
                            const newName = faker.random.words();
                            const newEmail = faker.internet.email();

                            agent_PO
                                .typeAgentName(newName)
                                .typeAgentEmail(newEmail)
                                .clickOnSaveButton()
                                .clickOnAgentListButton()
                                .clickOnInactiveTab()
                                .verifyInputDataInList(newName, newEmail);
                        });
                    });
                });
            });
        });
    });
});
