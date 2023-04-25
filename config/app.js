export const appConfig = {
    base_url: Cypress.env("APP_BASE_URL"),
    email: Cypress.env("APP_EMAIL"),
    password: Cypress.env("APP_PASSWORD"),
    server_domain: Cypress.env("SERVER_DOMAIN"),
    server_id: Cypress.env("SERVER_ID"),
};
