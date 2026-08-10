'use strict';

/**
 * Guarantee every blog has a slug. The admin UI auto-fills the uid from the
 * title, but API writes (and posts created before the slug field existed)
 * can leave it null — and the website then falls back to documentId URLs.
 */
const slugify = require('../../../../utils/slugify');

// ponytail: title collisions are left to Strapi's own uid uniqueness
// validation; add a dedup suffix here if duplicate titles become a thing.
const ensureSlug = (data) => {
  if (data && !data.slug && data.title) data.slug = slugify(data.title);
};

module.exports = {
  beforeCreate(event) {
    ensureSlug(event.params.data);
  },
  beforeUpdate(event) {
    ensureSlug(event.params.data);
  },
};
