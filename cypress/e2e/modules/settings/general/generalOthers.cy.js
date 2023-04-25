/// <reference types= "cypress" />

import { getRandomString } from "../../../../../utilities/helpers/general";
import { SYSTEM_DATE_FORMATS } from "../../../../../constants/systemDateFormats";
import HomePage_PO from "../../../../support/pageObjects/HomePage_PO";
import Setting_PO from "../../../../support/pageObjects/Setting_PO";
import GeneralTabs_PO from "../../../../support/settingsTabPO/GeneralTabs_PO";

const surveyOption = "Television_" + getRandomString();
const surveyOptionItemIndex = 2;

/*@todo
- The window reloads when we click save, therefore the code below runs if we run individual tests.
- Delete test case runs only if it is runned with third test case i.e. add how do you hear from us
*/

describe("Test in discontinued reasons of General", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const others_PO = new GeneralTabs_PO();

    let selectedDateInComboBox;

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnGeneralMenu();
        others_PO.clickOnOthersTab();

        cy.wait(3000);
    });

    it("Should select system date format if date format is not selected, save it and verify it", () => {
        const systemDateFormats = Object.values(SYSTEM_DATE_FORMATS);
        const selectRandomDateFormat =
            systemDateFormats[
                Math.floor(Math.random() * systemDateFormats.length)
            ];

        cy.get("div[name='dateFormats'] > div[role='combobox']")
            .as("comboBox")
            .then((element) => {
                selectedDateInComboBox = element.text().trim();

                if (selectedDateInComboBox === "Select a format") {
                    cy.get("@comboBox")
                        .click({
                            force: true,
                        })
                        .then((dateFormat) => {
                            cy.wrap(dateFormat)
                                .get("ul[role='listbox'] > li")
                                .then((dateFormatList) => {
                                    cy.wrap(dateFormatList)
                                        .contains(selectRandomDateFormat)
                                        .click();
                                });
                        });

                    cy.get(
                        ".ag-align-end.ag-flex.col-v-4 > .blueButton.button"
                    ).click({
                        force: true,
                    });

                    cy.get("@comboBox")
                        .find(
                            ".ag-flex.ag-space-between  .ag-select-label.truncate > div"
                        )
                        .should("not.contain", "Select a format")
                        .and("contain", selectRandomDateFormat);
                } else {
                    cy.get("@comboBox")
                        .find(
                            ".ag-flex.ag-space-between  .ag-select-label.truncate > div"
                        )
                        .should("not.contain", "Select a format")
                        .and("contain", selectedDateInComboBox);
                }
            });
    });

    it("Should show validation error when saving without system date format", () => {
        cy.get("div[name='dateFormats'] > div[role='combobox']").then(
            (element) => {
                selectedDateInComboBox = element.text().trim();

                cy.wrap(element)
                    .click({ force: true })
                    .get("ul[role='listbox'] > li")
                    .contains(selectedDateInComboBox)
                    .click({ force: true });

                cy.get(
                    ".ag-align-end.ag-flex.col-v-4 > .blueButton.button"
                ).click({
                    force: true,
                });

                cy.get(
                    "div[name='dateFormats'] >.ui.zippyLabel.red.pointing.prompt.basic.label.transition.js-input-error"
                ).should(
                    "contain",
                    "The Selected Date Format field is required."
                );
            }
        );
    });

    it("Should add how do you hear from us and verify its existence in table", () => {
        let surveyOptionCount = 0;
        let countSurveyOption = 0;

        cy.get(`tbody>tr>td:nth-of-type(${surveyOptionItemIndex})>div>input`)
            .as("sourcesSelectors")
            .then((surveyOption) => {
                countSurveyOption = surveyOption.length;
            });

        cy.get(".col-v-1 > .text-primary.transparent-button").click();

        cy.get("table>tbody>tr>td").last().click().type(surveyOption);

        cy.get(".ag-align-end.ag-flex.col-v-4 > .blueButton.button").click();

        cy.get(`tbody>tr>td:nth-of-type(${surveyOptionItemIndex})>div>input`)
            .each((inputText) => {
                cy.wrap(inputText)
                    .invoke("val")
                    .then((value) => {
                        if (value === surveyOption) {
                            surveyOptionCount = surveyOptionCount + 1;
                        }
                    });
            })
            .should((tr) => {
                const totalSurveyOptionItemCount = countSurveyOption + 1;
                expect(tr).to.have.length(totalSurveyOptionItemCount);
            })
            .then(() => expect(surveyOptionCount).to.eq(1));
    });

    it("Should unmark added how did you hear from us and verify if it is unmarked ", () => {
        cy.get(
            "tbody>tr:last-child >.width-10p  input[type='checkbox']"
        ).uncheck();

        cy.get(".ag-align-end.ag-flex.col-v-4 > .blueButton.button").click();

        cy.get(
            "tbody>tr:last-child >.width-10p  input[type='checkbox']"
        ).should("not.be.checked");
    });

    it("Should delete added how do you hear from us and verify its existence in table ", () => {
        cy.get(`tbody>tr>td:nth-of-type(${surveyOptionItemIndex})>div`)
            .as("sourcesSelectors")
            .each((sources) => {
                cy.wrap(sources)
                    .find("input")
                    .invoke("val")
                    .then((value) => {
                        if (value === surveyOption) {
                            cy.wrap(sources)
                                .find(".transparent-button")
                                .click({ force: true });
                        }
                    });
            });

        cy.get(".accept.blueButton.button.redButton")
            .click({ force: true })
            .wait(3000);

        cy.get("@sourcesSelectors").each((sources) => {
            cy.wrap(sources)
                .find("input")
                .invoke("val")
                .then((value) => {
                    expect(value).not.to.contain(surveyOption);
                });
        });
    });
});
