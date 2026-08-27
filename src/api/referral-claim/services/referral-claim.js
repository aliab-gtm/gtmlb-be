'use strict';

/**
 * referral-claim service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::referral-claim.referral-claim');
