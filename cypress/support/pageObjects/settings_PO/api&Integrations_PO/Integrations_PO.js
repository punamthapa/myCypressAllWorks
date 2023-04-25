class Integrations_PO {
    clickOnAddIntegrationButton() {
        cy.get('[data-dd-action-name="Add studylink integration"]').click();

        return this;
    }

    clickOnCheckBox() {
        cy.get('[data-dd-action-name="Toggle Policy"]')
            .check({ force: true })
            .should("be.checked");

        return this;
    }

    clickOnSaveIntegrations() {
        cy.get(
            '[data-dd-action-name="Save integration and connect partner"]'
        ).click();

        return this;
    }

    verifyEmptyValidations() {
        cy.get(".js-input-error")
            .first()
            .should("contain.text", "The Branch Id field is required.");
        cy.get(".js-input-error")
            .last()
            .should("contain.text", "The Api Key field is required.");

        return this;
    }

    selectDropdownValue() {
        cy.get("div[name='branch_id'] > div[role='combobox'] ").click({
            force: true,
        });

        return this;
    }

    getBranchesNameFromApi() {
        cy.intercept("GET", "api/v2/users/branches").as("getOfficeLists");

        return this;
    }

    verifyBranchnameWithApiFetchedBranchNames() {
        cy.wait("@getOfficeLists").then((result) => {
            let branchListFromApi = result.response.body.map(
                (data) => data.name
            );

            cy.get("ul[role='listbox'] > li").each((branchNamesList, index) => {
                cy.wrap(branchNamesList)
                    .invoke("text")
                    .then((branchName) => {
                        expect(branchName.trim()).to.equal(
                            branchListFromApi[index].trim()
                        );
                    });
            });
        });
        return this;
    }

    verifyStudylinkApikey(randomApiKey) {
        cy.get(".api-key").click().type(randomApiKey);
        cy.get(".primary-blue").click();
        cy.get(".api-key > input")
            .invoke("val")
            .then((inputValue) => {
                if (inputValue == "a3867344b107b9b61d3aacbc87dc5a70-preprod") {
                    cy.get(".api-key-icon").should("exist");
                } else {
                    cy.get(".api-key-icon.red").should("exist");
                }
            });

        return this;
    }

    selectBranchValue() {
        this.selectDropdownValue();
        cy.get("ul[role='listbox'] > li[role='option']")
            .eq(0)
            .click({ force: true });

        return this;
    }

    clickOnCancelButton() {
        cy.get('[data-dd-action-name="Close modal"]').click({ force: true });

        return this;
    }

    clickOnConnectPartnerButton() {
        cy.get('[data-dd-action-name="Connect Partners"]').click();

        return this;
    }

    clickOnCloseModal() {
        cy.get(".ag-drawer__close-icon").click({ force: true });

        return this;
    }

    clickOnIntegrationsTab() {
        cy.get(".ag-capsule__menu")
            .contains("Integrations")
            .click({ force: true });

        return this;
    }

    verifyConnectedText() {
        cy.get(".flex-row > p").should("have.text", "Connected");

        return this;
    }

    clickOnMenuToDelete() {
        cy.get(".ag-icon--mid-grey").click({ force: true });
        cy.get('[data-dd-action-name="Delete studylink connections"]').click({
            force: true,
        });
        cy.get('[data-dd-action-name="Delete connection"]').click();

        return this;
    }

    verifyExistenceOfAddButtonAfterDeletion() {
        cy.get('[data-dd-action-name="Add studylink integration"]').should(
            "exist"
        );

        return this;
    }

    clickOnManageUsers() {
        cy.get(".ag-menu-container> p").click({ force: true });

        return this;
    }

    selectfirstUser() {
        cy.get('[data-dd-action-name="Change Follower"]')
            .eq(0)
            .click({ force: true });

        return this;
    }

    deleteExistingUser() {
        cy.get(".ag-avatar > img").click({ force: true });
        cy.get(".ag-menu__item > :nth-child(2) > .button").click({
            force: true,
        });

        return this;
    }

    errorMessageForExistingUser() {
        cy.get(".message .text-semi-bold").should(
            "have.text",
            "Cannot add a user that already exists."
        );

        return this;
    }
}

export default Integrations_PO;
