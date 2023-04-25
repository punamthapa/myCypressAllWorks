import faker from "@faker-js/faker";
import { config } from "../../../../../config";

// const receiverEmailAddress = faker.word.noun(5) + config.app.server_domain;
const receiverEmailAddress = "abcde" + config.app.server_domain;

class InviteUser_PO {
    clickOnInviteUserButton() {
        cy.get(".blueButton").contains("Invite User").click({ force: true });
    }

    typeInInputBox(parentSelector, childSelector, word) {
        cy.get(
            "div[name='" +
                parentSelector +
                "'] > input[name='" +
                childSelector +
                "']"
        )
            .eq(1)
            .clear()
            .type(word);
    }

    typeFirstName() {
        const firstName = faker.name.firstName();

        this.typeInInputBox("name", "first_name", firstName);
    }

    typeLastName() {
        const lastName = faker.name.lastName();

        this.typeInInputBox("last_name", "last_name", lastName);
    }

    typeEmailAddress() {
        this.typeInInputBox("email", "email", receiverEmailAddress);
    }

    selectFirstDropdownOption() {
        cy.get("div[name='role'] > div[role='combobox']")
            .eq(1)
            .click({ force: true });

        cy.get("ul[role='listbox'] > li").eq(0).click({ force: true });
    }

    fillElements() {
        this.typeFirstName();

        this.typeLastName();

        this.typeEmailAddress();

        this.selectFirstDropdownOption();

        return this;
    }

    clickOnSaveButton() {
        cy.get("form[role='form']> div").last().find("button").first().click();

        cy.get(".accept").contains("Accept").click();

        return this;
    }

    verifyEmailSent() {
        cy.pause();
        cy.wait(3000);
        const serverId = config.app.server_id;

        cy.mailosaurGetMessage(serverId, {
            sentTo: receiverEmailAddress,
        }).then((email) => {
            console.log("here");
            // expect(email.from[0].email).to.equal("noreply@agentcisapp.com");
            // expect(email.to[0].email).to.equal(receiverEmailAddress);
            expect(email.subject).to.have.string(
                "has invited you to join Agentcis"
            );
        });
    }
}

export default InviteUser_PO;
