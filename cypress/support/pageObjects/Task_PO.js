import Attachment_PO from "./Attachment_PO";

const attachment_PO = new Attachment_PO();
let category;
let priority;
let contactName;
let partnerName;

class Task_PO {
    clickOnCreateTaskButton() {
        cy.get(".blueButton").contains("Create Task").click({ force: true });

        return this;
    }

    typeTaskTitle(task) {
        cy.get("div[name='subject'] > input[type='text']").click().type(task);

        return this;
    }

    verifyTaskTitle(task) {
        cy.get(".ag-tasks .ag-space-between:nth-of-type(1)").should(
            "contain",
            task
        );

        return this;
    }

    clickChooseCategory() {
        cy.get("div[name='category'] > div[role='combobox'] ")
            .as("categoryDropdown")
            .click({ force: true });

        return this;
    }

    selectOption() {
        cy.get('[role="listbox"] > li')
            .as("dropdown")
            .then((count) => {
                const categoryIndex = Math.floor(Math.random() * count.length);

                cy.get("@dropdown").eq(categoryIndex).click();
            });
    }

    chooseCategory() {
        this.selectOption();

        cy.get("div[name='category'] > div[role='combobox'] ")
            .find("input")
            .invoke("val")
            .then((selectedDropdownValue) => {
                category = selectedDropdownValue;
            })
            .wait(1000);

        return this;
    }

    verifyCategory() {
        cy.wait(3000).then(() => {
            cy.get("section > div:nth-of-type(1) strong")
                .first()
                .invoke("text")
                .then((categoryValue) => {
                    const categoryIndex = categoryValue.replace(/:/g, "");

                    expect(categoryIndex.trim()).to.eq(category);
                });
        });

        return this;
    }

    typeDescription(description) {
        cy.get("div[name='description']")
            .find("textarea")
            .type(description)
            .wait(2000);
    }

    clickChoosePriority() {
        cy.get("div[name='priority'] > div[role='combobox']")
            .as("priorityDropdown")
            .click({
                force: true,
            });

        return this;
    }

    choosePriority() {
        this.selectOption();

        cy.get("div[name='priority'] > div[role='combobox']")
            .find("input")
            .invoke("val")
            .then((selectedDropdownValue) => {
                priority = selectedDropdownValue;
            })
            .wait(1000);

        return this;
    }

    verifyPriority(index = 3) {
        cy.wait(3000).then(() => {
            cy.get(
                `div:nth-of-type(1) >  .ag-task__content > div:nth-of-type(${index})`
            )
                .first()
                .invoke("text")
                .then((priorityIndex) => {
                    expect(priorityIndex.trim()).to.eq(priority);
                });
        });

        return this;
    }

    clickOnMoreOptionButton() {
        cy.get(".button").contains("More Options").click({ force: true });

        return this;
    }

    clickOnCreateButton() {
        cy.get(".blueButton").contains("Create").click({ force: true });

        cy.waitingForComponentToMount();

        return this;
    }

    clickOnFirstTaskFromList() {
        cy.get(".ag-tasks .ag-task__subject").eq(0).click({ force: true });

        return this;
    }

    clickOnContactRadioButton() {
        cy.get("input[value='client']").check();

        return this;
    }

    clickOnContactDropdown() {
        cy.get("div[name='clients'] > div[role='combobox']").click({
            force: true,
        });

        cy.wait(3000);

        return this;
    }

    selectRandomName() {
        cy.get("ul[role='listbox']>li")
            .as("dropdown")
            .then((count) => {
                const contactIndex = Math.floor(Math.random() * count.length);

                cy.get("@dropdown").eq(contactIndex).click({
                    force: true,
                });
            });

        return this;
    }

    selectContactName() {
        this.selectRandomName();

        cy.get("div[name='clients'] > div[role='combobox'] .truncate")
            .invoke("text")
            .then((selectedDropdownValue) => {
                contactName = selectedDropdownValue.replace(/\n/g, "").trim();
            });

        return this;
    }

    typeInCommentBox(comment) {
        cy.get("div[name='comment'] > textarea").type(comment);

        return this;
    }

    clickOnSaveButton() {
        cy.get(".blueButton").contains("Save").click({ force: true });

        cy.wait(2000);

        return this;
    }

    verifyContactInList() {
        cy.get("section > div > div:nth-of-type(1) span:nth-of-type(2)")
            .invoke("text")
            .then((name) => {
                cy.wrap(contactName).should("contain", name.trim());
            });

        return this;
    }

    verifyContactInDrawer() {
        cy.wait(3000).then(() => {
            cy.get(".ag-flex-1.related-to-label")
                .invoke("text")
                .then((name) => {
                    cy.wrap(name.replace(/\n/g, "").trim()).should(
                        "contain",
                        contactName
                    );
                });
        });

        return this;
    }

    verifyCommentInDrawer(comment) {
        cy.get(".task-log-item .task-activity-block")
            .eq(0)
            .invoke("text")
            .then((commentInLog) => {
                expect(commentInLog.trim()).eq(comment);
            });

        return this;
    }

    sortByCreatedDate() {
        cy.get(".ag-flex-1.col-hr-2")
            .select("Created Date")
            .should("have.value", "created_at");

        cy.wait(2000);

        cy.get(".button.col-hr-2").click({ force: true }).wait(2000);

        return this;
    }

    verifyTaskTitleInDrawer(taskName) {
        cy.get(".task-detail-heading > p").should("contain", taskName);

        return this;
    }

    clickOnCloseIcon() {
        cy.get(".ag-drawer__close-icon").eq(1).click({ force: true });

        return this;
    }

    editTaskTitleInDrawer(taskName) {
        cy.get(".task-detail-heading > p").click({ force: true });
        cy.get(".ag-flex-1.form.ui > .editable-input").clear().type(taskName);
        cy.get(".task-detail-wrapper").click({ force: true });

        return this;
    }

    verifyDescriptionInDrawer(description) {
        cy.get("p.pre-line").should("contain", description);

        return this;
    }

    addAttachmentFromDevice() {
        const numberOfAttachments = 3;

        attachment_PO.attachDeviceAttachment(numberOfAttachments);

        return this;
    }

    verifyAddedAttachment() {
        let fileCountBeforeSaving;

        cy.get(".ag-align-center.text-semi-light-grey")
            .invoke("text")
            .then((drawerAttachment) => {
                fileCountBeforeSaving = drawerAttachment.split("files")[0];

                this.clickOnCreateButton();
                this.sortByCreatedDate();

                cy.wait(2000);

                this.clickOnFirstTaskFromList();

                cy.get(".col-v-4 > .three.ui> div").then((count) => {
                    const fileCountAfterSaving = count.length;

                    expect(parseInt(fileCountBeforeSaving)).to.eq(
                        fileCountAfterSaving
                    );
                });
            });

        return this;
    }

    clickOnPartnerRadioButton() {
        cy.get("input[value='partner']").check();

        return this;
    }

    clickOnPartnerDropdown() {
        cy.get("div[name='partners'] > div[role='combobox']").click({
            force: true,
        });

        cy.wait(3000);

        return this;
    }

    selectPartnerName() {
        this.selectRandomName();

        cy.get("div[name='partners'] > div[role='combobox'] .truncate")
            .invoke("text")
            .then((selectedDropdownValue) => {
                partnerName = selectedDropdownValue.replace(/\n/g, "").trim();
            });

        return this;
    }

    verifyPartnerInList() {
        cy.get(" .related-to-container .truncate")
            .first()
            .invoke("text")
            .then((partnerIndex) => {
                cy.wrap(partnerName).should("contain", partnerIndex.trim());
            });

        return this;
    }

    verifyPartnerInDrawer() {
        cy.wait(3000).then(() => {
            cy.get(".related-to-item")
                .first()
                .invoke("text")
                .then((partnerIndex) => {
                    cy.wrap(partnerIndex.replace(/\n/g, "").trim()).should(
                        "contain",
                        partnerName
                    );
                });
        });

        return this;
    }
}

export default Task_PO;
