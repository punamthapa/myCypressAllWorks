/// <reference types= "cypress" />

import faker from "@faker-js/faker";
// import Notes_PO from "../../../support/pageObjects/Notes_PO";
import Enquiries_PO from "../../../support/pageObjects/enquiries_PO/Enquiries_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import LeadForms_PO from "../../../support/pageObjects/settings_PO/leadForms_PO/LeadForms_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";

describe("Test in enquiry module", () => {
    const homePage_PO = new HomePage_PO();
    const enquiries_PO = new Enquiries_PO();
    const settings_PO = new Setting_PO();
    const leadforms_PO = new LeadForms_PO();
    // const notes_PO = new Notes_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        cy.wait(5000);
    });

    it("Should verify the existence of tab title and pagination in equiry module", () => {
        homePage_PO.clickOnEnquiries();

        cy.verifyPaginator();

        enquiries_PO.verifyTabTitles();
    });

    context("Create lead form dependent test", () => {
        beforeEach(() => {
            const leadFormName = faker.random.words();
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            cy.wrap(leadFormName).as("leadFormName");
            cy.wrap(firstName).as("firstName");
            cy.wrap(lastName).as("lastName");

            homePage_PO.clickOnSettingMenu();

            settings_PO.clickOnLeadForm();

            leadforms_PO
                .clickOnAddLeadFormButton()
                .fillLeadFormName(leadFormName)
                .selectRelatedOfficeName()
                .clickOnLeadFormSaveButton()
                .clickOnLeadFormUrl()
                .fillLeadFormElements(firstName, lastName);

            cy.wait(2000);

            leadforms_PO.clickOnSubmitFormButton();

            cy.wait(2000);

            cy.go("back");

            cy.waitingForComponentToMount();

            homePage_PO.clickOnEnquiries();

            cy.wait(2000);
        });

        it("Should display fullname in the enquiry lists ", function () {
            cy.get(" .ag-flex > a.truncate")
                .first()
                .then(($fullName) => {
                    expect($fullName.text().trim()).eq(
                        `${this.firstName} ${this.lastName}`
                    );
                });
        });

        context("Click on first activity button dependent test", () => {
            beforeEach(() => {
                cy.wait(2000);

                enquiries_PO.clickOnFirstActivityButton();
            });

            it("Should archive the first enquiry and verify its existence in lists", function () {
                enquiries_PO.clickOnArchiveButton().clickOnAcceptButton();

                cy.wait(5000);

                enquiries_PO.verifyInputDataInLists(
                    "not.contain",
                    this.firstName,
                    this.lastName
                );

                cy.wait(3000);

                enquiries_PO.clickOnArchiveTab();

                cy.wait(3000);

                enquiries_PO.verifyInputDataInLists(
                    "contain",
                    this.firstName,
                    this.lastName
                );
            });

            it("Should edit the first enquiry and verify its existence", () => {
                const updatedFirstName = faker.name.firstName();
                const updatedLastName = faker.name.lastName();

                enquiries_PO
                    .clickOnEditButton()
                    .editFormDetails(updatedFirstName, updatedLastName)
                    .clickOnSaveButton()
                    .verifyInputDataInLists(
                        "contain",
                        updatedFirstName,
                        updatedLastName
                    );
            });

            it("Should verify that leadform enetered data and  fullname in listing page of first enquiry is same as the form input fields of enquiry", function () {
                enquiries_PO.clickOnEditButton();

                cy.wait(8000);

                cy.get("div[name='first_name'] input#first_name")
                    .invoke("val")
                    .then((inputFirstName) => {
                        expect(inputFirstName).eq(this.firstName);

                        cy.get("div[name='last_name'] input#last_name")
                            .invoke("val")
                            .then((inputLastName) => {
                                expect(inputLastName).eq(this.lastName);

                                const fullName = `${inputFirstName} ${inputLastName}`;

                                cy.go("back");

                                cy.get(" .ag-flex > a.truncate")
                                    .first()
                                    .then((title) => {
                                        expect(title.text().trim()).eq(
                                            fullName
                                        );
                                    });
                            });
                    });
            });

            it("Should approve enquiry and verify its existence in prospects tab", function () {
                cy.wait(3000);

                enquiries_PO
                    .clickOnFirstActivityButton()
                    .clickOnApproveButton()
                    .selectRandomAssignee()
                    .clickOnApproveEnquiryButton();

                homePage_PO.clickOnClientsModule();

                enquiries_PO
                    .clickOnProspectsTab()
                    .verifyInputDataInLists(
                        "contain",
                        this.firstName,
                        this.lastName
                    );
            });
        });
    });
});
