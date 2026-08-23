/// <reference types="cypress" />

export interface MailcatcherMessage {
    id: number;
    sender: string;
    recipients: string[];
    subject: string;
    size: string;
    created_at: string;
}

// Read per-call so config set in the consumer's cypress config / beforeEach is honored.
const baseUrl = (): string => {
    const url = Cypress.env('mailcatcherUrl');
    if (!url) throw new Error('cypress-mailcatcher: env variable "mailcatcherUrl" is not set');
    return url;
};

Cypress.Commands.add('mailcatcherMessages', () =>
    cy
        .request<MailcatcherMessage[]>(`${baseUrl()}/messages`)
        .its('body'),
);

Cypress.Commands.add('mailcatcherClear', () => {
    cy.request('DELETE', `${baseUrl()}/messages`);
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
