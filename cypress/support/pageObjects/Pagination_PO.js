class Pagination_PO {
    verifyPaginationLabel() {
        cy.get(".ag-pagination>label>.col-hr-1").should((element) => {
            expect(element.text().trim()).equal("Rows per page");
        });

        return this;
    }

    verifyPaginatorLimitsOptions() {
        const paginatorLimits = ["10", "25", "50"];

        cy.get(".ag-pagination__select>option").each(($el, index) => {
            expect($el).to.contain(paginatorLimits[index]);
        });

        return this;
    }

    verifyPaginationButtonsExistence() {
        const backPaginationButtonIndex = 1;
        const nextPaginationButtonIndex = 2;

        cy.get(
            `.ag-flex.ag-pagination__buttons > button:nth-of-type(${backPaginationButtonIndex})`
        ).should("exist");

        cy.get(
            `.ag-flex.ag-pagination__buttons > button:nth-of-type(${nextPaginationButtonIndex})`
        ).should("exist");

        return this;
    }

    verifyStateOfBackButtonInPaginator() {
        const initialPageInfo = 1;
        const backPaginationButtonIndex = 1;

        cy.wait(2000);

        cy.get(
            `.ag-pagination__info.col-hr-2> strong:nth-of-type(${initialPageInfo})`
        )
            .invoke("text")
            .then((element) => {
                cy.get(
                    `.ag-pagination__buttons .ag-pagination__button:nth-of-type(${backPaginationButtonIndex})`
                ).as("backPaginationButtonSelector");

                if (element.trim() === "1") {
                    cy.get("@backPaginationButtonSelector").should(
                        "be.disabled"
                    );
                } else {
                    cy.get("@backPaginationButtonSelector").should(
                        "be.enabled"
                    );
                }
            });

        return this;
    }

    verifyStateOfNextButtonInPaginator() {
        const totalRecordCountIndex = 3;
        const perPageLimitIndex = 2;
        const nextPaginationButtonIndex = 2;

        cy.wait(2000);

        cy.get(
            `.ag-pagination__info.col-hr-2> strong:nth-of-type(${perPageLimitIndex})`
        )
            .invoke("text")
            .then((perPageLimit) => {
                cy.get(
                    ` .ag-pagination__info.col-hr-2 > strong:nth-of-type(${totalRecordCountIndex})`
                )
                    .invoke("text")
                    .then((totalRecordCount) => {
                        cy.get(
                            `.ag-pagination__buttons > :nth-child(${nextPaginationButtonIndex})`
                        ).as("nextPaginationButtonSelector");

                        if (perPageLimit < totalRecordCount) {
                            cy.get("@nextPaginationButtonSelector").should(
                                "be.enabled"
                            );
                        } else {
                            cy.get("@nextPaginationButtonSelector").should(
                                "be.disabled"
                            );
                        }
                    });
            });
        return this;
    }

    verifyRecordCountAndPageLimit() {
        cy.wait(3000);

        cy.get("div").then(($div) => {
            if ($div.find(".tableWrapper > .ag-table.default").length > 0) {
                cy.get("table>tbody")
                    .find("tr")
                    .then((recordsPerPageSelector) => {
                        cy.get(".ag-pagination__info.col-hr-2> strong")
                            .eq(1)
                            .invoke("text")
                            .then((perPageLimitSelector) => {
                                expect(recordsPerPageSelector.length).to.lte(
                                    parseInt(perPageLimitSelector)
                                );
                            });
                    });
            } else if ($div.find(".col-v-2.column.four.grid.ui").length > 0) {
                cy.get(".col-v-2.column.four.grid.ui")
                    .find(".column")
                    .as("recordsPerPageSelector");

                cy.get(".ag-pagination__select")
                    .invoke("val")
                    .as("selectedPaginatorLimitSelector");

                cy.get(".ag-pagination__info.col-hr-2> strong")
                    .eq(1)
                    .invoke("text")
                    .as("perPageLimitSelector");

                cy.get("@recordsPerPageSelector").then((recordsPerPage) => {
                    cy.get("@selectedPaginatorLimitSelector").then(
                        (selectedPaginatorLimit) => {
                            expect(recordsPerPage.length).to.lte(
                                parseInt(selectedPaginatorLimit)
                            );
                        }
                    );

                    cy.get("@perPageLimitSelector").then((perPageLimit) => {
                        expect(recordsPerPage.length).to.lte(
                            parseInt(perPageLimit)
                        );
                    });
                });
            }
        });

        return this;
    }

    selectPaginatorLimitAction(limit = "10") {
        cy.get(".ag-pagination__select")
            .select(limit)
            .should("have.value", limit);
    }

    selectPaginatorLimitAndVerifyItsExistence() {
        cy.get(".ag-pagination__select>option").each((limit, index) => {
            cy.wrap(limit)
                .invoke("val")
                .then((limitValue) => {
                    this.selectPaginatorLimitAction(limitValue);
                });
        });

        return this;
    }

    clickNextButtonInPaginatorUptoEnd() {
        const totalRecordCountIndex = 3;
        const perPageLimitIndex = 2;
        const nextPaginationButtonIndex = 2;

        cy.wait(2000);

        cy.get(
            `.ag-pagination__info.col-hr-2> strong:nth-of-type(${perPageLimitIndex})`
        )
            .invoke("text")
            .as("perPageLimit");

        cy.get(
            ` .ag-pagination__info.col-hr-2 > strong:nth-of-type(${totalRecordCountIndex})`
        )
            .invoke("text")
            .as("totalRecordCount");

        cy.get(".ag-pagination__select")
            .invoke("val")
            .then((selectedPaginatorLimit) => {
                const selectedPaginatorLimitValue = parseInt(
                    selectedPaginatorLimit
                );

                cy.get("@perPageLimit").then((perPageLimit) => {
                    cy.get("@totalRecordCount").then((totalRecordCount) => {
                        if (selectedPaginatorLimitValue < totalRecordCount) {
                            const nextPaginationButtonClickableCount =
                                Math.floor(totalRecordCount / perPageLimit);

                            for (
                                let i = nextPaginationButtonClickableCount;
                                i > 0;
                                i--
                            ) {
                                cy.get(
                                    `.ag-pagination__buttons > :nth-child(${nextPaginationButtonIndex})`
                                ).click();

                                this.verifyStateOfBackButtonInPaginator();

                                this.verifyStateOfNextButtonInPaginator();

                                this.verifyRecordCountAndPageLimit();
                            }
                        }
                        this.verifyStateOfNextButtonInPaginator();
                    });
                });
            });

        return this;
    }
}

export default Pagination_PO;
