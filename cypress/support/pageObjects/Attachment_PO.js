class Attachment_PO {
    attachDeviceAttachment(numberOfAttachmentToBeUploaded = 1) {
        this.hoverOnAttachmentIcon();
        this.selectAttachmentOptionFromDevice();
        this.uploadDocument(numberOfAttachmentToBeUploaded);
        this.submitUploadedDocument();
    }
    hoverOnAttachmentIcon() {
        cy.contains("Attachments").trigger("mouseover");
    }

    selectAttachmentOptionFromDevice() {
        cy.get(".dropdown-content > div:nth-of-type(2)").click({ force: true });
    }

    uploadDocument(numberOfAttachmentToBeUploaded = 1) {
        for (let i = 0; i < numberOfAttachmentToBeUploaded; i++)
            cy.get("input[type='file']").attachFile("images/camera.png");
    }

    submitUploadedDocument() {
        cy.get(".ag-modal__footer .blueButton").click();
    }

    removeUploadedDocument(count) {
        for (let i = 0; i < count; i++)
            cy.get(
                ".cards.doubling.four.stackable.ui > div:nth-of-type(1)>.ag-file-attachment-card__content.content.removable > Button"
            ).click();
    }
}

export default Attachment_PO;
