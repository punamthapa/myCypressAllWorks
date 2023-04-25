/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import LeadForms_PO from "../../../../support/pageObjects/settings_PO/leadForms_PO/LeadForms_PO";

describe("Test specs for lead forms", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const leadForm_PO = new LeadForms_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnLeadForm();

        cy.wait(3000);
    });

    context("Click on 'Add Lead Form' button dependent button", () => {
        beforeEach(() => {
            leadForm_PO.clickOnAddLeadFormButton();
        });

        it("Should show validation message error while submitting form without filling mandatory field", function () {
            const emptyValidationErrors = [
                " The Name field is required.",
                "The Office Id field is required.",
            ];

            leadForm_PO.clickOnLeadFormSaveButton();

            cy.checkValidationErrors(emptyValidationErrors);
        });

        context("Add lead form name dependent test", function () {
            beforeEach(function () {
                const leadFormName = faker.lorem.words();

                cy.wrap(leadFormName).as("leadFormName");

                leadForm_PO.fillLeadFormName(leadFormName);
            });

            it("Should verify the functionality of cancel button", function () {
                leadForm_PO
                    .clickOnCancelButton()
                    .verifyUrlOfLeadForm()
                    .verifyExistenceOfLeadFormName(
                        "not.contain",
                        this.leadFormName
                    );
            });

            context(
                "Select related office and click save dependent test",
                () => {
                    beforeEach(() => {
                        leadForm_PO
                            .selectRelatedOfficeName()
                            .clickOnLeadFormSaveButton();

                        cy.wait(2000);
                    });

                    it("Should verify the existence of lead form", function () {
                        leadForm_PO
                            .verifyUrlOfLeadForm()
                            .verifyExistenceOfLeadFormName(
                                "contain",
                                this.leadFormName
                            )
                            .verifyStatusOfFirstForm("Active");
                    });

                    it("Should toggle active and inactive state of lead form", function () {
                        leadForm_PO
                            .clickActionButtonOption("Make Inactive")
                            .verifyStatusOfFirstForm("Inactive")
                            .clickActionButtonOption("Make Active")
                            .verifyStatusOfFirstForm("Active");
                    });

                    it("Should verify that the total record count increases by 1 after adding lead form", function () {
                        const updatedLeadFormName = faker.lorem.words();

                        cy.wait(2000);

                        cy.get(".pull-right span > b:nth-of-type(2)")
                            .last()
                            .then((paginationSelector) => {
                                const oldCount = parseInt(
                                    paginationSelector.text().trim()
                                );

                                cy.wait(2000);

                                leadForm_PO
                                    .clickOnAddLeadFormButton()
                                    .fillLeadFormName(updatedLeadFormName)
                                    .selectRelatedOfficeName()
                                    .clickOnLeadFormSaveButton()
                                    .verifyExistenceOfLeadFormName(
                                        "contain",
                                        updatedLeadFormName
                                    )
                                    .verifyStatusOfFirstForm("Active");

                                cy.wait(2000);

                                cy.get(".pull-right span > b:nth-of-type(2)")
                                    .last()
                                    .then((paginationSelectors) => {
                                        const newCount = parseInt(
                                            paginationSelectors.text().trim()
                                        );
                                        expect(newCount).eq(oldCount + 1);
                                    });
                            });
                    });

                    it("Should verify the uniqueness of lead form name", function () {
                        const uniqueFormNameErrorMessage = [
                            "The name has already been taken.",
                        ];

                        leadForm_PO
                            .clickOnAddLeadFormButton()
                            .fillLeadFormName(this.leadFormName)
                            .selectRelatedOfficeName()
                            .clickOnLeadFormSaveButton();

                        cy.checkValidationErrors(uniqueFormNameErrorMessage);
                    });

                    it("Should display star badge when lead form is set as favorite and listed in favorite enquiry form", function () {
                        leadForm_PO
                            .clickOnFavoriteEnquiryFormFromTopNavBar()
                            .verifyBadgeAndNameInFavoriteEnquiry(
                                this.leadFormName
                            );
                    });

                    it("Should verify that when lead form is submitted enquiry has same office of lead form", () => {
                        const firstName = faker.name.firstName();
                        const lastName = faker.name.lastName();

                        leadForm_PO
                            .clickOnLeadFormUrl()
                            .fillLeadFormElements(firstName, lastName)
                            .clickOnSubmitFormButton();

                        cy.wait(3000);

                        cy.go("back");

                        cy.get("tr:nth-of-type(1) > td:nth-of-type(4)")
                            .invoke("text")
                            .then((office) => {
                                const leadFormOffice = office.trim();

                                homePage_PO.clickOnEnquiries();

                                cy.wait(5000);

                                cy.get("th").then((office) => {
                                    if (
                                        office.text().includes("Pref. Office")
                                    ) {
                                        leadForm_PO.verifyOfficeInEnquiryList(
                                            leadFormOffice
                                        );
                                    } else {
                                        cy.get(".js-dropdown-action-nothing")
                                            .as("displayButton")
                                            .click({
                                                force: true,
                                            });

                                        cy.get(
                                            "div:nth-of-type(1) > .checkbox.ui.zippy-checkbox > label"
                                        ).click();

                                        cy.get("@displayButton").click();

                                        leadForm_PO.verifyOfficeInEnquiryList(
                                            leadFormOffice
                                        );
                                    }
                                });
                            });
                    });

                    it("Should verify the existence of default system fields in lead form ", () => {
                        leadForm_PO
                            .clickOnLeadFormUrl()
                            .verifyExistenceOfSystemFields();

                        cy.go("back");
                    });

                    it("Should verify the functionality of preview option", () => {
                        cy.get(`tr:nth-of-type(${1}) > td:nth-of-type(${3})>a`)
                            .invoke("attr", "href")
                            .then((href) => {
                                leadForm_PO.clickActionButtonOption("Preview");

                                cy.url().should("contain", href);

                                cy.go("back");
                            });
                    });

                    context("Make lead form inactive dependent test", () => {
                        beforeEach(() => {
                            leadForm_PO
                                .clickActionButtonOption("Make Inactive")
                                .verifyStatusOfFirstForm("Inactive");
                        });

                        it("Should delete lead form and verify it's existence in list", function () {
                            leadForm_PO
                                .clickActionButtonOption("Delete")
                                .verifyExistenceOfLeadFormName(
                                    "not.contain",
                                    this.leadFormName
                                );
                        });

                        it("Should verify that the total record count decrease by 1 after deleting lead form", function () {
                            // cy.wait(2000);

                            cy.get(".pull-right span > b:nth-of-type(2)")
                                .last()
                                .then((paginationSelector) => {
                                    const oldCount = parseInt(
                                        paginationSelector.text().trim()
                                    );

                                    cy.wait(2000);

                                    leadForm_PO.clickActionButtonOption(
                                        "Delete"
                                    );

                                    cy.wait(2000);

                                    cy.get(
                                        ".pull-right span > b:nth-of-type(2)"
                                    )
                                        .last()
                                        .then((paginationSelectors) => {
                                            const newCount = parseInt(
                                                paginationSelectors
                                                    .text()
                                                    .trim()
                                            );
                                            expect(newCount).eq(oldCount - 1);
                                        });
                                });
                        });

                        it("Should verify that url should show 404 error for inactive lead form ", () => {
                            leadForm_PO
                                .clickOnLeadFormUrl()
                                .verifyErrorMessageForInactiveLeadFormUrl();
                        });
                    });
                }
            );
        });
    });
});
