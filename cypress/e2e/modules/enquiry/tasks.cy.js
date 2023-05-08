/// <reference types= "cypress" />

import faker from "@faker-js/faker";
import Enquiries_PO from "../../../support/pageObjects/enquiries_PO/Enquiries_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import LeadForms_PO from "../../../support/pageObjects/settings_PO/leadForms_PO/LeadForms_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";
import Task_PO from "../../../support/pageObjects/Task_PO";
import Faker_PO from "../../../support/faker/Faker_PO";

describe("Test for notes tab in enquiry module", () => {
    const homePage_PO = new HomePage_PO();
    const enquiries_PO = new Enquiries_PO();
    const settings_PO = new Setting_PO();
    const leadForms_PO = new LeadForms_PO();
    const task_PO = new Task_PO();
    const faker_PO = new Faker_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        cy.wait(5000);
    });

    context("Create lead form and task dependent test", () => {
        beforeEach(() => {
            const leadFormName = faker_PO.words();
            const firstName = faker_PO.firstName();
            const lastName = faker_PO.lastName();
            const taskTitle = faker_PO.words();
            const taskDescription = faker_PO.words();

            cy.wrap(taskTitle).as("taskTitle");
            cy.wrap(taskDescription).as("taskDescription");

            homePage_PO.clickOnSettingMenu();

            settings_PO.clickOnLeadForm();

            leadForms_PO
                .clickOnAddLeadFormButton()
                .fillLeadFormName(leadFormName)
                .selectRelatedOfficeName()
                .clickOnLeadFormSaveButton()
                .clickOnLeadFormUrl()
                .fillLeadFormElements(firstName, lastName);

            leadForms_PO.clickOnSubmitFormButton();

            cy.wait(2000);

            cy.go("back");

            cy.waitingForComponentToMount();

            homePage_PO.clickOnEnquiries();

            cy.wait(2000);

            enquiries_PO
                .clickOnFirstEnquiry()
                .clickOnTaskTab()
                .clickOnAddTaskButton();

            task_PO
                .typeTaskTitle(taskTitle)
                .typeDescription(taskDescription)
                .clickChooseCategory()
                .chooseCategory()
                .clickChoosePriority()
                .choosePriority()
                .clickOnCreateButton();

            cy.wait(4000);
        });

        it("Should verify added task", function () {
            task_PO
                .verifyTaskTitle(this.taskTitle)
                .verifyCategory()
                .verifyPriority()
                .verifyTaskStatus("Todo")
                .clickOnFirstTaskFromList()
                .verifyTaskTitleInDrawer(this.taskTitle)
                .clickOnCloseIcon();
        });

        it("Should edit task title, verify it in drawer and list", function () {
            const updatedTaskName = faker.random.words();

            task_PO
                .clickOnFirstTaskFromList()
                .editTaskTitleInDrawer(updatedTaskName)
                .verifyTaskTitleInDrawer(updatedTaskName)
                .clickOnCloseIcon()
                .verifyTaskTitle(updatedTaskName);
        });

        it("Should complete task and verify text completed", function () {
            task_PO.checkTheBox().verifyTaskStatus("Completed");
        });
    });
});