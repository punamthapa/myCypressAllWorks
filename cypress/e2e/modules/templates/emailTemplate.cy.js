/// <reference types= "cypress" />
import faker from "@faker-js/faker";
import Attachment_PO from "../../../support/pageObjects/Attachment_PO";
import HomePage_PO from "../../../support/pageObjects/HomePage_PO";
import EmailTemplates_PO from "../../../support/pageObjects/settings_PO/templates_PO/EmailTemplates_PO";
import Setting_PO from "../../../support/pageObjects/Setting_PO";
import AgDrawer_PO from "../../../support/pageObjects/utilities/AgDrawer_PO";

const emailTitle = faker.random.words();
const emailSubject = faker.lorem.sentence();
const emailBody = faker.lorem.paragraph();

const placeholderInSubjectSelector =
    "div[name='subject']  .ag-flex.ql-snow.ql-toolbar  .ql-picker-options>.ql-picker-item";
const placeholderInBodySelector =
    "div[name='content']  .ag-flex.ql-snow.ql-toolbar  .ql-picker-options>.ql-picker-item";

describe("Test in email template inside settings", () => {
    const homePage_PO = new HomePage_PO();
    const setting_PO = new Setting_PO();
    const emailTemplates_PO = new EmailTemplates_PO();
    const agDrawer_PO = new AgDrawer_PO();
    const attachment_PO = new Attachment_PO();

    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.preserveAppCookie();

        homePage_PO.clickOnSettingMenu();
        setting_PO.clickOnTemplateMenu();

        cy.wait(3000);
    });

    it("Should verify paginator", () => cy.verifyPaginator());

    it("Should verify if 'Add Email Template' drawer contains 'Add Email Template' as title, 'Title', 'Subject','Body' , Attachments' section, 'Save' and 'Cancel' button", () => {
        cy.clickOnAddButton();

        agDrawer_PO
            .verifyExistenceOfAgDrawer()
            .verifyExistenceOfAgDrawerTitle("Add Email Template");

        cy.get(".ag-drawer")
            .find("form>div")
            .first()
            .should("contain.text", "Title")
            .next()
            .should("contain.text", "Subject")
            .next()
            .should("contain.text", "Body")
            .next()
            .should("contain.text", "Attachments")
            .next()
            .first()
            .should("contain.text", "Cancel")
            .last()
            .should("contain.text", "Save");
    });

    it("Should show proper validation error if email template is saved without mandatory fields", () => {
        cy.clickOnAddButton();

        emailTemplates_PO.clickOnSaveButton().checkEmptyValidationErrors();
    });

    // todo reverify it
    // it("Should show proper validation error if email template is saved without mandatory fields and remove validation error from title and subject section when we add title, subject and save it", () => {
    //     cy.clickOnAddButton();
    //
    //     emailTemplates_PO.clickOnSaveButton().checkEmptyValidationErrors();
    //
    //     cy.get(".ag-drawer")
    //         .find("form>div")
    //         .first()
    //         .type(emailTitle)
    //         .next()
    //         .find("p")
    //         .type(emailSubject);
    //
    //     emailTemplates_PO
    //         .clickOnSaveButton()
    //         .checkValidationErrorExistence(
    //             "div[name='title'] > .ui.basic.js-input-error"
    //         )
    //         .checkValidationErrorExistence(
    //             "div[name='subject'] > .ui.basic.js-input-error"
    //         );
    // });

    it("Should add all mandatory fields in email template, click on 'Cancel' button, verify if the drawer is closed and email template is not added", () => {
        cy.clickOnAddButton();

        agDrawer_PO.verifyExistenceOfAgDrawer();

        emailTemplates_PO.fillAllFormElement(
            emailTitle,
            emailSubject,
            emailBody
        );

        cy.get(".ag-justify-end > .defaultButton")
            .as("drawerCancelButton")
            .click();

        agDrawer_PO.verifyExistenceOfAgDrawer(false);

        emailTemplates_PO.verifyEmailTitleSubjectBodyExistenceOfFirstEntry(
            "not.contain",
            emailTitle,
            emailSubject,
            emailBody
        );
    });

    it("Should add email template and verify its existence with added 'Title','Subject' and 'Body' section and verify the updated entries count.", () => {
        let totalRecordCount = 0;

        cy.get(".ag-pagination__info.col-hr-2 > strong")
            .last()
            .then((totalRecordCountSelector) => {
                totalRecordCount = parseInt(totalRecordCountSelector.text());
            });

        cy.clickOnAddButton();

        emailTemplates_PO
            .fillAllFormElement(emailTitle, emailSubject, emailBody)
            .clickOnSaveButton();

        cy.wait(3000);

        emailTemplates_PO.verifyEmailTitleSubjectBodyExistenceOfFirstEntry(
            "contain.text",
            emailTitle,
            emailSubject,
            emailBody
        );

        // todo can be added to pagination po and name it as getTotalEntriesCount() and simply call it in every place
        cy.get(".ag-pagination__info.col-hr-2 > strong")
            .last()
            .invoke("text")
            .then((totalRecordCountAfterAdding) => {
                expect(parseInt(totalRecordCountAfterAdding)).to.eq(
                    totalRecordCount + 1
                );
            });
    });

    it("Should verify existence of 'Edit Email Template' drawer and its title after clicking on 'Edit' button", () => {
        emailTemplates_PO.clickOnTemplateButton(
            "button[title='Edit Email Template']"
        );

        agDrawer_PO
            .verifyExistenceOfAgDrawer()
            .verifyExistenceOfAgDrawerTitle("Edit Email Template");
    });

    it("Should edit email template and verify edited fields", () => {
        const updatedEmailTitle = faker.random.words();
        const updatedEmailSubject = faker.lorem.sentence();
        const updatedEmailBody = faker.lorem.paragraph();

        // @todo can be wrapped into some function like click on edit button of first entry.
        // @todo this action is repeated so many times. So can be wrapped into such small actions
        emailTemplates_PO.clickOnTemplateButton(
            "button[title='Edit Email Template']"
        );

        cy.wait(3000)
            .get("input[name=title]")
            .clear()
            .type(updatedEmailTitle)
            .get("div[name='subject'] .ql-editor")
            .clear()
            .type(updatedEmailSubject)
            .get("div[name='content'] .ql-editor")
            .clear()
            .type(updatedEmailBody);

        emailTemplates_PO
            .clickOnSaveButton()
            .verifyEmailTitleSubjectBodyExistenceOfFirstEntry(
                "contain",
                updatedEmailTitle,
                updatedEmailSubject,
                updatedEmailBody
            );
    });

    it("Should verify text in title,subject and body when editing email template", () => {
        cy.get(".ui.col-v-2>.column")
            .first()
            .find(".content")
            .then((emailTemplateSelector) => {
                cy.wrap(emailTemplateSelector)
                    .eq(0)
                    .invoke("text")
                    .then((titleSelector) => {
                        cy.wrap(emailTemplateSelector)
                            .eq(1)
                            .invoke("text")
                            .then((subjectSelector) => {
                                cy.wrap(emailTemplateSelector)
                                    .eq(2)
                                    .invoke("text")
                                    .then((bodySelector) => {
                                        emailTemplates_PO
                                            .clickOnTemplateButton(
                                                "button[title='Edit Email Template']"
                                            )
                                            .verifyTextInEmailTemplateDrawer(
                                                "div[name='title']>input",
                                                "val",
                                                titleSelector.trim()
                                            )
                                            .verifyTextInEmailTemplateDrawer(
                                                "div[name='subject'] .ql-editor> p",
                                                "text",
                                                subjectSelector.trim()
                                            )
                                            .verifyTextInEmailTemplateDrawer(
                                                "div[name='content'] .ql-editor> p",
                                                "text",
                                                bodySelector.trim()
                                            );
                                    });
                            });
                    });
            });
    });

    it("Should add email template, delete it and verify if it is deleted", () => {
        const newEmailTitle = faker.random.words();
        const newEmailSubject = faker.lorem.sentence();
        const newEmailBody = faker.lorem.paragraph();
        let totalRecordCount = 0;

        cy.clickOnAddButton();

        emailTemplates_PO
            .fillAllFormElement(newEmailTitle, newEmailSubject, newEmailBody)
            .clickOnSaveButton();

        cy.wait(3000);

        emailTemplates_PO.verifyEmailTitleSubjectBodyExistenceOfFirstEntry(
            "contain",
            newEmailTitle,
            newEmailSubject,
            newEmailBody
        );

        cy.get(".ag-pagination__info.col-hr-2 > strong")
            .last()
            .then((totalRecordCountSelector) => {
                totalRecordCount = parseInt(totalRecordCountSelector.text());
            });

        emailTemplates_PO
            .clickOnTemplateButton("button[title='Delete Email Template']")
            .clickOnAcceptButtonInAgModal();

        cy.wait(2000);

        emailTemplates_PO.verifyEmailTitleSubjectBodyExistenceOfFirstEntry(
            "not.contain",
            newEmailTitle,
            newEmailSubject,
            newEmailBody
        );

        cy.get(".ag-pagination__info.col-hr-2 > strong")
            .last()
            .invoke("text")
            .then((totalRecordCountAfterDeleting) => {
                expect(parseInt(totalRecordCountAfterDeleting)).to.eq(
                    totalRecordCount - 1
                );
            });
    });

    it("Should verify if placeholders of 'Subject' and 'Body' section contains all 13 placeholders", () => {
        cy.clickOnAddButton();

        emailTemplates_PO
            .verifyPlaceholderNames(placeholderInSubjectSelector)
            .verifyPlaceholderNames(placeholderInBodySelector);
    });

    it("Should create email template with placeholder in subject and body, and  verify it", () => {
        const subjectTextBoxSelector =
            "div[name='subject'] .ql-editor> p .ql-placeholder-content";
        const bodyTextBoxSelector =
            "div[name='content'] .ql-editor> p .ql-placeholder-content";
        const subjectSectionIndex = 1;
        const bodySectionIndex = 2;

        cy.clickOnAddButton()
            .wait(3000)
            .get(".ag-drawer")
            .find("form>div")
            .first()
            .type(emailTitle);

        emailTemplates_PO
            .selectPlaceholdersAndVerify(
                placeholderInSubjectSelector,
                subjectTextBoxSelector
            )
            .selectPlaceholdersAndVerify(
                placeholderInBodySelector,
                bodyTextBoxSelector
            )
            .clickOnSaveButton();

        cy.wait(3000);

        emailTemplates_PO
            .verifyPlaceholderContentInCard(subjectSectionIndex)
            .verifyPlaceholderContentInCard(bodySectionIndex);
    });

    it("Should show proper validation error if existed email template is edited with mandatory fields empty and saved", () => {
        emailTemplates_PO
            .clickOnTemplateButton("button[title='Edit Email Template']")
            .clearAllFields()
            .clickOnSaveButton()
            .checkEmptyValidationErrors();
    });

    it("Should add email template with attachment and verify the count of attachment in email template list", () => {
        let fileCountBeforeSaving;

        cy.clickOnAddButton();

        emailTemplates_PO
            .fillAllFormElement(emailTitle, emailSubject, emailBody)
            .attachAttachmentFromDevice(7);

        cy.get(".ag-align-center.text-semi-light-grey")
            .invoke("text")
            .then((drawerAttachment) => {
                fileCountBeforeSaving = drawerAttachment.split("files")[0];

                emailTemplates_PO.clickOnSaveButton();

                cy.wait(3000);

                emailTemplates_PO.verifyAttachmentsCount(fileCountBeforeSaving);
            });
    });

    it("Should delete the added attachment and compare the attachment count", () => {
        let fileCountBeforeSaving;
        cy.clickOnAddButton();

        emailTemplates_PO
            .fillAllFormElement(emailTitle, emailSubject, emailBody)
            .attachAttachmentFromDevice(7);

        emailTemplates_PO.clickOnSaveButton();
        cy.wait(3000);

        emailTemplates_PO.clickOnTemplateButton(
            "button[title='Edit Email Template']"
        );

        attachment_PO.removeUploadedDocument(6);
        cy.get(".ag-align-center.text-semi-light-grey")
            .invoke("text")
            .then((drawerAttachment) => {
                fileCountBeforeSaving = drawerAttachment.split("files")[0];

                emailTemplates_PO.clickOnSaveButton();
                cy.wait(4000);
                emailTemplates_PO.verifyAttachmentsCount(fileCountBeforeSaving);
            });
    });
});
