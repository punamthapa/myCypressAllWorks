const actionButton = {
    saveButton: "Save",
    updateButton: "Update",
};

class Appointment_PO {
    clickOnAppointmentTab() {
        const indexOfDocuments = 4;

        cy.get(`.nav > :nth-child(${indexOfDocuments}) > a`).click({
            force: true,
        });

        return this;
    }

    addEmail(email) {
        cy.get('div[name="email"] input#email').click().type(email);

        return this;
    }

    clickOnAddButton() {
        cy.get(".blueButton.text-uppercase").click();

        return this;
    }

    verifyExistenceOfDrawerTitle(title) {
        cy.get("#appointment-title").then((titleSelector) => {
            const titleText = titleSelector
                .text()
                .trim()
                .replace(/\n \s+/g, " ");
            expect(titleText).to.contain(title);
        });

        return this;
    }

    selectTimeZone() {
        cy.get("div[name='timezone'] > div[role='combobox'] ")
            .as("timeZoneDropdown")
            .click({ force: true });

        cy.wait(3000);

        cy.get("ul[role='listbox']>li")
            .as("selectTimeZone")
            .then((count) => {
                const randomTimeZoneIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@selectTimeZone").eq(randomTimeZoneIndex).click();

                cy.get("@selectTimeZone")
                    .eq(randomTimeZoneIndex)
                    .invoke("text")
                    .then((randomTimeZone) => {
                        const timeZone = randomTimeZone.trim();
                    });
            });

        return this;
    }

    enterTitle(title) {
        cy.get('input[name="title"]').clear().type(title);

        return this;
    }

    enterDescription(description) {
        cy.get("#description").clear().type(description);

        return this;
    }

    clickOnCancelButton() {
        cy.get('button[type="button"]')
            .contains("Cancel")
            .click({ force: true });

        return this;
    }

    clickOnActionButton(buttonName) {
        cy.get('button[type="submit"]')
            .contains(buttonName)
            .click({ force: true });

        cy.wait(3000);
    }

    clickOnSaveBtn() {
        this.clickOnActionButton(actionButton.saveButton);

        return this;
    }

    clickOnUpdateBtn() {
        this.clickOnActionButton(actionButton.updateButton);

        return this;
    }

    verifyTitle(title) {
        cy.get(".content > h4")
            .invoke("text")
            .then((titleText) => {
                expect(titleText.trim()).eq(title);
            });

        return this;
    }

    verifyDescription(description) {
        cy.get("p.col-v-5")
            .invoke("text")
            .then((descriptionText) => {
                expect(descriptionText.trim()).eq(description);
            });

        return this;
    }

    clickOnEditIcon() {
        cy.get(".ag-icon-group > .ag-icon--circle").click();

        return this;
    }
}

export default Appointment_PO;
