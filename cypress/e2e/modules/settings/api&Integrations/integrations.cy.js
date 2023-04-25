/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Integrations_PO from "../../../../support/pageObjects/settings_PO/api&Integrations_PO/Integrations_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import AgDrawer_PO from "../../../../support/pageObjects/utilities/AgDrawer_PO";

const homePage_PO = new HomePage_PO();
const agDrawer_PO = new AgDrawer_PO();
const setting_PO = new Setting_PO();
const integrations_PO = new Integrations_PO();

describe("Test for 'Api and Integration' in settings", function () {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnApiIntegrations();
    });

    context("Click integration 'Add' button dependent test", () => {
        beforeEach(() => {
            integrations_PO.clickOnAddIntegrationButton();
            agDrawer_PO
                .verifyExistenceOfAgDrawer()
                .verifyExistenceOfAgDrawerTitle("Add Study Link Integrations");
        });

        it("Should verify empty validation in add studylink integrations", function () {
            integrations_PO
                .clickOnCheckBox()
                .clickOnSaveIntegrations()
                .verifyEmptyValidations();
        });

        it("Should verify api data and branch dropdown list in integrations", function () {
            integrations_PO
                .getBranchesNameFromApi()
                .selectDropdownValue()
                .verifyBranchnameWithApiFetchedBranchNames();
        });

        it("Should verify api key in studylink drawer", function () {
            const randomApiKey = faker.random.words(2);

            integrations_PO.verifyStudylinkApikey(randomApiKey);
        });

        context("Integration add button and delete dependent test", () => {
            beforeEach(() => {
                integrations_PO
                    .selectBranchValue()
                    .verifyStudylinkApikey
                    // api key
                    ()
                    .clickOnCheckBox()
                    .clickOnSaveIntegrations();

                cy.wait(2000);
            });

            afterEach(() => {
                integrations_PO
                    .clickOnMenuToDelete()
                    .verifyExistenceOfAddButtonAfterDeletion();
            });

            it("Should navigate to connect partners tab", function () {
                integrations_PO.clickOnConnectPartnerButton();
                agDrawer_PO.verifyExistenceOfAgDrawer();
                integrations_PO.clickOnCloseModal().clickOnIntegrationsTab();
            });

            it("Should add new users verify when adding existing users and delete users", function () {
                integrations_PO
                    .clickOnCancelButton()
                    .verifyConnectedText()
                    .clickOnManageUsers()
                    .selectfirstUser();
                cy.wait(2000);
                integrations_PO
                    .clickOnManageUsers()
                    .selectfirstUser()
                    .errorMessageForExistingUser()
                    .deleteExistingUser();
            });
        });
    });
});
