'use strict';

/**
 * cashback-claim service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cashback-claim.cashback-claim');
