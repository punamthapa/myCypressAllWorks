class Offices_PO {
    typeOfficeName(officeName) {
        cy.get("#name").click().type(officeName);

        return this;
    }

    selectCountry() {
        cy.get(".field > .ui > .search").eq(0).click({
            force: true,
        });
        cy.get(".menu.transition > div")
            .as("countryList")
            .then((count) => {
                const countryNameIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@countryList").eq(countryNameIndex).click();
            });

        return this;
    }

    typeEmailAddress(email) {
        cy.get("#email")
            .click({
                force: true,
            })
            .type(email);

        return this;
    }

    clickOnSaveButton() {
        cy.get(".blueButton.button").contains("Save").click({
            force: true,
        });

        return this;
    }

    clickOnOfficeListButton() {
        cy.get(".blueButton.ghostButton").click({ force: true });

        return this;
    }

    verifyOfficeNameInList(officeName, asseration) {
        cy.get(".col-xs-12 tr:last-child  > td:nth-of-type(1)").should(
            asseration,
            officeName
        );
    }

    verifyOfficeName(officeName, asseration = "contain") {
        cy.get(".col-xs-12").then(($div) => {
            if ($div.find("nav").length > 0) {
                cy.get("ul").then(($table) => {
                    if ($table.hasClass("pagination")) {
                        cy.get("li:nth-last-child(2) > .page-link").click({
                            force: true,
                        });

                        this.verifyOfficeNameInList(officeName, asseration);
                    }
                });
            } else {
                this.verifyOfficeNameInList(officeName, asseration);
            }
        });

        return this;
    }

    typeOnSearchBar(officeName) {
        cy.get(".searchInput.ui > input[name='search']")
            .click()
            .type(officeName);

        return this;
    }

    clickOnSearchIcon() {
        cy.get(".searchInput button").click({ force: true });

        return this;
    }

    searchWithinTable(word) {
        cy.get("table>tbody>tr").then((records) => {
            cy.wrap(records).should("contain", word);
        });

        return this;
    }

    checkEmptyValidationErrors() {
        const validationErrors = [
            "The name field is required.",
            "The country field is required.",
            "The email field is required.",
        ];

        cy.get(".error.field.required > .ui.visible")
            .as("validationErrorSelector")
            .should("exist");

        cy.get("@validationErrorSelector").each(
            (validationErrorsSelector, index) => {
                expect(validationErrorsSelector).to.contain.text(
                    validationErrors[index]
                );
            }
        );

        return this;
    }

    clickOnArchiveButton() {
        cy.get(".delete-confirm")
            .last()
            .click({ force: true })
            .wait(3000)
            .get("div#archiveModal #yes-delete")
            .click({ force: true });

        return this;
    }
}

export default Offices_PO;
