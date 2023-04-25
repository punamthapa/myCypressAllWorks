class ApiAndIntegration_PO {
    #type(selector, word) {
        cy.get(selector).click().type(word);
    }

    #clear(elementSelector) {
        cy.get(elementSelector)
            .click({
                force: true,
            })
            .clear();
    }
    clickOnConnectedPartner() {
        cy.get(".ag-capsule")
            .contains("Connected Partners")
            .click({ force: true });

        return this;
    }

    clickOnConnectNewPartnerButton() {
        cy.get(".blueButton")
            .contains("Connect New Partner")
            .click({ force: true });

        cy.waitingForComponentToMount();

        return this;
    }

    clickOnSaveButton() {
        cy.get(".button.blueButton")
            .contains("Save Connections")
            .click({ force: true });

        cy.wait(3000);

        return this;
    }

    checkForValidationErrorMessage() {
        cy.get(
            "div[name='field.0.studylink_partner'] > .basic.js-input-error"
        ).should("exist");
        cy.get(
            "div[name='field.0.agentcis_partner'] > .basic.js-input-error"
        ).should("exist");

        return this;
    }

    selectRandomStudylinkPartner() {
        cy.get(
            "div[name='field.0.studylink_partner'] > div[role='combobox']"
        ).click({
            force: true,
        });
        cy.get("ul[role='listbox']>li").then((count) => {
            const studyLinkProviders = Math.floor(Math.random() * count.length);

            cy.get("ul[role='listbox']>li").eq(studyLinkProviders).click();
        });

        return this;
    }

    selectRandomAgentcisPartner() {
        cy.get(
            "div[name='field.0.agentcis_partner'] > div[role='combobox']"
        ).click({
            force: true,
        });
        cy.get("ul[role='listbox']>li").then((count) => {
            const partnerInAgentcis = Math.floor(Math.random() * count.length);

            cy.get("ul[role='listbox']>li").eq(partnerInAgentcis).click();
        });

        return this;
    }

    clickOnCancelButton() {
        cy.get('[data-dd-action-name="Close modal"]')
            .eq(1)
            .click({ force: true });

        return this;
    }

    clickOnActivityButton() {
        const activityButtonColumnIndex = 6;

        cy.get(
            `tbody>tr:first-child>td:nth-of-type(${activityButtonColumnIndex}) .ag-menu-container`
        ).click();

        return this;
    }

    typeInSearchBox(textToSearch) {
        this.#type("input[type='search']", textToSearch);

        cy.waitingForComponentToMount();

        return this;
    }

    clearTextInSearchBar() {
        this.#clear("input[type='search']");

        cy.waitingForComponentToMount();

        return this;
    }

    clickOnDeleteOptionFromActivityButton() {
        cy.get('[data-dd-action-name="Delete connection"]').click({
            force: true,
        });

        cy.wait(2000);

        return this;
    }

    clickOnDeleteButtonInsidePopup() {
        cy.get('[data-dd-action-name="Delete connection"]').click({
            force: true,
        });
    }

    clickOnDisbaleOptionFromActivityButton() {
        cy.get('[data-dd-action-name="Disable connection"]').click({
            force: true,
        });

        return this;
    }
    clickOnDisableButtonInsidePopup() {
        cy.get('[data-dd-action-name="disable connection"]').click({
            force: true,
        });
    }

    clickOnGoToClientsButton() {
        cy.get('[data-dd-action-name="Go to Clients"]').click({
            force: true,
        });
    }
}

export default ApiAndIntegration_PO;
