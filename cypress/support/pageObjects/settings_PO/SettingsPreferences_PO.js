class SettingsPreferences_PO {
    clickOnPreferencesMenu() {
        cy.get('[href="#/settings/preferences"]').click();
    }
}
export default SettingsPreferences_PO;
