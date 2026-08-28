'use strict';

const crypto = require('node:crypto');

/**
 * Desk-issued invites.
 *
 * The desk creates a portal account once a client has a trading account, with
 * the MT5 number already attached. That is the whole point: ownership is
 * established by the desk, not asserted by whoever fills in a form, so there is
 * no "is this account really yours?" queue to work through.
 *
 * On create we mint a single-use invite token, store the link on the record,
 * and email it. **The link is stored whether or not the email goes out.** Mail
 * fails for boring reasons — no SMTP configured yet, a typo'd address, a relay
 * refusing — and a client waiting on a link that silently vanished is worse
 * than a desk that has to paste one. `inviteEmailError` says what went wrong.
 */

const INVITE_TTL_DAYS = 14;

function portalBase(strapi) {
  return (
    process.env.PORTAL_URL ||
    process.env.SITE_URL ||
    'https://gtmlb.com'
  ).replace(/\/$/, '');
}

async function sendInvite(strapi, account, url) {
  const name = (account.name || '').trim().split(/\s+/)[0] || 'there';
  await strapi.plugin('email').service('email').send({
    to: account.email,
    subject: 'Your GTM rewards account',
    text:
      `Hi ${name},\n\n` +
      `Your GTM rewards account is ready. Open the link below to choose a ` +
      `password, then you can see the cashback you earn on your trading.\n\n` +
      `${url}\n\n` +
      `The link works once and expires in ${INVITE_TTL_DAYS} days. If it has ` +
      `expired, message us and we will send a new one.\n\n` +
      `If you were not expecting this, ignore it — nothing has been set up ` +
      `against your name.\n\n` +
      `Global Trade Market`,
  });
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Only mint an invite for an account the client has not set up yet.
    // (linkStatus is set in afterCreate — the schema default is applied after
    // this hook, so setting it here would be overwritten.)
    if (!data.passwordHash) {
      data.inviteToken = crypto.randomBytes(32).toString('hex');
      data.inviteExpiresAt = new Date(
        Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString();
    }
  },

  async afterCreate(event) {
    const account = event.result;
    if (!account?.inviteToken || !account?.email) return;

    const url = `${portalBase(strapi)}/portal/invite?token=${account.inviteToken}`;

    // Store the link first — it must survive a failed send. The desk attached
    // the MT5 number when they created this, so ownership is already
    // established: approve the link here rather than leaving it in a queue
    // nobody needs to work.
    try {
      await strapi.db.query('api::portal-account.portal-account').update({
        where: { id: account.id },
        data: { inviteUrl: url, linkStatus: 'approved' },
      });
    } catch (err) {
      strapi.log.error(`[portal-invite] could not store invite url: ${err.message}`);
    }

    try {
      await sendInvite(strapi, account, url);
      await strapi.db.query('api::portal-account.portal-account').update({
        where: { id: account.id },
        data: { inviteSentAt: new Date().toISOString(), inviteEmailError: null },
      });
      strapi.log.info(`[portal-invite] sent to ${account.email}`);
    } catch (err) {
      const reason = String(err?.message || err).slice(0, 240);
      strapi.log.warn(
        `[portal-invite] email to ${account.email} failed: ${reason} — ` +
        `the link is on the record, send it by hand`,
      );
      await strapi.db.query('api::portal-account.portal-account').update({
        where: { id: account.id },
        data: { inviteEmailError: reason },
      }).catch(() => {});
    }
  },
};
