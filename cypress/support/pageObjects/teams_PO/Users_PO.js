let officeName;
let role;
const buttonIndexes = {
    edit: 0,
    cancelInvitation: 1,
    makeInactive: 2,
};

class Users_PO {
    verifySubSection() {
        const subSection = ["Active", "Inactive", "Invited"];

        cy.get(".defaultNav > li").each((section, index) => {
            expect(section.text()).eq(subSection[index]);
        });
    }

    clickOnSubSection(name) {
        cy.get(".defaultNav > li").contains(name).click();
    }

    clickOnButton(name) {
        cy.findAllByRole("button").contains(name).click();

        return this;
    }

    clickOnInactiveTab() {
        cy.get('a[href="#/users/inactive"]').click();

        return this;
    }

    clickOnInviteUser() {
        this.clickOnButton("Invite User");

        cy.wait(3000);

        return this;
    }
    clickOnUpdateButton() {
        this.clickOnButton("Update");

        return this;
    }

    clickOnEditButton() {
        this.clickOnActionButtonOptions(buttonIndexes.edit, { timeout: 10000 });
    }

    clickOnSaveButton() {
        cy.get(".pull-right.clearfix .button.blueButton").click();

        return this;
    }

    clickOnPopUpCancelButton() {
        cy.get(".cancel").click();

        return this;
    }

    clickOnActionButtonOptions(buttonIndex) {
        cy.get(".ag-menu-container.left").first().click();

        cy.wait(2000);

        cy.get(".ag-menu__item.ag-scroll >div").eq(buttonIndex).click();
    }

    clickOnMakeInactive() {
        this.clickOnActionButtonOptions(buttonIndexes.makeInactive);

        return this;
    }

    fillUserDetail(selector, value) {
        cy.get(selector).eq(1).clear().type(value);
    }

    fillFirstName(firstName) {
        this.fillUserDetail('input[name="first_name"]', firstName);

        return this;
    }

    fillLastName(lastName) {
        this.fillUserDetail('input[name="last_name"]', lastName);

        return this;
    }

    fillEmail(email) {
        this.fillUserDetail('input[name="email"]', email);

        return this;
    }

    fillPosition(position) {
        this.fillUserDetail('input[name="job_title"]', position);

        return this;
    }

    searchForUser(data) {
        cy.get('input[placeholder="Search..."]').type(data).type("{enter}");

        return this;
    }

    selectRole() {
        cy.get(
            "div[name='role'] > div[role='combobox'] .ag-select-label.truncate"
        )
            .last()
            .as("roleDropdown")
            .dblclick();

        cy.get('[role="listbox"] > li')
            .as("roleName")
            .then((count) => {
                const relatedRoleIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@roleName").eq(relatedRoleIndex).click();
            });

        cy.get("@roleDropdown")
            .invoke("text")
            .then((text) => {
                role = text.replace(/\n/, "").trim();
            });

        return this;
    }

    verifyEditPage() {
        cy.url().should("include", "/users/edit/");
    }

    verifyName(content, assertion = "contain") {
        cy.get(".content > a")
            .first()
            .then((value) => {
                cy.wrap(value).should(assertion, content);
            });

        return this;
    }

    verifyEmail(content, assertion = "contain") {
        cy.get(".content > p")
            .first()
            .then((value) => {
                cy.wrap(value).should(assertion, content);
            });

        return this;
    }

    verifyPosition(position, assertion = "contain") {
        cy.get("tr:first-child > td:nth-of-type(2)").then((value) => {
            cy.wrap(value).should(assertion, position);
        });

        return this;
    }

    verifyRole() {
        cy.wait(1000).then(() => {
            cy.get("tr:first-child > td:nth-of-type(4)")
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/\n/, "").trim()).eq(role.trim());
                });
        });
    }

    verifyOffice() {
        cy.wait(1000).then(() => {
            cy.get("tr:first-child > td:nth-of-type(3)")
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/\n/, "").trim()).eq(officeName);
                });
        });
    }

    verifyUserName(userName, assertion = "contain") {
        cy.get(".ag-client__title").should(assertion, userName);

        return this;
    }

    verifyModalTitle() {
        const title = "Invite User    * fields are mandatory.";

        cy.get(".ag-modal__title")
            .last()
            .invoke("text")
            .then((drawer) => {
                let titleName = drawer.replace(/\n/g, "");
                expect(titleName.trim()).contains(title);
            });
    }

    clickOnInviteButton() {
        cy.get(".blueButton").eq(5).click();

        cy.wait(3000);

        return this;
    }

    clickOnCancelInvitation() {
        this.clickOnActionButtonOptions(buttonIndexes.cancelInvitation);
    }

    clickOnAcceptButton() {
        cy.get(".modal-body > .redButton").last().click();

        return this;
    }

    clickOnCancelButton() {
        this.clickOnButton("Cancel");

        return this;
    }

    fillNameAndEmail(firstName, lastName, email) {
        cy.get('input[name="first_name"]').eq(1).clear().type(firstName);
        cy.get('input[name="last_name"]').eq(1).clear().type(lastName);
        cy.get('input[name="email"]').eq(1).clear().type(email);

        return this;
    }

    selectRelatedOfficeName() {
        cy.get(
            "div[name = 'office'] > div[role = 'combobox'] .ag-select-label.truncate"
        )
            .last()
            .as("officeDropdown")
            .dblclick();

        cy.get("ul[role='listbox'] > li[role='option']")
            .as("officeName")
            .then((count) => {
                const relatedOfficeIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@officeName").eq(relatedOfficeIndex).click();
            });

        cy.get("@officeDropdown")
            .invoke("text")
            .then((text) => {
                officeName = text.replace(/\n/, "").trim();
            });

        return this;
    }

    verifyNameAndEmail(nameContent, emailContent, assertion = "contain") {
        cy.get(".content > a")
            .first()
            .then((value) => {
                cy.wrap(value).should(assertion, nameContent);
            });

        cy.get(".content > p")
            .first()
            .then((value) => {
                cy.wrap(value).should(assertion, emailContent);
            });

        return this;
    }

    verifyRole() {
        cy.wait(1000).then(() => {
            cy.get("tr:first-child > td:nth-of-type(4)")
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/\n/, "").trim()).eq(role.trim());
                });
        });
    }

    verifyOffice() {
        cy.wait(1000).then(() => {
            cy.get("tr:first-child > td:nth-of-type(3)")
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/\n/, "").trim()).eq(officeName);
                });
        });

        return this;
    }

    verifyUniqueEmailMessage() {
        const uniqueEmailMessage = "The email has already been taken.";

        cy.get(".ui.basic.js-input-error")
            .last()
            .invoke("text")
            .then((message) => {
                expect(message.replace(/\n/, "").trim()).eq(uniqueEmailMessage);
            });
    }

    verifyEmptyValidationErrors() {
        const emptyValidationErrors = [
            "",
            "",
            "The First Name field is required.",
            "The Last Name field is required.",
            "The Email field is required.",
            "The Role Id field is required.",
            "The Branch Id field is required.",
        ];

        cy.checkValidationErrors(emptyValidationErrors);
    }
}

export default Users_PO;
