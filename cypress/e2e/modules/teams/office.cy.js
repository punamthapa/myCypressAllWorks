/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Offices_PO from "../../../support/pageObjects/teams_PO/Offices_PO";
import SideNavBar_PO from "../../../support/pageObjects/utilities/SideNavBar_PO";

describe("Test for Teams -> Office Module ", function () {
    const office_PO = new Offices_PO();
    const sideNavBar_PO = new SideNavBar_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        sideNavBar_PO.clickOnTeamsModule().clickOnOfficeSubModule();
    });

    context("Click on Add button dependent test", function () {
        beforeEach(() => {
            cy.clickOnAddButton();
        });

        it("Should check empty validation error message while submitting without mandatory fields", function () {
            office_PO.clickOnSaveButton().checkEmptyValidationErrors();
        });

        context("Add office dependent test", function () {
            beforeEach(() => {
                const companyName = faker.company.companyName();
                const officeEmail = faker.internet.email();

                cy.wrap(companyName).as("officeName");

                office_PO
                    .typeOfficeName(companyName)
                    .selectCountry()
                    .typeEmailAddress(officeEmail)
                    .clickOnSaveButton();

                cy.waitingForComponentToMount();

                office_PO.clickOnOfficeListButton();

                cy.wait(2000);
            });

            it("Should assert the newly added office", function () {
                office_PO.verifyOfficeName(this.officeName);
            });

            it("Should search for the office and verify in the list ", function () {
                office_PO.typeOnSearchBar(this.officeName);

                cy.wait(2000);

                office_PO.clickOnSearchIcon();

                cy.waitingForComponentToMount();

                office_PO.searchWithinTable(this.officeName);
            });

            it("Should archive the office and verify its existence in list", function () {
                office_PO
                    .verifyOfficeName(this.officeName)
                    .clickOnArchiveButton();

                cy.waitingForComponentToMount();

                office_PO.verifyOfficeName(this.officeName, "not.contain");
            });
        });
    });
});
