/// <reference types= "cypress" />

import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import ApiAndIntegration_PO from "../../../../support/pageObjects/settings_PO/api&Integrations_PO/ConnectedPartner_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";

describe("Connected partners tab", function () {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const apiAndIntegration_PO = new ApiAndIntegration_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnApiIntegrations();
    });

    context("Add connected partners dependent tests", () => {
        beforeEach(function () {
            apiAndIntegration_PO.clickOnConnectedPartner();
            cy.wait(2000);
        });

        it("Should check the empty validations in connect partner drawer", function () {
            apiAndIntegration_PO
                .clickOnConnectNewPartnerButton()
                .clickOnSaveButton()
                .checkForValidationErrorMessage();
        });

        it("Should go to client module when clicked on Go to Clients after the new connection is added successfully", function () {
            apiAndIntegration_PO
                .clickOnConnectNewPartnerButton()
                .selectRandomStudylinkPartner()
                .selectRandomAgentcisPartner()
                .clickOnSaveButton()
                .clickOnGoToClientsButton();
        });

        it("Should search for added studylink partner from the list", function () {
            apiAndIntegration_PO
                .clickOnConnectNewPartnerButton()
                .selectRandomStudylinkPartner()
                .selectRandomAgentcisPartner();

            cy.get(
                "div[name='field.0.studylink_partner'] > div[role='combobox'] > div > .ag-flex > .truncate > div"
            )
                .invoke("text")
                .then((studyLinkPartner) => {
                    apiAndIntegration_PO
                        .clickOnSaveButton()
                        .clickOnCancelButton()
                        .typeInSearchBox(studyLinkPartner)
                        .clearTextInSearchBar();
                });
        });

        context(
            "Add new connection, manage status, and delete the connected partners",
            function () {
                beforeEach(function () {
                    apiAndIntegration_PO
                        .clickOnConnectNewPartnerButton()
                        .selectRandomStudylinkPartner()
                        .selectRandomAgentcisPartner()
                        .clickOnSaveButton()
                        .clickOnCancelButton();
                });

                context("Test for activity button", () => {
                    beforeEach(function () {
                        apiAndIntegration_PO.clickOnActivityButton();
                    });

                    it("Should delete the added connected partners", function () {
                        apiAndIntegration_PO
                            .clickOnDeleteOptionFromActivityButton()
                            .clickOnDeleteButtonInsidePopup();
                    });

                    it("Should change the status of connected partners", function () {
                        apiAndIntegration_PO
                            .clickOnDisbaleOptionFromActivityButton()
                            .clickOnDisableButtonInsidePopup();
                    });
                });
            }
        );
    });
});
