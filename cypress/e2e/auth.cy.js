describe("Verifying the authentication action of the system", () => {
    it("Verifying the login action", () => {
        cy.login();
    });

    it("Verifying the logout action", () => {
        cy.login();
        cy.logout();
    });
});
