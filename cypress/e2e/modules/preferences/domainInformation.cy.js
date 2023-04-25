/// <reference types= "cypress" />

import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import SettingsDomainInformation_PO from "../../../support/pageObjects/settings_PO/SettingsDomainInformation_PO";
import SettingsPreferences_PO from "../../../support/pageObjects/settings_PO/SettingsPreferences_PO";
import { config } from "../../../../config/index";

describe("Domain Information", function () {
    const homePage_PO = new HomePage_PO();
    const settingsPreferences_PO = new SettingsPreferences_PO();
    const settingsDomainInformation_PO = new SettingsDomainInformation_PO();

    before(() => {
        cy.login();
    });
    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        settingsPreferences_PO.clickOnPreferencesMenu();
        settingsDomainInformation_PO.clickOnDomainInformationMenu();
    });

    it("Verifying the domain name and checking to see if name and email are not empty", function () {
        const emailChildIndex = 2;
        const appUrl = config.app.base_url.substring(8, 28);
        cy.get(".ag-p-b-30 > .fontNormal.text-primary").should(
            "contain",
            appUrl
        );

        cy.get("[class='col-hr-4']").should("not.be.empty");

        cy.get(`.ag-p-t-30 > .col-v-1 > :nth-child(${emailChildIndex}`).should(
            "not.be.empty"
        );
    });
});
