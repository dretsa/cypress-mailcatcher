/// <reference types="cypress" />

export interface MailcatcherMessage {
    id: number;
    sender: string;
    recipients: string[];
    subject: string;
    size: string;
    created_at: string;
    // Present on the /messages/:id.json metadata endpoint.
    type?: string;
    formats?: string[];
    attachments?: MailcatcherAttachment[];
    source?: string;
}

export type MailcatcherFormat = 'json' | 'html' | 'plain' | 'source';

export interface MailcatcherAttachment {
    cid: string;
    type: string;
    filename: string;
    size: number;
    href: string;
}

// Read per-call so config set in the consumer's cypress config / beforeEach is honored.
const baseUrl = (): string => {
    const url = Cypress.env('mailcatcherUrl');
    if (!url) throw new Error('cypress-mailcatcher: env variable "mailcatcherUrl" is not set');
    return url;
};

// GET /messages — list all messages
Cypress.Commands.add('mailcatcherMessages', () =>
    cy.request<MailcatcherMessage[]>(`${baseUrl()}/messages`).its('body'),
);

// GET /messages/:id.:format — a single message in the requested format.
// 'json' yields metadata (MailcatcherMessage); the rest yield the raw body string.
Cypress.Commands.add('mailcatcherMessage', (id: number, format: MailcatcherFormat = 'json') =>
    cy.request(`${baseUrl()}/messages/${id}.${format}`).its('body'),
);

// GET /messages/:id/:cid — a single attachment by CID
Cypress.Commands.add('mailcatcherAttachment', (id: number, cid: string) =>
    cy.request<string>(`${baseUrl()}/messages/${id}/${cid}`).its('body'),
);

// DELETE /messages — delete all messages
Cypress.Commands.add('mailcatcherClear', () => {
    cy.request('DELETE', `${baseUrl()}/messages`);
});

// DELETE /messages/:id — delete a single message
Cypress.Commands.add('mailcatcherDelete', (id: number) => {
    cy.request('DELETE', `${baseUrl()}/messages/${id}`);
});

declare global {
    namespace Cypress {
        interface Chainable {
            /** Fetch all messages currently held by MailCatcher. */
            mailcatcherMessages(): Chainable<MailcatcherMessage[]>;

            /** Fetch a single message's metadata (`/messages/:id.json`). */
            mailcatcherMessage(id: number, format?: 'json'): Chainable<MailcatcherMessage>;
            /** Fetch a message's HTML, plain-text, or raw source body. */
            mailcatcherMessage(id: number, format: 'html' | 'plain' | 'source'): Chainable<string>;

            /** Fetch an attachment by CID (`/messages/:id/:cid`). */
            mailcatcherAttachment(id: number, cid: string): Chainable<string>;

            /** Delete all messages held by MailCatcher. */
            mailcatcherClear(): Chainable<void>;

            /** Delete a single message (`/messages/:id`). */
            mailcatcherDelete(id: number): Chainable<void>;
        }
    }
}
