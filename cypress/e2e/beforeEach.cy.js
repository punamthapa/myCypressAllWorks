/// <reference types="Cypress" />

import { config } from "../../config";

describe("Verify environment setup", () => {
    it("If env variables are set", () => {
        Object.values(config.app).forEach((value) => {
            expect(value).is.not.empty;
        });
    });

    it("If url has proper protocol", () => {
        expect(config.app.base_url).to.satisfy((string) =>
            ["http://", "https://"].some((protocol) =>
                string.startsWith(protocol)
            )
        );
    });
});
