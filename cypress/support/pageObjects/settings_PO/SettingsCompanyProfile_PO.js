class SettingsCompanyProfile_PO {
    clickOnCompanyProfileMenu() {
        cy.get('[href="#/settings/preferences/company-profile"]').click();
    }
}
export default SettingsCompanyProfile_PO;
