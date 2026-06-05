/**
 * OAuth scopes the Gmail server needs. `https://mail.google.com/` is the full
 * mailbox scope, required for permanent delete (delete_message / delete_thread);
 * `settings.basic` covers filters, forwarding, vacation, and aliases.
 */
export const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.settings.basic',
];
