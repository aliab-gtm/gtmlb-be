'use strict';

const { errors } = require('@strapi/utils');

/**
 * A claim may only be resolved once.
 *
 * `rejected` releases what the claim was holding — a cashback claim gives its
 * lots back, a referral claim frees its tier — so flipping an already-**paid**
 * claim to rejected lets the same volume, or the same tier, be claimed and paid
 * a second time. The client portal enforces this on its own endpoints; this
 * hook is what stops it happening by hand in the Strapi admin, which is now the
 * only place claims are reviewed.
 *
 * To genuinely reverse a settled claim, change `status` back to `pending`
 * first — that is a deliberate two-step, and it leaves a trail in updatedBy.
 */
const SETTLED = ['paid', 'rejected'];

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (!data || typeof data.status === 'undefined') return;

    const id = where?.id ?? where?.documentId;
    if (!id) return;

    const current = await strapi.db
      .query(event.model.uid)
      .findOne({ where, select: ['status'] });
    if (!current) return;

    // Settling something already settled — the dangerous direction.
    if (SETTLED.includes(current.status) && SETTLED.includes(data.status)) {
      // ApplicationError, not Error: Strapi renders this message to the
      // reviewer. A bare Error becomes an opaque 500 and they learn nothing.
      throw new errors.ApplicationError(
        `This claim was already marked "${current.status}". Reversing it would ` +
        `release what it is holding and allow a second payout. Set it back to ` +
        `"pending" first if you really mean to reopen it.`
      );
    }
  },
};
