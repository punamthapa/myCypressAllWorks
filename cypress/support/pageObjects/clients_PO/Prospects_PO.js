import Attachment_PO from "../Attachment_PO";

const attachment_PO = new Attachment_PO();

class Prospects_PO {
    clickOnProspectTab() {
        cy.get("[href='#/contacts/prospects']").click({ force: true });
    }

    clickOnAddButton() {
        cy.get(" .field.blueButton").contains("Add").click();

        return this;
    }

    fillFormElements(firstName, lastName, email) {
        cy.wait(2000);

        cy.get("div[name='first_name'] > input[name='first_name']")
            .clear()
            .type(firstName);

        cy.wait(2000);

        cy.get("div[name='last_name'] > input[name='last_name']")
            .last()
            .clear()
            .type(lastName);

        cy.wait(2000);

        cy.get("div[name='email'] >input[type='email']").type(email);

        return this;
    }

    selectRandomAssignee() {
        cy.get("div[name='assignee'] > div[role='combobox'] ").click({
            force: true,
        });

        cy.wait(2000);

        cy.get("ul[role='listbox']>li")
            .as("assigneeLists")
            .then((count) => {
                const randomAssignee = Math.floor(Math.random() * count.length);

                cy.get("@assigneeLists").eq(randomAssignee).click();
            });
    }

    clickOnSaveButton() {
        cy.get(".blueButton.button").contains("Save").click();

        return this;
    }

    clickOnFirstActivityButton() {
        cy.get("tr:nth-of-type(1) > td:last-child  .ag-menu-container").click();

        return this;
    }

    //@todo make the archive function dynamic
    clickOnEditOption() {
        cy.get(".ag-menu__item >button:nth-of-type(2)").click();

        return this;
    }

    editFormDetails(firstName, lastName, email) {
        cy.get('div[name="first_name"] input#first_name')
            .click()
            .type("{selectall}{backspace}")
            .type(firstName);
        cy.get("div[name='last_name'] input#last_name")
            .click()
            .clear()
            .type(lastName);
        cy.get('div[name="email"] input#email').click().clear().type(email);

        return this;
    }

    verifyInputDataInLists(containAssertion, firstName, lastName, email) {
        cy.get(".ag-flex.ag-flex-column >a")
            .first()
            .should(containAssertion, firstName);
        cy.get(".ag-flex.ag-flex-column >a")
            .first()
            .should(containAssertion, lastName);
        cy.get(".truncate > a").first().should(containAssertion, email);

        return this;
    }

    //@todo make the archive function dynamic
    clickOnArchiveOption() {
        cy.get(".ag-menu__item >button:nth-of-type(3)").click({ force: true });

        return this;
    }

    clickOnAcceptButton() {
        cy.get(".accept").contains("Accept").click({ force: true });

        return this;
    }

    clickOnFirstProspects() {
        cy.get(".ag-flex.ag-flex-column > a").eq(0).click({ force: true });

        return this;
    }

    clickOnApplicationTab() {
        const indexOfDocuments = 2;

        cy.get(`.nav > :nth-child(${indexOfDocuments}) > a`).click({});

        return this;
    }

    clickOnAddApplicationButton() {
        cy.get(".paddingNone > .button").contains("add").click();

        return this;
    }

    selectRandomWorkflow() {
        cy.get("div[name='workflow'] > div[role='combobox']").click({
            force: true,
        });

        cy.wait(3000);

        cy.get("ul[role='listbox']>li")
            .as("workflowDropDownLists")
            .then((count) => {
                const randomWorkflow = Math.floor(Math.random() * count.length);
                cy.get("@workflowDropDownLists").eq(randomWorkflow).click();
            });

        return this;
    }

    selectRandomPartner() {
        cy.get("div[name='partner'] > div[role='combobox'] ").click({
            force: true,
        });

        cy.wait(3000);

        cy.get("ul[role='listbox']>li")
            .as("partnerDropDownLists")
            .then((count) => {
                const randomPartner = Math.floor(Math.random() * count.length);
                cy.get("@partnerDropDownLists").eq(randomPartner).click();
            });

        return this;
    }

    selectRandomProduct() {
        cy.get("div[name='product'] > div[role='combobox']  ").click({
            force: true,
        });

        cy.wait(3000);

        cy.get("ul[role='listbox']>li")
            .as("productDropDownLists")
            .then((count) => {
                const randomProduct = Math.floor(Math.random() * count.length);
                cy.get("@productDropDownLists").eq(randomProduct).click();
            });

        return this;
    }

    clickOnNotesTab() {
        const indexOfDocuments = 6;

        cy.get(`.nav > :nth-child(${indexOfDocuments}) > a`).click({});

        return this;
    }

    clickOnDocumentTab() {
        const indexOfDocuments = 4;

        cy.get(`.nav > :nth-child(${indexOfDocuments}) > a`).click({});

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
}

export default Prospects_PO;
