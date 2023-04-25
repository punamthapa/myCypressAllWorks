class SettingsDomainInformation_PO {
    clickOnDomainInformationMenu() {
        cy.get('[href="#/settings/preferences/account-information"]').click();
    }
}
export default SettingsDomainInformation_PO;
