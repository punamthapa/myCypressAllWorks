/// <reference types= "cypress" />

import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import SettingsPreferences_PO from "../../../support/pageObjects/settings_PO/SettingsPreferences_PO";
import { COUNTRIES } from "../../../../constants/countries";

describe("Preferences Organization Settings Company Profile Module", function () {
    const homePage_PO = new HomePage_PO();
    const settingsPreferences_PO = new SettingsPreferences_PO();

    let selectedCountryInComboBox;

    before(() => {
        cy.login();
    });
    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        settingsPreferences_PO.clickOnPreferencesMenu();
    });

    it("Should verify error message after saving without mandatory field", function () {
        const validationErrors = [
            "Company name is required.",
            "Company phone is required.",
            "Company email is required.",
            "The Country field is required.",
        ];
        const validationErrorsSelectors = [
            "[name='name'] > .ui",
            "[name='company_phone'] > .ui",
            "[name='company_email'] > .ui",
            "[name='country'] > .ui",
        ];

        cy.get(
            ".form.formWidth.novalidate.ui > .ag-flex.ag-space-between.padded"
        )
            .find("input[type=text]")
            .clear();
        cy.get("div[name='country'] > div[role='combobox']").then((element) => {
            selectedCountryInComboBox = element.text().trim();
            cy.wrap(element)
                .click({ force: true })
                .get("ul[role='listbox'] > li")
                .contains(selectedCountryInComboBox)
                .click({ force: true });

            cy.get(".column > .button").click({
                force: true,
            });
        });
        cy.get(".column > .button").click({ force: true });

        validationErrorsSelectors.forEach((validationErrorsSelector, index) => {
            cy.get(validationErrorsSelector).should(
                "contain.text",
                validationErrors[index]
            );
        });
    });

    it("Should verify fields value after adding mandatory field", function () {
        const companyName = "Introcept";
        const companyEmail = "agents@introcept.co";
        const companyPhone = "9840316549";
        const countries = Object.values(COUNTRIES);
        const selectCountryFormat =
            countries[Math.floor(Math.random() * countries.length)];
        const textBoxValue = [
            companyName,
            companyPhone,
            "",
            "",
            "",
            companyEmail,
            "",
            "",
            "",
            COUNTRIES.NEPAL,
        ];

        cy.get("[name='companyName']")
            .clear()
            .type(companyName)
            .should("have.value", companyName);
        cy.get("[name='companyEmail']")
            .clear()
            .type(companyEmail)
            .should("have.value", companyEmail);
        cy.get("[name='companyPhone']")
            .clear()
            .type(companyPhone)
            .should("have.value", companyPhone);
        cy.get("div[name='country'] > div[role='combobox']")
            .as("comboBox")
            .then((element) => {
                selectedCountryInComboBox = element.text().trim();
                if (selectedCountryInComboBox === "Search here") {
                    cy.get("@comboBox")
                        .click({ force: true })
                        .then((countryFormat) => {
                            cy.wrap(countryFormat)
                                .get("ul[role='listbox'] > li")
                                .then((countryFormatList) => {
                                    cy.wrap(countryFormatList)
                                        .contains(selectCountryFormat)
                                        .click();
                                });
                        });
                    cy.get(".column > .button").click({ force: true });
                    cy.get("@comboBox")
                        .find(
                            ".ag-flex.ag-space-between  .ag-select-label.truncate > div"
                        )
                        .should("not.contain", "Search here")
                        .and("contain", selectCountryFormat);
                } else {
                    cy.get("@comboBox")
                        .find(
                            ".ag-flex.ag-space-between  .ag-select-label.truncate > div"
                        )
                        .should("not.contain", "Search here")
                        .and("contain", selectedCountryInComboBox);
                }
            });
        cy.get(".column > .button").click({ force: true });
        cy.get(".js-input-error").should("not.exist");

        // todo how about attach invalidFile()
        cy.wait(3000);

        cy.get(
            ".form.formWidth.novalidate.ui > .ag-flex.ag-space-between.padded"
        )
            .find("input[type=text]")
            .each(($el, index) => {
                expect($el).to.contain.value(textBoxValue[index]);
            });
        cy.get("input[type='file']").attachFile("images/camera.png");

        cy.wait(3000);

        cy.get(".col-v-4.text-center>button.button.blueButton").click({
            force: true,
        });
        cy.get("label > .button").click({ force: true });
        cy.get(".column > .button").click({ force: true });
    });

    it("Should check the visibility of the remove button", () => {
        cy.get(".ag-company-image").then((logo) => {
            if (logo.find("#companyLogo").length > 0) {
                cy.get(".col-v-1 > .text-muted").should("exist");
            } else {
                cy.get(".col-v-1 > .text-muted").should("not.exist");
            }
        });
    });

    it("Should remove added logo after clicking on remove button if logo exist in the dom", () => {
        cy.get(".ag-company-image").then((logo) => {
            if (logo.find("#companyLogo").length > 0) {
                cy.get(".col-v-1 > .text-muted").should("exist");
                cy.get(".col-v-1 > .text-muted").click();
                cy.get(".col-v-2.column > .submitButton")
                    .click()
                    .then(() => {
                        cy.get(".ag-company-image").should("exist");
                    });
            }
        });
    });

    it("Should validate error after uploading a file more than 2mb size", () => {
        cy.get(".blueButton.button.text-center").click();
        cy.get("input[type='file']").attachFile("images/image.jpg");
        cy.get(".errorInput").should(
            "include.text",
            "File size of logo is too large. Allowed file size is less than 2MB."
        );
    });

    it("Should validate error after uploading a file of type png/jpg/jpeg", () => {
        cy.get(".blueButton.button.text-center").click();
        cy.get("input[type='file']").attachFile("images/testfile.docx");
        cy.get(".errorInput").should(
            "include.text",
            "Supported document types: png,jpg,jpeg"
        );
    });
});
