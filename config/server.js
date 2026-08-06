module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Public origin when served behind the reverse proxy in production,
  // e.g. https://cms.gtmlb.com. Unset in local dev.
  url: env('PUBLIC_URL'),
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
