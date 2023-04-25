/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import Task_PO from "../../../support/pageObjects/Task_PO";

describe("Test for task related to partner", function () {
    const task_PO = new Task_PO();
    const homePage_PO = new HomePage_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnTaskModule();
    });

    context("Add task dependent tests", function () {
        beforeEach(function () {
            const taskTitle = faker.random.words();
            const taskDescription = faker.random.words();

            cy.wrap(taskTitle).as("taskTitle");
            cy.wrap(taskDescription).as("taskDescription");

            task_PO
                .clickOnCreateTaskButton()
                .typeTaskTitle(taskTitle)
                .clickChooseCategory()
                .chooseCategory()
                .clickChoosePriority()
                .choosePriority()
                .clickOnMoreOptionButton()
                .typeDescription(taskDescription);
        });

        it("Should add task with attachment and verify it", function () {
            task_PO
                .addAttachmentFromDevice()
                .verifyAddedAttachment()
                .clickOnCloseIcon();
        });

        context(
            "Add task related to Partner and sort by 'Created Date' filter dependent test",
            function () {
                beforeEach(function () {
                    task_PO
                        .clickOnPartnerRadioButton()
                        .clickOnPartnerDropdown()
                        .selectPartnerName()
                        .clickOnCreateButton()
                        .sortByCreatedDate();
                });

                it("Should verify title, partner name, category in list ,and title, description, partner in drawer", function () {
                    task_PO
                        .verifyTaskTitle(this.taskTitle)
                        .verifyCategory()
                        .verifyPriority(4)
                        .verifyPartnerInList()
                        .clickOnFirstTaskFromList()
                        .verifyTaskTitleInDrawer(this.taskTitle)
                        .verifyDescriptionInDrawer(this.taskDescription)
                        .verifyPartnerInDrawer()
                        .clickOnCloseIcon();
                });

                it("Should edit task title and verify it in drawer and list", function () {
                    const updatedTaskName = faker.random.words();

                    task_PO
                        .clickOnFirstTaskFromList()
                        .editTaskTitleInDrawer(updatedTaskName)
                        .verifyTaskTitleInDrawer(updatedTaskName)
                        .clickOnCloseIcon()
                        .sortByCreatedDate()
                        .verifyTaskTitle(updatedTaskName);
                });

                it("Should add comments and verify it in drawer", function () {
                    const comment = faker.random.words();

                    task_PO
                        .clickOnFirstTaskFromList()
                        .typeInCommentBox(comment)
                        .clickOnSaveButton()
                        .verifyCommentInDrawer(comment)
                        .clickOnCloseIcon();
                });
            }
        );
    });
});
