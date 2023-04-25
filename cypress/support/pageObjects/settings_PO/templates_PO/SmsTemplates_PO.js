const placeholders = [
    {
        value: "client_first_name",
    },
    {
        value: "client_last_name",
    },
    {
        value: "client_dob",
    },
    {
        value: "client_phone",
    },
    {
        value: "client_email",
    },
    {
        value: "client_address",
    },
    {
        value: "client_city",
    },
    {
        value: "client_nation_name",
    },
    {
        value: "client_visa_expiry_date",
    },
    {
        value: "client_assignee_name",
    },
    {
        value: "client_client_identifier",
    },
    {
        value: "client_internal_id",
    },
    {
        value: "tenant_name",
    },
];

class SmsTemplate_PO {
    clickOnSmsTemplate() {
        cy.get("[href= '#/settings/templates/sms']").click();

        return this;
    }

    clickOnSaveButton() {
        cy.get(".blueButton").contains("Save").click();

        return this;
    }

    clickOnCancelButton() {
        cy.get(".ag-justify-end > .button.defaultButton").click();

        return this;
    }

    fillFormElement(smsTitle, smsMessage) {
        cy.get('input[name="title"]').clear().type(smsTitle);
        cy.get(".ql-editor").clear().type(smsMessage);

        return this;
    }

    clearTextField() {
        cy.get('input[name="title"]').clear();
        cy.get(".ql-editor").clear();

        return this;
    }

    clickOnActionButton(buttonSelector) {
        cy.get(".ui.col-v-2>.column")
            .find(".content")
            .first()
            .find(buttonSelector)
            .click({ force: true });

        return this;
    }

    clickOnDeleteButton() {
        this.clickOnActionButton("button[title='Delete SMS Template']");

        cy.get(".accept").click({
            force: true,
        });

        return this;
    }

    clickOnEditButton() {
        this.clickOnActionButton("button[title='Edit SMS Template']");

        return this;
    }

    verifyFirstEntryOfList(index, assertion, content) {
        cy.get(".content")
            .eq(index)
            .invoke("text")
            .then((value) => {
                cy.wrap(value.trim()).should(assertion, content);
            });
    }

    verifyFirstSmsTitle(assertion, smsTitle) {
        const smsTitleIndex = 0;

        this.verifyFirstEntryOfList(smsTitleIndex, assertion, smsTitle);

        return this;
    }

    verifyFirstSmsMessage(assertion, smsMessage) {
        const messageIndex = 1;

        this.verifyFirstEntryOfList(messageIndex, assertion, smsMessage);

        return this;
    }

    selectPlaceholdersAndVerify() {
        cy.get(".ql-picker-item").each((placeholder) => {
            cy.get(".ql-placeholder").first().click();
            cy.wrap(placeholder).click();
        });

        this.clickOnSaveButton();

        cy.wait(2000)
            .get(".content p")
            .eq(0)
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
}

export default SmsTemplate_PO;
