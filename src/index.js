'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // The website's contact form posts without auth — make sure the Public
    // role can create contact messages (create only; reads stay locked).
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    const action = 'api::contact-message.contact-message.create';
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
    }

    // Backfill slugs for blogs created before the slug field existed —
    // the website falls back to documentId URLs when slug is null.
    const slugify = require('./utils/slugify');
    const slugless = await strapi.db
      .query('api::blog.blog')
      .findMany({ where: { slug: null }, select: ['id', 'documentId', 'title'] });
    for (const b of slugless) {
      if (!b.title) continue;
      let slug = slugify(b.title) || b.documentId;
      const clash = await strapi.db
        .query('api::blog.blog')
        .findOne({ where: { slug, documentId: { $ne: b.documentId } } });
      if (clash) slug = `${slug}-${b.documentId.slice(0, 6)}`;
      await strapi.db.query('api::blog.blog').update({ where: { id: b.id }, data: { slug } });
    }
  },
};
