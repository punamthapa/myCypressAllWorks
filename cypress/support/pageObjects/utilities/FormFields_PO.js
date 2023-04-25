class FormFields_PO {
    #type(selector, word) {
        cy.get(selector).click().clear().type(word);
    }

    #clickElement(elementSelector) {
        cy.get(elementSelector).click({
            force: true,
        });
    }

    #clear(elementSelector) {
        cy.get(elementSelector)
            .click({
                force: true,
            })
            .clear();
    }

    searchWithinTable(word) {
        cy.get("table>tbody>tr").then((records) => {
            cy.wrap(records).should("contain", word);
        });

        return this;
    }

    typeInSearchBox(textToSearch) {
        this.#type("input[type='search']", textToSearch);

        return this;
    }

    clickOnSearchButton() {
        this.#clickElement(".ag-search__button.transparent-button");

        return this;
    }

    clearTextInSearchBar() {
        this.#clear("input[type='search']");

        return this;
    }

    clickOnDropdownFormField(nameAttribute) {
        this.#clickElement(
            `div[name='${nameAttribute}'] > div[role='combobox']`
        );

        return this;
    }
}

export default FormFields_PO;
