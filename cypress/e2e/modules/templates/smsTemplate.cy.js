/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";
import SmsTemplates_PO from "../../../support/pageObjects/settings_PO/templates_PO/SmsTemplates_PO";
import AgDrawer_PO from "../../../support/pageObjects/utilities/AgDrawer_PO";

describe("Test in sms template inside settings", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const smsTemplate_PO = new SmsTemplates_PO();
    const agDrawer_PO = new AgDrawer_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnTemplateMenu();
        smsTemplate_PO.clickOnSmsTemplate();

        cy.wait(3000);
    });

    it("Should verify pagination of sms template page", () => {
        cy.verifyPaginator();
    });

    context("Click on 'Add' button dependent test", () => {
        const emptyValidationErrors = [
            "The Title field is required.",
            "The Description field is required.",
        ];

        beforeEach(() => {
            const smsTitle = faker.lorem.words();
            const smsMessage = faker.lorem.sentence();

            cy.wrap(smsTitle).as("smsTitle");
            cy.wrap(smsMessage).as("smsMessage");

            cy.clickOnAddButton();
        });

        it("Should verify the existence of drawer", () => {
            agDrawer_PO
                .verifyExistenceOfAgDrawer()
                .verifyExistenceOfAgDrawerTitle("Add SMS Template");

            smsTemplate_PO.clickOnCancelButton();

            agDrawer_PO.verifyExistenceOfAgDrawer(false);
        });

        it("Should verify empty validation error message if we save the template without title and text message", () => {
            smsTemplate_PO.clickOnSaveButton();

            cy.checkValidationErrors(emptyValidationErrors);
        });

        it("Should create sms template with placeholder in subject and body and verify it", function () {
            cy.get('input[name="title"]').type(this.smsTitle);

            smsTemplate_PO.selectPlaceholdersAndVerify();
        });

        context("Add sms template dependent test", () => {
            beforeEach(function () {
                smsTemplate_PO.fillFormElement(this.smsTitle, this.smsMessage);
            });

            it("Should verify functionality of 'Cancel' button while adding template", function () {
                smsTemplate_PO
                    .clickOnCancelButton()
                    .verifyFirstSmsTitle("not.contain", this.smsTitle)
                    .verifyFirstSmsMessage("not.contain", this.smsMessage);
            });

            context("Click on 'Save' button dependent test", () => {
                beforeEach(function () {
                    smsTemplate_PO.clickOnSaveButton();

                    cy.wait(2000);
                });

                it("Should verify that the added sms title and message exist in the list", function () {
                    smsTemplate_PO
                        .verifyFirstSmsTitle("contain", this.smsTitle)
                        .verifyFirstSmsMessage("contain", this.smsMessage);
                });

                context("Delete template dependent test", () => {
                    it("Should delete the sms template and verify if it is deleted from the lists", function () {
                        smsTemplate_PO.clickOnDeleteButton();

                        cy.wait(2000);

                        smsTemplate_PO
                            .verifyFirstSmsTitle("not.contain", this.smsTitle)
                            .verifyFirstSmsMessage(
                                "not.contain",
                                this.smsMessage
                            );
                    });

                    it("Should verify that the total record count is decreased by 1 after deletion", () => {
                        cy.get(".ag-pagination__info > strong")
                            .last()
                            .then((paginationSelector) => {
                                const oldCount = parseInt(
                                    paginationSelector.text().trim()
                                );

                                smsTemplate_PO.clickOnDeleteButton();

                                cy.wait(2000);

                                cy.get(".ag-pagination__info > strong")
                                    .last()
                                    .then((paginationSelectors) => {
                                        const newCount = parseInt(
                                            paginationSelectors.text().trim()
                                        );

                                        expect(newCount).eq(oldCount - 1);
                                    });
                            });
                    });
                });

                context("Click on 'Edit' button dependent test", () => {
                    const updatedSmsTitle = faker.lorem.words();
                    const updatedSmsMessage = faker.lorem.sentence();

                    beforeEach(() => {
                        smsTemplate_PO.clickOnEditButton();
                    });

                    it("Should verify the persistence of data in the modal when we edit the sms template", function () {
                        cy.get('div[name="title"] > input[name="title"]')
                            .invoke("val")
                            .then((textValue) => {
                                expect(textValue).eq(this.smsTitle);
                            });

                        cy.get(".ql-editor > p").then((editMessageSelector) => {
                            expect(editMessageSelector.text()).eq(
                                this.smsMessage
                            );
                        });
                    });

                    it("Should verify that the edited sms title and message is in the list", function () {
                        smsTemplate_PO
                            .fillFormElement(updatedSmsTitle, updatedSmsMessage)
                            .clickOnSaveButton();

                        cy.wait(2000);

                        smsTemplate_PO
                            .verifyFirstSmsTitle("contain", updatedSmsTitle)
                            .verifyFirstSmsMessage(
                                "contain",
                                updatedSmsMessage
                            );
                    });

                    it("Should validate empty title and message in edit sms template drawer", () => {
                        smsTemplate_PO.clearTextField().clickOnSaveButton();

                        cy.checkValidationErrors(emptyValidationErrors);
                    });

                    it("Should verify functionality of 'Cancel button while editing template", function () {
                        smsTemplate_PO
                            .fillFormElement(updatedSmsTitle, updatedSmsMessage)
                            .clickOnCancelButton()
                            .verifyFirstSmsTitle("not.contain", updatedSmsTitle)
                            .verifyFirstSmsMessage(
                                "not.contain",
                                updatedSmsMessage
                            );
                    });
                });
            });
        });
    });
});
