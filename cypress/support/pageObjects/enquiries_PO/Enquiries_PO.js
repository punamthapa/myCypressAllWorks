import Attachment_PO from "../Attachment_PO";

const attachment_PO = new Attachment_PO();
const buttonIndex = {
    editButtonIndex: 0,
    approveButtonIndex: 1,
    archiveButtonIndex: 2,
};

class Enquiries_PO {
    verifyTabTitles() {
        const enquiriesTabTitles = ["Enquiries", "Archived"];

        cy.get(".nav.nav-tabs.defaultNav> li").each(
            ($tabTitlesSelector, index) => {
                expect($tabTitlesSelector).to.have.text(
                    enquiriesTabTitles[index]
                );
            }
        );
    }

    clickOnFirstActivityButton() {
        cy.get("td:last-child .ag-menu-container").first().click({
            force: true,
        });

        return this;
    }

    clickOnActionButton(activityButtonColumnIndex) {
        cy.get(".ag-menu__item > button")
            .eq(activityButtonColumnIndex)
            .click({ force: true });

        return this;
    }

    clickOnEditButton() {
        this.clickOnActionButton(buttonIndex.editButtonIndex);

        return this;
    }

    clickOnArchiveButton() {
        this.clickOnActionButton(buttonIndex.archiveButtonIndex);

        return this;
    }

    editFormDetails(firstName, lastName) {
        cy.get('div[name="first_name"] input#first_name')
            .click()
            .type("{selectall}{backspace}")
            .type(firstName);
        cy.get("div[name='last_name'] input#last_name")
            .click()
            .clear()
            .type(lastName);

        return this;
    }

    clickOnSaveButton() {
        cy.get(".submit-button-margin > .button")
            .should("contain", "Save")
            .click();

        return this;
    }

    verifyInputDataInLists(containAssertion, firstName, lastName) {
        cy.get(".ag-flex.ag-flex-column >a")
            .first()
            .should(containAssertion, firstName);
        cy.get(".ag-flex.ag-flex-column >a")
            .first()
            .should(containAssertion, lastName);

        return this;
    }

    clickOnAcceptButton() {
        cy.get(".accept").contains("Accept").click({ force: true });

        return this;
    }

    clickOnAddNotesAndTermsTab() {
        const indexOfNotes = 5;

        cy.get(`.nav > :nth-child(${indexOfNotes}) > a`).click({ force: true });

        return this;
    }

    clickOnApproveButton() {
        this.clickOnActionButton(buttonIndex.approveButtonIndex);

        return this;
    }

    selectRandomAssignee() {
        cy.get("form[name='assignee_id']  div[role='combobox'] ").click({
            force: true,
        });

        cy.wait(2000);

        cy.get("ul[role='listbox']>li")
            .as("assigneeLists")
            .then((count) => {
                const randomAssignee = Math.floor(Math.random() * count.length);

                cy.get("@assigneeLists").eq(randomAssignee).click();
            });

        return this;
    }

    clickOnApproveEnquiryButton() {
        cy.get(".blueButton.button").contains("Approve").click({ force: true });

        return this;
    }

    clickOnFirstEnquiry() {
        cy.get(".ag-flex.ag-flex-column > a").first().click({ force: true });

        return this;
    }

    clickOnProspectsTab() {
        cy.get("[href='#/contacts/prospects']").click({ force: true });

        return this;
    }

    clickOnDocumentTab() {
        const indexOfDocuments = 3;

        cy.get(`.nav > :nth-child(${indexOfDocuments}) > a`).click({
            force: true,
        });

        return this;
    }

    hoverOnAddDocumentButton() {
        cy.get(":nth-child(2) > .dropdown > .button").trigger("mouseover");
    }

    selectAttachmentFromDevice() {
        attachment_PO.selectAttachmentOptionFromDevice();
    }

    uploadDocument(uploadAttachmentNumber) {
        for (let i = 0; i < uploadAttachmentNumber; i++)
            cy.get("input[type='file']").attachFile("images/book.jpg");
    }

    clickOnSaveUploadedDocument() {
        cy.get(".ag-flex > .blueButton").contains("Save").click();

        return this;
    }

    attachDeviceAttachment(uploadAttachmentNumber) {
        this.hoverOnAddDocumentButton();
        this.selectAttachmentFromDevice();

        cy.wait(2000);

        this.uploadDocument(uploadAttachmentNumber);
        this.clickOnSaveUploadedDocument();

        return this;
    }

    verifyAddedAttachments(numberOfAttachments) {
        cy.get(".col-hr-2 > b:nth-of-type(2)").then((count) => {
            const attachmentCount = parseInt(count.text().trim());

            expect(attachmentCount).eq(numberOfAttachments);
        });
    }

    clickOnArchiveTab() {
        cy.get('[href="#/contacts/archived-enquiries"]').click({ force: true });

        return this;
    }
}

export default Enquiries_PO;
