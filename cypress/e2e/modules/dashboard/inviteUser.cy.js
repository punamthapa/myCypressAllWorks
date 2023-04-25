/// <reference types= "cypress" />
// mailosaur implementation is required to run this file

import InviteUser_PO from "../../../support/pageObjects/dashboard_PO/inviteUser_PO/InviteUser_PO";
import AgModal_PO from "../../../support/pageObjects/utilities/AgModal_PO";

describe("Invite user in dashboard", function () {
    const agModal_PO = new AgModal_PO();
    const inviteUser_PO = new InviteUser_PO();

    before(() => {
        Cypress.on("uncaught:exception", (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false;
        });

        cy.login();
    });
    beforeEach(() => {
        cy.preserveAppCookie();
    });

    it("Should add mandatory field and invite new user", function () {
        const receiverEmailAddress = "abcde@nwmg9poj.mailosaur.net";
        inviteUser_PO.clickOnInviteUserButton();

        agModal_PO.verifyExistenceOfAgModal();

        inviteUser_PO.fillElements().clickOnSaveButton();

        cy.wait(5000);
        // .verifyEmailSent();
        cy.pause();
        const serverId = "nwmg9poj";

        cy.mailosaurGetMessage(serverId, {
            sentTo: receiverEmailAddress,
        }).then((email) => {
            cy.pause();
            console.log("here");
            // expect(email.from[0].email).to.equal("noreply@agentcisapp.com");
            // expect(email.to[0].email).to.equal(receiverEmailAddress);
            expect(email.subject).to.have.string(
                "has invited you to join Agentcis"
            );
        });
    });
});
