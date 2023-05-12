let application;

class Clients_PO {
    clickOnAddButton() {
        cy.get(" .field.blueButton").contains("Add").click({ force: true });

        return this;
    }

    verifyEmptyValidationError() {
        const emptyValidationErrors = [
            "The First Name field is required.",
            "The Last Name field is required.",
            "The Assignee field is required.",
        ];
        cy.checkValidationErrors(emptyValidationErrors);
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

        cy.wait(3000);

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

        cy.wait(2000);

        return this;
    }

    selectRandomApplication() {
        cy.get("div[name='selectProducts'] > div[role='combobox'] ").click({
            force: true,
        });

        cy.wait(2000);

        cy.get("ul[role='listbox']>li")
            .as("selectApplication")
            .then((count) => {
                const randomApplication = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@selectApplication").eq(randomApplication).click();

                cy.get("@selectApplication")
                    .eq(randomApplication)
                    .invoke("text")
                    .then((randomApplication) => {
                        application = randomApplication
                            .replace(/\s+/g, "")
                            .trim();
                        cy.log(application);
                    });
            });

        cy.wait(2000);

        return this;
    }

    clickOnSaveButton() {
        cy.get(".blueButton.button").contains("Save").click({ force: true });

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

    clickOnFirstClient() {
        cy.get(".ag-flex.ag-flex-column > a").eq(0).click({ force: true });
        cy.wait(3000);

        return this;
    }

    clickOnFirstActivityButton() {
        cy.get("tr:nth-of-type(1) > td:last-child  .ag-menu-container").click();

        return this;
    }

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

    verifyClientNameInProfile(fullName) {
        cy.get(".ag-client__title")
            .invoke("text")
            .then((clientName) => {
                expect(fullName).eq(clientName);
            });
    }

    clickOnApplicationTab() {
        const indexOfApplication = 2;

        cy.get(`.nav > :nth-child(${indexOfApplication}) > a`).click();

        return this;
    }

    verifyAddedApplicationInCLient() {
        cy.get("tr td:nth-of-type(1)")
            .invoke("text")
            .then((applicationValue) => {
                expect(applicationValue.replace(/\s+/g, "").trim()).eq(
                    application
                );
            });
    }

    clickOnAddedApplication() {
        cy.get("tbody .content").click();

        return this;
    }

    clickOnDiscontinueBtn() {
        cy.get(".redButton.text-danger").click();

        return this;
    }

    clickOnDiscontinueReasonDropdown() {
        cy.get("div[name='discontinue_reason'] > div[role='combobox'] ")
            .last()
            .click({
                force: true,
            });
        cy.wait(2000);

        cy.get("ul[role='listbox']>li")
            .as("selectDiscountinueReason")
            .then((count) => {
                const randomReason = Math.floor(Math.random() * count.length);

                cy.get("@selectDiscountinueReason")
                    .eq(randomReason)
                    .click({ force: true });
            });

        cy.wait(4000);
    }

    enterNotes(note) {
        cy.get('textarea[name="note"]').last().type(note);

        return this;
    }

    clickOnConfirmButton() {
        cy.get("button[type='submit']")
            .contains("Confirm")
            .click({ force: true });
    }
}

export default Clients_PO;
