/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Appointment_PO from "../../../support/pageObjects/Appointment_PO";
import Enquiries_PO from "../../../support/pageObjects/enquiries_PO/Enquiries_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import LeadForms_PO from "../../../support/pageObjects/settings_PO/leadForms_PO/LeadForms_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";
import Faker_PO from "../../../support/faker/Faker_PO";

describe("Test for document tab in enquiry module", () => {
    const homePage_PO = new HomePage_PO();
    const enquiries_PO = new Enquiries_PO();
    const settings_PO = new Setting_PO();
    const leadForms_PO = new LeadForms_PO();
    const appointment_PO = new Appointment_PO();
    const faker_PO = new Faker_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        cy.wait(5000);
    });

    context(
        "Create lead form and add appointments button dependent test",
        () => {
            beforeEach(() => {
                const leadFormName = faker_PO.words();
                const firstName = faker_PO.firstName();
                const lastName = faker_PO.lastName();
                const email = faker_PO.email();

                homePage_PO.clickOnSettingMenu();

                settings_PO.clickOnLeadForm();

                leadForms_PO
                    .clickOnAddLeadFormButton()
                    .fillLeadFormName(leadFormName)
                    .selectRelatedOfficeName()
                    .clickOnLeadFormSaveButton()
                    .clickOnLeadFormUrl()
                    .fillLeadFormElements(firstName, lastName);

                leadForms_PO.clickOnSubmitFormButton();

                cy.wait(2000);

                cy.go("back");

                cy.waitingForComponentToMount();

                homePage_PO.clickOnEnquiries();

                cy.wait(2000);

                enquiries_PO.clickOnFirstActivityButton().clickOnEditButton();

                appointment_PO.addEmail(email);

                enquiries_PO.clickOnSaveButton().clickOnFirstEnquiry();

                cy.wait(3000);

                appointment_PO.clickOnAppointmentTab().clickOnAddButton();
            });

            it("Should verify lead name and drawer title inside appointment drawer ", () => {
                cy.get(" .ag-client__title")
                    .invoke("text")
                    .then((lead) => {
                        cy.get("div[name='appointable'] > input[type='text']")
                            .invoke("val")
                            .then((nameInDrawer) => {
                                expect(nameInDrawer).eq(lead);
                            });
                    });

                appointment_PO
                    .verifyExistenceOfDrawerTitle("Add Appointment")
                    .clickOnCancelButton();
            });

            context("Add appointments details dependent test", () => {
                beforeEach(() => {
                    const title = faker_PO.words();
                    const description = faker_PO.words();

                    cy.wrap(title).as("title");
                    cy.wrap(description).as("description");

                    cy.wait(3000);

                    appointment_PO
                        .selectTimeZone()
                        .enterTitle(title)
                        .enterDescription(description)
                        .clickOnSaveBtn()
                        .verifyTitle(title)
                        .verifyDescription(description);
                });

                it("Should edit appointments and verify it", function () {
                    const updatedTitle = faker.random.words();
                    const updatedDescription = faker.random.words();

                    appointment_PO
                        .clickOnEditIcon()
                        .enterTitle(updatedTitle)
                        .enterDescription(updatedDescription)
                        .clickOnUpdateBtn();

                    cy.wait(3000);

                    appointment_PO
                        .verifyTitle(updatedTitle)
                        .verifyDescription(updatedDescription);
                });
            });
        }
    );
});
