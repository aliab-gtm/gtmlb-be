/**
 * Seeds the Home Page single type (en + ar) from the frontend's own content.
 *
 *   node scripts/seed-home.js
 *
 * Section copy comes from the frontend `messages/{en,ar}.json`; the card/list
 * data and image paths mirror `src/lib/content.ts`. Re-running is safe: images
 * are matched by filename and the single type is updated in place.
 *
 * Set FE_DIR if the frontend is not a sibling of this repo.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const FE_DIR = process.env.FE_DIR || path.resolve(__dirname, '..', '..', 'gtmlb-fe');
const UID = 'api::home-page.home-page';

const en = require(path.join(FE_DIR, 'messages', 'en.json'));
const ar = require(path.join(FE_DIR, 'messages', 'ar.json'));

/** Eyebrows are hardcoded in the frontend page, not in messages. */
const EYEBROW = { features: 'Why GTM', services: 'Markets', steps: 'Get started', blog: 'Blog' };

/** Keyword rail from components/Hero.tsx. */
const MARQUEE = [
  '0% Commission',
  'Fixed Spreads',
  'MT5',
  'Instant Deposits',
  '24/7 Desk',
  'Whish · OMT · USDT',
  'Beirut Based',
];

/** lib/content.ts → features */
const FEATURES = [
  { icon: 'Zap', title: '0% Commission', text: 'Trade with zero commissions and fixed spreads — no surprises on your P&L.' },
  { icon: 'Headset', title: '24/7 Support Desk', text: 'A real Beirut-based team on WhatsApp and Telegram, whenever the markets move.' },
  { icon: 'Globe2', title: 'Local + Digital Cashouts', text: '$2M+ moved monthly through Whish, OMT, USDT and bank transfer.' },
  { icon: 'ShieldCheck', title: 'BBCorp Partnership', text: 'Regulated broker access with 95% instant deposits and secure fund handling.' },
];

/** lib/content.ts → steps */
const STEPS = [
  { title: 'Talk to the desk', text: 'Message us on WhatsApp or fill the form. We answer fast and set you up.' },
  { title: 'Open your MT5 account', text: 'Get your BBCorp trading account with 0% commission, usually within a day.' },
  { title: 'Fund & trade', text: 'Deposit via Whish, OMT or USDT — 95% land instantly — and start trading.' },
];

/** lib/content.ts → payMethods, with the how-text pulled from messages. */
const PAY_METHODS = [
  { key: 'whish', name: 'Whish', tagline: 'Instant local cashout', speed: 'Instant', logo: 'assets/pay/whish-money-logo.jpeg', how: 'howWhish' },
  { key: 'usdt', name: 'USDT Tether', tagline: 'Digital stablecoin route', speed: '~Minutes', logo: 'assets/pay/usdt-tether-logo.svg', how: 'howUsdt' },
  { key: 'omt', name: 'OMT', tagline: 'Cash pickup network', speed: 'Same day', logo: 'assets/pay/omt-logo.svg', how: 'howOmt' },
];

/** lib/content.ts → clients */
const CLIENTS = [
  { name: 'Ali Makki', photo: 'assets/clients/ali-150x150.webp', location: 'Beirut', quote: 'Fast Whish cashout every single time. Real people on WhatsApp.' },
  { name: 'Charbel Khoury', photo: 'assets/clients/charbel-150x150.webp', location: 'Jounieh', quote: 'Zero commission is real and spreads stay tight on news.' },
  { name: 'Sarah Abdo', photo: 'assets/clients/sar-204x300.webp', location: 'Saida', quote: 'The desk walked me through my first trade. Deposits are instant.' },
  { name: 'Samir Abdallah', photo: 'assets/clients/samir-150x150.webp', location: 'Tripoli', quote: 'USDT in, USDT out, no delays. Finally a broker I trust locally.' },
  { name: 'Mohamad Hasan', photo: 'assets/clients/mohamad-hasan.webp', location: 'Beirut', quote: 'Gold spreads are excellent and support is genuinely 24/7.' },
  { name: 'Jonny Saleme', photo: 'assets/clients/jonny-saleme.jpeg', location: 'Zahle', quote: 'Trading indices for months — execution is fast, cashouts on time.' },
  { name: 'Hasan Sleiman', photo: 'assets/clients/hasan-sleiman.jpeg', location: 'Nabatieh', quote: 'OMT pickup made withdrawals so easy. Great team in Beirut.' },
  { name: 'Mira Harb', photo: 'assets/clients/mira-harb.jpg', location: 'Byblos', quote: 'Onboarding took a day. The GTM desk is always one message away.' },
];

const SEO = {
  en: {
    metaTitle: 'GTM | Trade Smarter with Global Trade Market',
    metaDescription:
      'GTM connects Lebanese traders, investors and IBs with broker access, 0-commission offers, fixed spreads, Whish Money cashouts and 24/7 support.',
  },
  ar: {
    metaTitle: 'GTM | تداول بذكاء مع Global Trade Market',
    metaDescription: ar.hero.subtitle,
  },
};

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/** Upload a file from the frontend's public/ folder, reusing it if already there. */
async function uploadOnce(strapi, relPath) {
  const abs = path.join(FE_DIR, 'public', relPath);
  if (!fs.existsSync(abs)) throw new Error(`Missing asset: ${abs}`);

  const base = path.basename(abs);
  const ext = path.extname(abs).toLowerCase();
  const name = path.basename(base, ext);

  const existing = await strapi.db
    .query('plugin::upload.file')
    .findOne({ where: { name: base } });
  if (existing) return existing.id;

  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: {},
    files: {
      filepath: abs,
      originalFilename: base,
      // Older/newer Strapi builds disagree on the casing; send both.
      originalFileName: base,
      name,
      mimetype: MIME[ext] || 'application/octet-stream',
      type: MIME[ext] || 'application/octet-stream',
      size: fs.statSync(abs).size,
    },
  });
  console.log(`  uploaded ${base} (id ${file.id})`);
  return file.id;
}

/** Build the payload for one locale. `media` maps asset path → uploaded file id. */
function buildData(m, media) {
  return {
    seo: SEO[m === en ? 'en' : 'ar'],

    hero: {
      badge: m.hero.badge,
      title: m.hero.title,
      subtitle: m.hero.subtitle,
      cta: { label: m.hero.ctaPrimary, whatsappMessage: "Hi GTM, I'd like to open a trading account." },
      stats: [1, 2, 3, 4].map((n) => ({ value: m.hero[`stat${n}`], label: m.hero[`stat${n}Label`] })),
      tickerSymbol: 'OANDA:XAUUSD',
      marquee: MARQUEE.map((label) => ({ label })),
    },

    features: {
      head: { eyebrow: EYEBROW.features, title: m.features.title, subtitle: m.features.subtitle },
      items: FEATURES,
    },

    servicesPreview: {
      head: { eyebrow: EYEBROW.services, title: m.services.title, subtitle: m.services.subtitle },
      viewAllLabel: m.services.viewAll,
      whatYouGetLabel: m.services.whatYouGet,
    },

    funding: {
      head: { eyebrow: m.funding.eyebrow, title: m.funding.title, subtitle: m.funding.subtitle },
      chooseNote: m.funding.chooseNote,
      methods: PAY_METHODS.map((p) => ({
        key: p.key,
        name: p.name,
        tagline: p.tagline,
        speed: p.speed,
        logo: media[p.logo],
        how: m.funding[p.how],
      })),
      deskLabel: m.funding.deskLabel,
      deskTitle: m.funding.deskTitle,
      deskNote: m.funding.deskNote,
      instantBadge: m.funding.instant,
      journeyTitle: m.funding.journeyTitle,
      journeyText: m.funding.journeyText,
      cta: { label: m.hero.ctaPrimary },
    },

    steps: {
      head: { eyebrow: EYEBROW.steps, title: m.steps.title, subtitle: m.steps.subtitle },
      items: STEPS,
    },

    clientWall: {
      head: { eyebrow: m.clients.eyebrow, title: m.clients.title, subtitle: m.clients.subtitle },
      clients: CLIENTS.map((c) => ({
        name: c.name,
        location: c.location,
        quote: c.quote,
        rating: 5,
        photo: media[c.photo],
      })),
    },

    blogPreview: {
      head: { eyebrow: EYEBROW.blog, title: m.blog.title, subtitle: m.blog.subtitle },
      latestLabel: m.blog.latest,
      limit: 3,
    },

    finalCta: {
      title: m.hero.title,
      subtitle: m.hero.subtitle,
      cta: { label: m.hero.ctaPrimary },
    },
  };
}

(async () => {
  const strapi = await createStrapi(await compileStrapi()).load();
  const docs = strapi.documents(UID);

  console.log('Uploading media…');
  const media = {};
  for (const rel of [...PAY_METHODS.map((p) => p.logo), ...CLIENTS.map((c) => c.photo)]) {
    media[rel] = await uploadOnce(strapi, rel);
  }

  // English is the default locale, so it owns the document.
  const existing = await docs.findFirst({ locale: 'en' });
  const data = buildData(en, media);
  const doc = existing
    ? await docs.update({ documentId: existing.documentId, locale: 'en', data })
    : await docs.create({ locale: 'en', data });
  await docs.publish({ documentId: doc.documentId, locale: 'en' });
  console.log(`Seeded en (documentId ${doc.documentId})`);

  await docs.update({ documentId: doc.documentId, locale: 'ar', data: buildData(ar, media) });
  await docs.publish({ documentId: doc.documentId, locale: 'ar' });
  console.log('Seeded ar');

  await strapi.destroy();
  process.exit(0);
})().catch((e) => {
  console.error('SEED FAILED:', e);
  process.exit(1);
});
