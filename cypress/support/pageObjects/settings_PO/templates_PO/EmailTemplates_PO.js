import Attachment_PO from "../../Attachment_PO";

const placeholders = [
    {
        value: "client_first_name",
        label: "Client First Name",
    },
    {
        value: "client_last_name",
        label: "Client Last Name",
    },
    {
        value: "client_dob",
        label: "Client Date of birth",
    },
    {
        value: "client_phone",
        label: "Client Phone",
    },
    {
        value: "client_email",
        label: "Client Email",
    },
    {
        value: "client_address",
        label: "Client Full Address",
    },
    {
        value: "client_city",
        label: "Client City",
    },
    {
        value: "client_nation_name",
        label: "Client Nation Name",
    },
    {
        value: "client_visa_expiry_date",
        label: "Client Visa Expiry Date",
    },
    {
        value: "client_assignee_name",
        label: "Client Assignee Name",
    },
    {
        value: "client_client_identifier",
        label: "Client Id",
    },
    {
        value: "client_internal_id",
        label: "Internal Id",
    },
    {
        value: "tenant_name",
        label: "Company Name",
    },
];

class EmailTemplates_PO {
    clickOnSaveButton() {
        cy.get(".form > .ag-justify-end > .blueButton").click();

        return this;
    }

    fillAllFormElement(emailTitle, emailSubject, emailBody) {
        cy.get(".ag-drawer")
            .find("form>div")
            .first()
            .type(emailTitle)
            .next()
            .find("p")
            .type(emailSubject)
            .parents()
            .find("div[name=content]")
            .find("p")
            .type(emailBody);

        return this;
    }

    verifyEmailTitleSubjectBodyExistenceOfFirstEntry(
        containAssertion,
        emailTitle,
        emailSubject,
        emailBody
    ) {
        cy.get(".ui.col-v-2>.column")
            .find(".content")
            .first()
            .should(containAssertion, emailTitle)
            .next()
            .should(containAssertion, emailSubject)
            .next()
            .should(containAssertion, emailBody);
    }

    clickOnTemplateButton(buttonSelector) {
        cy.get(".ui.col-v-2>.column")
            .find(".content")
            .first()
            .find(buttonSelector)
            .click({ force: true });

        return this;
    }

    verifyPlaceholderNames(placeholderSelector) {
        cy.get(placeholderSelector).each((placeholder, index) => {
            cy.get(placeholder)
                .invoke("attr", "data-value")
                .then((placeholderValues) => {
                    expect(placeholderValues.trim()).contains(
                        placeholders[index].value
                    );
                });
        });

        return this;
    }

    verifyPlaceholderContentInCard(index) {
        cy.get(".ui.col-v-2>.column")
            .first()
            .find(".content")
            .eq(index)
            .find(".ql-placeholder-content")
            .each((textBoxSelector, index) => {
                cy.wrap(textBoxSelector).should(
                    "have.attr",
                    "data-id",
                    placeholders[index].value
                );
            });

        return this;
    }

    selectPlaceholdersAndVerify(placeholderSelector, textBoxSelector) {
        cy.get(placeholderSelector).each((placeholder) => {
            cy.wrap(placeholder).click({ force: true });
        });

        cy.get(textBoxSelector).each((textBox, index) => {
            cy.wrap(textBox).should(
                "have.attr",
                "data-id",
                placeholders[index].value
            );
        });

        return this;
    }

    checkEmptyValidationErrors() {
        const validationErrors = [
            "The Title field is required.",
            "The Subject field is required.",
            "The Content field is required.",
        ];

        cy.get(".ui.basic.js-input-error").each(
            (validationErrorsSelector, index) => {
                expect(validationErrorsSelector).to.contain.text(
                    validationErrors[index]
                );
            }
        );
    }

    checkValidationErrorExistence(selector) {
        cy.get(selector).should("not.exist");

        return this;
    }

    clickOnAcceptButtonInAgModal() {
        cy.get(".modal-content > .modal-body > .redButton").click();
    }

    verifyTextInEmailTemplateDrawer(selector, method, assertSelector) {
        cy.get(selector).invoke(method).should("contain", assertSelector);

        return this;
    }

    attachAttachmentFromDevice(numberOfAttachmentToBeUploaded = 1) {
        const attachment_PO = new Attachment_PO();
        attachment_PO.attachDeviceAttachment(numberOfAttachmentToBeUploaded);
    }

    clearAllFields() {
        cy.get("input[name=title]")
            .clear()
            .get("div[name='subject'] .ql-editor")
            .clear()
            .get("div[name='content'] .ql-editor")
            .clear();

        return this;
    }

    verifyAttachmentsCount(fileCountBeforeSaving) {
        let fileCountAfterSaving;
        const formattedFileCountBeforeSaving = fileCountBeforeSaving.trim();

        cy.get(
            ".col-v-2.column.four.grid.ui > div:nth-of-type(1) > div > div:nth-of-type(4)"
        )
            .invoke("text")
            .then((listAttachment) => {
                fileCountAfterSaving = listAttachment.split("Attachment")[0];

                expect(fileCountAfterSaving.trim()).to.eq(
                    formattedFileCountBeforeSaving
                );
            });
    }
}

export default EmailTemplates_PO;
