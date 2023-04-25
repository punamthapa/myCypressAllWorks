/// <reference types= "cypress" />

import { getRandomString } from "../../../../../utilities/helpers/general";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import GeneralTabs_PO from "../../../../support/settingsTabPO/GeneralTabs_PO";

const discontinueReason = "Covid variant " + getRandomString();

describe("Test in discontinued reasons of General", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const discontinueReason_PO = new GeneralTabs_PO();
    const checkBoxListItemIndex = 2;

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnGeneralMenu();

        discontinueReason_PO.clickOnDiscontinuedReasonsTab();

        cy.wait(3000);
    });

    it("Should verify that page's title contains 'Discontinue Reasons'", () => {
        cy.get(
            ".ag-flex.ag-flex-column.discontinued-reasons-container > .marginNone"
        ).should("have.text", "Discontinue Reasons");
    });

    it("Should add new discontinue reason and verify if it is added in table", () => {
        let discontinueReasonCount = 0;

        cy.get(".transparent-button.text-semi-bold").click();

        cy.get("table>tbody>tr>td")
            .last()
            .click()
            .type(discontinueReason + "{enter}");

        cy.get(`tbody>tr>td:nth-of-type(${checkBoxListItemIndex})>input`)
            .each(($el) => {
                cy.wrap($el)
                    .invoke("val")
                    .then((value) => {
                        if (value === discontinueReason) {
                            discontinueReasonCount = discontinueReasonCount + 1;
                        }
                    });
            })
            .then(() => expect(discontinueReasonCount).to.eq(1));
    });

    it("Should delete the recently added discontinue reason and verify if it exists in table", () => {
        cy.get(`tbody>tr>td:nth-of-type(${checkBoxListItemIndex})`).each(
            ($el) => {
                cy.wrap($el)
                    .find("input")
                    .invoke("val")
                    .then((value) => {
                        if (value === discontinueReason) {
                            cy.wrap($el).find(".transparent-button").click();
                        }
                    });
            }
        );

        cy.get(".accept.blueButton.button.redButton").click().wait(3000);

        cy.get(`tbody>tr>td:nth-of-type(${checkBoxListItemIndex})>input`).each(
            ($el) => {
                cy.wrap($el)
                    .invoke("val")
                    .then((value) => {
                        expect(value).not.to.contain(discontinueReason);
                    });
            }
        );
    });
});
