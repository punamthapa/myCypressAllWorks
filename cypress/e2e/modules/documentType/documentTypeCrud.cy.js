/// <reference types= "cypress" />

import { getRandomString } from "../../../../utilities/helpers/general";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import DocumentType_PO from "../../../support/pageObjects/settings_PO/workflows_PO/DocumentType_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";
import AgModal_PO from "../../../support/pageObjects/utilities/AgModal_PO";

const tableChildLocation = "table>tbody>tr>td";
const documentTypeName = "Add_" + getRandomString();
const updatedDocumentTypeName = "Edit_" + getRandomString();
const documentTypeNameGtThan100 = getRandomString(101);

describe("Test in document type of workflow", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const documentType_PO = new DocumentType_PO();
    const agModal_PO = new AgModal_PO();
    const ACTIVE_STATUS_LABEL = "Active";
    const INACTIVATE_STATUS_LABEL = "Inactive";
    const ACTIVATE_STATUS_LABEL = "Activate";
    const DEACTIVATE_STATUS_LABEL = "Deactivate";

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnWorkflowMenu();

        cy.contains("Document Type").parent("ul>li").click();

        cy.wait(3000);
    });

    it("Verify paginator", () => cy.verifyPaginator());

    it("Page should have proper title", () => {
        documentType_PO.verifyPageTitle();
    });

    it("Should try to add a document type, click cancel button to close the modal and verify if it is added in table", () => {
        cy.clickOnAddButton();

        agModal_PO
            .verifyExistenceOfAgModal()
            .verifyExistenceOfAgModalTitle("Add New Document Type");

        documentType_PO.enterDocumentTypeName(documentTypeName);

        cy.get(".ag-justify-end > .defaultButton")
            .as("modalCancelButton")
            .click();

        agModal_PO.verifyExistenceOfAgModal(false);

        cy.get(tableChildLocation)
            .eq(0)
            .should("not.contain", documentTypeName);
    });

    it("Should add document type, verify its existence and default status as ACTIVE in the table", () => {
        cy.clickOnAddButton();

        documentType_PO
            .enterDocumentTypeName(documentTypeName)
            .clickOnSaveButton();

        cy.wait(3000);

        documentType_PO
            .verifyFirstDocumentTypeValue(documentTypeName)
            .verifyFirstStatusValue(ACTIVE_STATUS_LABEL);

        // cy.get(tableChildLocation)
        //   .eq(0)
        //   .should("contain", documentTypeName);
        //
        // cy.get(tableChildLocation)
        //   .eq(3)
        //   .should("contain", "Active");
    });

    it("Should toggle status of document type and verify it", () => {
        cy.get(tableChildLocation)
            .eq(3)
            .invoke("text")
            .then((text) => {
                if (text.trim() === ACTIVE_STATUS_LABEL) {
                    documentType_PO
                        .verifyFirstStatusValue(ACTIVE_STATUS_LABEL)
                        .clickOnThreeDotActionButton()
                        .verifyStatusOnThreeDotActionButton(
                            DEACTIVATE_STATUS_LABEL
                        );

                    cy.get(".ag-menu__item.ag-scroll>a")
                        .last()
                        .click({ force: true })
                        .wait(2000);

                    documentType_PO
                        .verifyFirstStatusValue(INACTIVATE_STATUS_LABEL)
                        .clickOnThreeDotActionButton()
                        .verifyStatusOnThreeDotActionButton(
                            ACTIVATE_STATUS_LABEL
                        );
                } else {
                    documentType_PO
                        .verifyFirstStatusValue(INACTIVATE_STATUS_LABEL)
                        .clickOnThreeDotActionButton()
                        .verifyStatusOnThreeDotActionButton(
                            ACTIVATE_STATUS_LABEL
                        );

                    cy.get(".ag-menu__item.ag-scroll>a")
                        .last()
                        .click({ force: true })
                        .wait(2000);

                    documentType_PO
                        .verifyFirstStatusValue(ACTIVE_STATUS_LABEL)
                        .clickOnThreeDotActionButton()
                        .verifyStatusOnThreeDotActionButton("Deactivate");
                }
            });
    });

    it("Should verify visibility of selected document type name in input box when clicking on rename", () => {
        cy.get(tableChildLocation)
            .eq(0)
            .invoke("text")
            .then((editableDocumentTypeName) => {
                documentType_PO
                    .clickOnThreeDotActionButton()
                    .clickOnRenameButton()
                    .clickOnAcceptButtonInAgModal();

                cy.get(".input-field>.form-control")
                    .invoke("val")
                    .then((populatedDocumentTypeName) => {
                        expect(editableDocumentTypeName.trim()).to.eq(
                            populatedDocumentTypeName
                        );
                    });
            });
    });

    it("Should rename the first document type and verify if it is renamed", () => {
        documentType_PO
            .clickOnThreeDotActionButton()
            .clickOnRenameButton()
            .clickOnAcceptButtonInAgModal()
            .enterDocumentTypeName(updatedDocumentTypeName)
            .clickOnSaveButton();

        cy.wait(3000);

        documentType_PO.verifyFirstDocumentTypeValue(updatedDocumentTypeName);
        //
        // cy.get(tableChildLocation)
        //     .eq(0)
        //     .should("contain", updatedDocumentTypeName);
    });

    it("Should pop the error if we save the blank document type while adding", () => {
        cy.clickOnAddButton();

        documentType_PO
            .clickOnSaveButton()
            .verifyErrorMessage(
                ".js-input-error",
                "The name field is required."
            );
    });

    it("Should pop the error if we save the blank document type while editing", () => {
        documentType_PO
            .clickOnThreeDotActionButton()
            .clickOnRenameButton()
            .clickOnAcceptButtonInAgModal();

        cy.get(".input-field>.form-control").clear();

        documentType_PO
            .clickOnSaveButton()
            .verifyErrorMessage(
                ".js-input-error",
                "The name field is required."
            );
    });

    it("Should pop the error if we try to add the document type name that already exists", () => {
        let existingDocumentType = "";

        cy.clickOnAddButton();

        cy.get(tableChildLocation)
            .eq(0)
            .then(($el) => {
                cy.wrap($el)
                    .invoke("text")
                    .then((text) => {
                        existingDocumentType = text.trim();

                        documentType_PO.enterDocumentTypeName(
                            existingDocumentType
                        );
                    });
            })
            .then(() => {
                documentType_PO.clickOnSaveButton();

                const expectedValidationError = `The type "${existingDocumentType}" has already been added.`;

                documentType_PO.verifyErrorMessage(
                    ".js-input-error",
                    expectedValidationError
                );

                documentType_PO.verifyErrorMessage(
                    ".ag-alert-show .text-semi-bold",
                    "The given data was invalid."
                );
            });
    });

    it("Should pop the error if we try to edit the document type name that already exists", () => {
        let existingDocumentType = "";

        cy.get("table>tbody>tr")
            .eq(1)
            .find("td")
            .eq(0)
            .invoke("text")
            .then((text) => {
                existingDocumentType = text.trim();

                documentType_PO
                    .clickOnThreeDotActionButton()
                    .clickOnRenameButton()
                    .clickOnAcceptButtonInAgModal()
                    .enterDocumentTypeName(existingDocumentType)
                    .clickOnSaveButton()
                    .verifyErrorMessage(
                        ".js-input-error",
                        "The name has already been taken."
                    );

                documentType_PO.verifyErrorMessage(
                    "[aria-hidden='false'] .ag-error-container",
                    "The given data was invalid."
                );
            });
    });

    it("Should pop the error if added document type is greater than 100 character", () => {
        cy.clickOnAddButton();

        documentType_PO
            .enterDocumentTypeName(documentTypeNameGtThan100)
            .verifyErrorMessage(
                ".js-input-error",
                "The name field exceeds the character limit (i.e 100)."
            );

        documentType_PO
            .clickOnSaveButton()
            .verifyErrorMessage(
                "[aria-hidden='false'] .ag-error-container",
                "The given data was invalid."
            );
    });

    it("Should pop the error if edited document type is greater than 100 character", () => {
        documentType_PO
            .clickOnThreeDotActionButton()
            .clickOnRenameButton()
            .clickOnAcceptButtonInAgModal()
            .enterDocumentTypeName(documentTypeNameGtThan100);

        documentType_PO.verifyErrorMessage(
            ".js-input-error",
            "The name field exceeds the character limit (i.e 100)."
        );

        documentType_PO
            .clickOnSaveButton()
            .verifyErrorMessage(
                "[aria-hidden='false'] .ag-error-container",
                "The given data was invalid."
            );
    });

    // @todo fix the uncaught exception
    // @todo visit https://docs.cypress.io/api/events/catalog-of-events#To-conditionally-turn-off-uncaught-exception-handling-unhandled-promise-rejections
    // it("Should pop the error if we first put , in adding document type", () => {
    //     cy.clickOnAddButton();
    //
    //     documentType_PO.enterDocumentTypeName(" , ");
    //
    //     cy.wait(3000);
    //
    //     documentType_PO.clickOnSaveButton();
    //
    //     documentType_PO.verifyErrorMessage(
    //         ".js-input-error",
    //         "The name field is required."
    //     );
    // });

    // @todo fix the uncaught exception
    // it("Should be able to add multiple document type at once and verify its existence in the list", () => {
    //     const firstDocumentTypeName = "first_" + getRandomString();
    //     const secondDocumentTypeName = "second_" + getRandomString();
    //     const thirdDocumentTypeName = "third_" + getRandomString();
    //     const recentlyAddedDocumentTypes = [
    //         thirdDocumentTypeName,
    //         secondDocumentTypeName,
    //         firstDocumentTypeName,
    //     ];
    //     const firstRowDocumentTypeIndex = 1;
    //
    //     cy.clickOnAddButton().then(() => {
    //         cy.get(".input-field>.form-control")
    //             .type(firstDocumentTypeName)
    //             .type(",")
    //             .clear()
    //             .type(secondDocumentTypeName + ",")
    //             .clear()
    //             .type(thirdDocumentTypeName + ",")
    //             .clear();
    //     });
    //
    //     documentType_PO.clickOnSaveButton();
    //
    //     cy.wait(5000);
    //
    //     recentlyAddedDocumentTypes.forEach((documentType, index) => {
    //         cy.get("table>tbody>tr")
    //             .eq(index)
    //             .find("td")
    //             .eq(0)
    //             .invoke("text")
    //             .then((documentTypeName) => {
    //                 expect(documentTypeName.trim()).to.equal(
    //                     recentlyAddedDocumentTypes[index]
    //                 );
    //             });
    //     });

    // cy.get(
    //     `table>tbody>tr>td:nth-child(${firstRowDocumentTypeIndex})`
    // ).each(($el, index) => {
    //     if (index < recentlyAddedDocumentTypes.length)
    //         expect($el).to.contain(recentlyAddedDocumentTypes[index]);
    // });
    // });
});
