const tableRowIndex = 1;

class LeadForms_PO {
    clickOnAddLeadFormButton() {
        cy.get('[href="#/settings/lead-forms/create"]').click();

        return this;
    }

    fillLeadFormName(leadFormName) {
        cy.get("form[name='roleForm'] div[name='name'] > input[type='text']")
            .click()
            .type(leadFormName);

        return this;
    }

    selectRelatedOfficeName() {
        cy.get("div[name='related_office'] > div[role='combobox'] ").click({
            force: true,
        });

        cy.get("ul[role='listbox']>li")
            .as("selectOfficeItems")
            .then((count) => {
                const randomOfficeIndex = Math.floor(
                    Math.random() * count.length
                );

                cy.get("@selectOfficeItems").eq(randomOfficeIndex).click();
            });

        return this;
    }

    clickOnLeadFormSaveButton() {
        cy.get(" form[name='roleForm']  button[type='submit']").click();

        return this;
    }

    verifyUrlOfLeadForm() {
        cy.url().should("include", "/lead-forms");

        return this;
    }

    getElementsInFormTable(leadFormColumnIndex, assertion, content) {
        cy.get(
            `tr:nth-of-type(${tableRowIndex}) > td:nth-of-type(${leadFormColumnIndex})`
        ).should(assertion, content);
    }

    verifyExistenceOfLeadFormName(assertion, leadFormName) {
        const leadFormNameColumnIndex = 2;

        this.getElementsInFormTable(
            leadFormNameColumnIndex,
            assertion,
            leadFormName
        );

        return this;
    }

    verifyStatusOfFirstForm(status) {
        const statusColumnIndex = 6;

        this.getElementsInFormTable(statusColumnIndex, "contain", status);

        return this;
    }

    clickActionButtonOption(option) {
        cy.get(":nth-child(1) > .right > .ag-menu-container")
            .click()
            .contains(option)
            .invoke("removeAttr", "target")
            .click();

        return this;
    }

    verifyStarBadgeForFavoriteLeadForm() {
        const favoriteBadgeIndex = 1;

        this.getElementsInFormTable(favoriteBadgeIndex, "exist", "");

        return this;
    }

    clickOnFavoriteEnquiryFormFromTopNavBar() {
        cy.get(".ag-top-toolbar__right-section >ul").find("li:eq(1)").click();

        return this;
    }

    verifyFavoriteEnquiryInTopNav(leadFormName) {
        cy.get(".ag-leadform__name").last().should("contain", leadFormName);
    }

    verifyOfficeInEnquiryList(leadFormOffice) {
        cy.contains("th", "Pref. Office")
            .invoke("index")
            .then((preferredOfficeHeadingIndex) => {
                cy.get("tr:nth-of-type(1) > td")
                    .eq(preferredOfficeHeadingIndex)
                    .then((officeValue) => officeValue.text().trim())
                    .should("equal", leadFormOffice.trim());
            });
    }

    //@todo handel empty lead form list case
    verifyBadgeAndNameInFavoriteEnquiry(leadFormName) {
        cy.get(".ag-leadform__item").then((favoriteEnquiryCount) => {
            if (favoriteEnquiryCount.length >= 9) {
                this.clickActionButtonOption("Set as Favorite");
                cy.get(".ag-alert-show .text-semi-bold").should(
                    "have.text",
                    "You can only favourite 10 enquiry forms."
                );
            } else {
                this.clickActionButtonOption("Set as Favorite")
                    .verifyStarBadgeForFavoriteLeadForm()
                    .clickOnFavoriteEnquiryFormFromTopNavBar();

                cy.wait(2000);

                this.verifyFavoriteEnquiryInTopNav(leadFormName);
            }
        });
        return this;
    }

    clickOnLeadFormUrl() {
        const leadFormUrlIndex = 3;

        cy.get(
            `tr:nth-of-type(${tableRowIndex}) > td:nth-of-type(${leadFormUrlIndex})>a`
        )
            .invoke("removeAttr", "target")
            .click({ force: true });

        return this;
    }

    verifyErrorMessageForInactiveLeadFormUrl() {
        cy.get(".errorDescriptionHolder").contains("h1", "Ooops!!");
        cy.get(".errorImageHolder > img").should("exist");
    }

    fillLeadFormElements(firstName, lastName) {
        cy.get("#first_name").click().type(firstName);
        cy.get("#last_name").click().type(lastName);

        return this;
    }

    clickOnSubmitFormButton() {
        cy.get(".blue-button ").contains("Submit Form").click();
    }

    verifyExistenceOfSystemFields() {
        cy.get("#first_name").should("exist");
        cy.get("#last_name").should("exist");
        cy.get(".blue-button ").contains("Submit Form").should("exist");
    }

    clickOnCancelButton() {
        cy.get(".button.defaultButton.active").click();

        return this;
    }
}

export default LeadForms_PO;
