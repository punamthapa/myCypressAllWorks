const buttonIndex = {
    activeTabIndex: 0,
    inactiveTabIndex: 1,
    editButtonIndex: 0,
    inactiveButtonIndex: 3,
};
let officeName;
class Agent_PO {
    clickOnSuperAgentType() {
        cy.get("#super-agent").click({ force: true });

        return this;
    }

    clickOnSubAgentType() {
        cy.get("#referrer").click({ force: true });

        return this;
    }

    clickOnBusinessStructure() {
        cy.get("#business").click({ force: true });

        cy.wait(2000);

        return this;
    }

    typeAgentName(agentName) {
        cy.get("#name").clear().type(agentName);

        return this;
    }

    typePrimaryContactName(primaryContactName) {
        cy.get("#contact_person_name")
            .click({ force: true })
            .type(primaryContactName);

        return this;
    }

    typeAgentEmail(agentEmail) {
        cy.get("#referrerEmail")
            .click({ force: true })
            .clear()
            .type(agentEmail);

        return this;
    }

    selectOfficeFromDropdown() {
        cy.get("div[name='related_offices'] > div[role='combobox'] ")
            .as("officeDropdown")
            .click({
                force: true,
            });

        cy.get("ul[role='listbox']>li")
            .as("randomOffice")
            .then((count) => {
                const relatedOfficeIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@randomOffice").eq(relatedOfficeIndex).click();
            });

        cy.get(".ag-select-tag")
            .invoke("text")
            .then((text) => {
                officeName = text.replace(/\n/, "").trim();
            });

        return this;
    }

    verifyOffice() {
        cy.wait(1000).then(() => {
            cy.get("tr:nth-of-type(1) > td:nth-of-type(7) > span ")
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/\n/, "").trim()).eq(officeName);
                });
        });
    }

    clickOnSaveButton() {
        cy.get(".submitButtonMargin .blueButton").click({
            force: true,
        });

        cy.wait(2000);

        return this;
    }

    verifyInputDataInList(agentName, email, containAssertion = "contain") {
        cy.get(".table-responsive").should(containAssertion, agentName, email);

        return this;
    }

    verifyAgentType(agentType) {
        cy.get("table>tbody>tr:first-child>td:nth-child(3)").should(
            "contain",
            agentType
        );

        return this;
    }

    verifyAgentStructure(agentStructure) {
        cy.get("table>tbody>tr:first-child>td:nth-child(4)").should(
            "contain",
            agentStructure
        );

        return this;
    }

    clickOnFirstActivityButton() {
        cy.get("td:last-child .ag-menu-container").first().click({
            force: true,
        });

        return this;
    }

    clickOnActionButton(activityButtonColumnIndex, status) {
        cy.get(".ag-menu__item > button")
            .eq(activityButtonColumnIndex)
            .contains(status)
            .click({ force: true });

        return this;
    }

    clickOnEditButton() {
        this.clickOnActionButton(buttonIndex.editButtonIndex, "Edit");

        return this;
    }

    clickOnInactiveButton() {
        this.clickOnActionButton(
            buttonIndex.inactiveButtonIndex,
            "Make Inactive"
        );
        cy.get(".accept").click({ force: true });

        return this;
    }

    clickOnActionBar(buttonIndex, status) {
        cy.get(".nav > li")
            .eq(buttonIndex)
            .contains(status)
            .click({ force: true });

        return this;
    }

    clickOnInactiveTab() {
        this.clickOnActionBar(buttonIndex.inactiveTabIndex, "Inactive");

        cy.wait(3000);

        return this;
    }

    clickOnActiveTab() {
        this.clickOnActionBar(buttonIndex.activeTabIndex, "Active");

        cy.wait(2000);

        return this;
    }

    clickOnAgentListButton() {
        cy.get(".ghostButton").contains("Agent List").click({ force: true });

        cy.wait(3000);

        return this;
    }

    removeSelectedOffice() {
        cy.get(".ag-select-tag-close").click({ force: true });

        return this;
    }
}

export default Agent_PO;
