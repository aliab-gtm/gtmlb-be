/**
 * Seeds the Contact Page single type (en + ar).
 *
 *   node scripts/seed-contact.js
 *
 * Labels come from `messages/{en,ar}.json`; the contact details themselves
 * mirror `lib/site.ts`. The form's own labels stay in the messages files.
 */
'use strict';

const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const FE_DIR = process.env.FE_DIR || path.resolve(__dirname, '..', '..', 'gtmlb-fe');
const UID = 'api::contact-page.contact-page';

const en = require(path.join(FE_DIR, 'messages', 'en.json'));
const ar = require(path.join(FE_DIR, 'messages', 'ar.json'));

/** lib/site.ts */
const SITE = {
  email: 'info@gtmlb.com',
  phone: '+961 78 78 97 67',
  phoneRaw: '96178789767',
  address: 'Rive Gauche Tower, Achrafieh, Beirut, Lebanon',
};

function buildData(m) {
  return {
    seo: { metaTitle: `${m.contact.title} | GTM`, metaDescription: m.contact.subtitle },
    header: { eyebrow: 'Get in touch', title: m.contact.title, subtitle: m.contact.subtitle },
    cards: [
      { icon: 'Mail', label: m.contact.email, value: SITE.email, href: `mailto:${SITE.email}` },
      { icon: 'Phone', label: m.contact.phone, value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
      { icon: 'MapPin', label: m.contact.address, value: SITE.address },
      { icon: 'Clock', label: m.contact.hours, value: m.contact.hoursValue },
    ],
    whatsappCta: { label: 'WhatsApp' },
  };
}

(async () => {
  const strapi = await createStrapi(await compileStrapi()).load();
  const docs = strapi.documents(UID);

  const existing = await docs.findFirst({ locale: 'en' });
  const doc = existing
    ? await docs.update({ documentId: existing.documentId, locale: 'en', data: buildData(en) })
    : await docs.create({ locale: 'en', data: buildData(en) });
  await docs.publish({ documentId: doc.documentId, locale: 'en' });
  console.log(`Seeded en (documentId ${doc.documentId})`);

  await docs.update({ documentId: doc.documentId, locale: 'ar', data: buildData(ar) });
  await docs.publish({ documentId: doc.documentId, locale: 'ar' });
  console.log('Seeded ar');

  await strapi.destroy();
  process.exit(0);
})().catch((e) => {
  console.error('SEED FAILED:', e);
  process.exit(1);
});
