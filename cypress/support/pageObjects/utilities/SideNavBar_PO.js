class SideNavBar_PO {
    clickOnTeamsModule() {
        cy.get("#teamsMenu > a").click({ force: true });

        return this;
    }

    clickOnOfficeSubModule() {
        cy.get("#teamsMenu > .ag-side-nav__menu > :nth-child(1) > a").click({
            force: true,
        });

        return this;
    }
}

export default SideNavBar_PO;
