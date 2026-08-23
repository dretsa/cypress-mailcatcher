/// <reference types="cypress" />

export interface MailcatcherMessage {
    id: number;
    sender: string;
    recipients: string[];
    subject: string;
    size: string;
    created_at: string;
}

const BASE_URL = Cypress.expose('mailcatcherUrl');


Cypress.Commands.add('mailcatcherMessages', () =>
    cy
        .request<MailcatcherMessage[]>(`${BASE_URL}/messages`)
        .its('body'),
);

Cypress.Commands.add('mailcatcherClear', () => {
    cy.request('DELETE', `${BASE_URL}/messages`);
});

declare global {
    namespace Cypress {
        interface Chainable {
            /** Fetch all messages currently held by MailCatcher. */
            mailcatcherMessages(): Chainable<MailcatcherMessage[]>;

            /** Delete all messages held by MailCatcher. */
            mailcatcherClear(): Chainable<void>;
        }
    }
}
