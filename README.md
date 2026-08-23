# @dretsa/cypress-mailcatcher

Cypress commands for asserting on emails caught by [MailCatcher](https://mailcatcher.me/).

Adds `cy.mailcatcher*` commands that talk to MailCatcher's HTTP API so your
end-to-end tests can read, assert on, and clear sent emails.

## Install

```sh
npm install --save-dev @dretsa/cypress-mailcatcher
# or
pnpm add -D @dretsa/cypress-mailcatcher
```

Requires Cypress `>=12` (declared as a peer dependency).

## Setup

**1. Register the commands** in your support file
(`cypress/support/e2e.js` or `.ts`):

```js
import '@dretsa/cypress-mailcatcher';
```

**2. Point it at your MailCatcher** via the `mailcatcherUrl` Cypress env
variable — this is the base URL of the MailCatcher web interface (default port
`1080`). The commands **throw** if it isn't set.

`cypress.config.ts`:

```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    mailcatcherUrl: 'http://localhost:1080',
  },
});
```

Or override per run without touching config:

```sh
npx cypress run --env mailcatcherUrl=http://localhost:1080
# or via environment variable
CYPRESS_mailcatcherUrl=http://localhost:1080 npx cypress run
```

## Usage

Cypress commands are queued, not promises — read their yielded value with
`.then()` or assert on it directly with `.should()`.

```js
// Start each test with an empty inbox
beforeEach(() => {
  cy.mailcatcherClear();
});

it('sends a welcome email', () => {
  cy.get('[data-cy=signup]').click();

  // Wait for the message to arrive, then assert on it
  cy.mailcatcherMessages().should('have.length', 1);

  cy.mailcatcherMessages().then((messages) => {
    const id = messages[0].id;

    expect(messages[0].subject).to.eq('Welcome!');
    expect(messages[0].recipients).to.include('<user@example.com>');

    // Assert on the HTML body
    cy.mailcatcherMessage(id, 'html').should('contain', 'Confirm your email');
  });
});
```

## Commands

| Command | MailCatcher endpoint | Yields |
| --- | --- | --- |
| `cy.mailcatcherMessages()` | `GET /messages` | `MailcatcherMessage[]` |
| `cy.mailcatcherMessage(id)` | `GET /messages/:id.json` | `MailcatcherMessage` (metadata) |
| `cy.mailcatcherMessage(id, 'html')` | `GET /messages/:id.html` | `string` (HTML body) |
| `cy.mailcatcherMessage(id, 'plain')` | `GET /messages/:id.plain` | `string` (plain-text body) |
| `cy.mailcatcherMessage(id, 'source')` | `GET /messages/:id.source` | `string` (raw source) |
| `cy.mailcatcherAttachment(id, cid)` | `GET /messages/:id/:cid` | `string` (attachment) |
| `cy.mailcatcherClear()` | `DELETE /messages` | `void` |
| `cy.mailcatcherDelete(id)` | `DELETE /messages/:id` | `void` |

## TypeScript

Types (including the `cy.mailcatcher*` command augmentations) ship with the
package and load automatically via the `import` in your support file. The
exported types `MailcatcherMessage`, `MailcatcherAttachment`, and
`MailcatcherFormat` are available if you need them:

```ts
import type { MailcatcherMessage } from '@dretsa/cypress-mailcatcher';
```

## License

MIT
