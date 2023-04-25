import { MASTER_CATEGORIES } from "../../../../constants/masterCategories";
import Attachment_PO from "../Attachment_PO";

const attachment_PO = new Attachment_PO();
let workflow;
let partnerType;

class Partners_PO {
    verifyTabTitle() {
        cy.get(".nav.nav-tabs.defaultNav> li").should("have.text", "Partners");

        return this;
    }

    checkEmptyValidationErrors() {
        const validationErrors = [
            "The Master Category is required.",
            "The Partner Type is required.",
            "The Name field is required.",
            "The Services field is required.",
            "The Currency Code field is required.",
            "The Email field is required.",
        ];

        cy.checkValidationErrors(validationErrors);

        return this;
    }

    clickOnSaveButton() {
        cy.get(".submitButton")
            .contains("Save")
            .click({ force: true })
            .wait(2000);

        return this;
    }

    selectMasterCategory() {
        const randomCategory =
            MASTER_CATEGORIES[
                Object.keys(MASTER_CATEGORIES)[
                    Math.floor(
                        Math.random() * Object.keys(MASTER_CATEGORIES).length
                    )
                ]
            ];

        cy.get("div[name='masterCategory'] > div[role='combobox']").click({
            force: true,
        });

        cy.get(".ag-select-search-input")
            .click({ force: true })
            .type(randomCategory)
            .wait(2000)
            .get(".ag-select-list-wrapper > ul > li")
            .click({ force: true });

        return this;
    }

    selectPartnerType() {
        cy.get("div[name='category'] > div[role='combobox'] ").click({
            force: true,
        });

        cy.get("ul[role='listbox']>li")
            .as("selectPartnerType")
            .then((count) => {
                const randomPartnerTypeIndex = Math.floor(
                    Math.random() * count.length
                );

                console.log(randomPartnerTypeIndex);

                cy.wait(2000);

                cy.get("@selectPartnerType")
                    .eq(randomPartnerTypeIndex)
                    .click({ force: true });

                cy.get("@selectPartnerType")
                    .eq(randomPartnerTypeIndex)
                    .invoke("text")
                    .then((randomPartner) => {
                        partnerType = randomPartner.trim();
                    });
            });

        return this;
    }

    selectWorkflow() {
        cy.get("div[name='services'] > div[role='combobox']")
            .as("workflowDropdown")
            .click({
                force: true,
            });

        cy.get("ul[role='listbox']>li")
            .as("selectWorkflow")
            .then((count) => {
                const randomWorkflowIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@selectWorkflow").eq(randomWorkflowIndex).click();

                cy.get("@selectWorkflow")
                    .eq(randomWorkflowIndex)
                    .invoke("text")
                    .then((randomWorkflow) => {
                        workflow = randomWorkflow.trim();
                    });
            });

        return this;
    }

    verifyPartnerType() {
        cy.get("tr:nth-of-type(1) > td:nth-of-type(5)")
            .invoke("text")
            .then((partnerValue) => {
                expect(partnerValue.trim()).eq(partnerType);
            });

        return this;
    }

    verifyWorkflow() {
        cy.get("tr:nth-of-type(1) > td:nth-of-type(4) > span > .truncate")
            .invoke("text")
            .then((workflowValue) => {
                expect(workflowValue.trim()).eq(workflow);
            });

        return this;
    }

    enterPartnerName(partnerName) {
        cy.get("form[name='partnerForm'] div[name='name'] > input[name='name']")
            .clear()
            .type(partnerName);

        return this;
    }

    removeWorkflow() {
        cy.get(".ag-select-tag > .ag-select-tag-close").click();

        return this;
    }

    selectCurrencyCode() {
        cy.get("div[name='currency'] > div[role='combobox'] ").click({
            force: true,
        });

        cy.get("ul[role='listbox']>li")
            .as("selectRandomDropDownValue")
            .then((count) => {
                const randomIndex = Math.floor(Math.random() * count.length);

                cy.get("@selectRandomDropDownValue")
                    .eq(randomIndex)
                    .click({ force: true });
            });

        return this;
    }

    enterEmail(email) {
        cy.get(
            "form[name='partnerForm'] div[name='email'] > input[name='email']"
        )
            .clear()
            .type(email);

        return this;
    }

    verifyInputDataInLists(containAssertion, partnerName, email) {
        cy.get(".truncate >a").first().should(containAssertion, partnerName);
        cy.get("a>.truncate").first().should(containAssertion, email);

        return this;
    }

    clickOnActivityButton() {
        cy.get(".js-dropdown-no-transition").first().click({ force: true });

        return this;
    }

    clickOnActionButton(activityButtonColumnIndex) {
        cy.get(".visible>.item").eq(activityButtonColumnIndex).click();
    }

    clickOnEditButton() {
        const editButtonIndex = 1;

        this.clickOnActionButton(editButtonIndex);

        cy.wait(3000);

        return this;
    }

    clickOnPartnerListButton() {
        cy.get(".ghostButton").contains("Partner List").click({ force: true });

        return this;
    }

    clickOnDeleteButton() {
        const deleteButtonIndex = 2;

        this.clickOnActionButton(deleteButtonIndex);

        cy.get(".accept").contains("Accept").click().wait(3000);

        return this;
    }

    clickOnUpdateButton() {
        cy.get(".submitButton").contains("Update").click({ force: true });

        return this;
    }

    clickOnFirstPartnerName() {
        cy.get(".truncate >a").first().click({ force: true });

        return this;
    }

    clickOnDocumentTab() {
        const indexOfDocuments = 7;

        cy.get(`.nav > :nth-child(${indexOfDocuments}) > a`).click({
            force: true,
        });

        return this;
    }

    hoverOnAddDocumentButton() {
        cy.get(":nth-child(2) > .dropdown > .button").trigger("mouseover");

        return this;
    }

    selectAttachmentFromDevice() {
        attachment_PO.selectAttachmentOptionFromDevice();

        return this;
    }

    uploadDocument(numberOfAttachmentToBeUploaded = 1) {
        for (let i = 0; i < numberOfAttachmentToBeUploaded; i++)
            cy.get("input[type='file']").attachFile("images/book.jpg");
    }

    clickOnSubmitUploadedDocument() {
        cy.get(".ag-flex > .blueButton").contains("Save").click();
    }

    attachDeviceAttachment(numberOfAttachmentToBeUploaded) {
        this.hoverOnAddDocumentButton();
        this.selectAttachmentFromDevice();

        cy.wait(3000);

        this.uploadDocument(numberOfAttachmentToBeUploaded);
        this.clickOnSubmitUploadedDocument();

        return this;
    }

    verifyAddedAttachments(numberOfAttachments) {
        cy.get(".col-hr-2 > b:nth-of-type(2)").then((count) => {
            const attachmentCount = parseInt(count.text().trim());

            expect(attachmentCount).eq(numberOfAttachments);
        });
    }
}

export default Partners_PO;
