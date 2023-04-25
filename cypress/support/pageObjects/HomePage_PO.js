class HomePage_PO {
    clickOnSettingMenu() {
        cy.get("[href='/app#/settings/']").click({ force: true });
    }

    clickOnAvatar() {
        cy.get(".ag-top-toolbar__profile__img").click();
    }

    clickOnLogOutMenu() {
        const logOutRowIndex = 5;

        this.clickOnAvatar();

        cy.get(
            `.menu.transition.visible > a:nth-of-type(${logOutRowIndex})`
        ).click();
    }

    clickOnEnquiries() {
        cy.get('[href="/app#/contacts/enquiries"]')
            .contains("Enquiries")
            .click({ force: true });
    }

    clickOnClientsModule() {
        cy.get('[href="/app#/contacts/clients"]').click({ force: true });

        return this;
    }

    clickOnTaskModule() {
        cy.get("#tasksMenu > a").click({ force: true });

        return this;
    }

    clickOnAgentModule() {
        cy.get("#agentsMenu > a").click();
    }

    clickOnPartnerModule() {
        cy.get("[href='/app#/partners']").click({ force: true });
    }

    clickOnTeams() {
        cy.get("#teamsMenu .ag-side-nav__link").click({ force: true });
    }

    clickOnTeamsUser() {
        this.clickOnTeams();

        cy.get('#teamsMenu [href="/app#/users"]').click({ force: true });

        return this;
    }

    clickOnCampaignModule() {
        cy.get("#campaignMenu > a").click({ force: true });
    }

    clickOnClients() {
        cy.get("#clientsMenu > a").click({ force: true });
    }
}

export default HomePage_PO;
