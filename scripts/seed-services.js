/**
 * Seeds the Services collection + Services Page single type (en + ar).
 *
 *   node scripts/seed-services.js
 *
 * Services mirror `lib/content.ts`; section copy comes from
 * `messages/{en,ar}.json` plus the English-only strings in `services/page.tsx`.
 * Matching is by slug, so re-running updates rather than duplicates.
 */
'use strict';

const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const FE_DIR = process.env.FE_DIR || path.resolve(__dirname, '..', '..', 'gtmlb-fe');
const PAGE_UID = 'api::services-page.services-page';
const SERVICE_UID = 'api::service.service';

const en = require(path.join(FE_DIR, 'messages', 'en.json'));
const ar = require(path.join(FE_DIR, 'messages', 'ar.json'));

const tags = (list) => list.map((label) => ({ label }));

/** lib/content.ts → services */
const SERVICES = [
  {
    slug: 'forex',
    icon: 'LineChart',
    title: 'Forex Trading',
    tagline: 'Major, minor & exotic pairs',
    description:
      'Trade 60+ currency pairs with fixed spreads and zero commissions on MetaTrader 5, backed by the GTM desk in Beirut.',
    points: ['0% commission', 'Fixed tight spreads', 'Leverage up to 1:200', 'MT5 desktop & mobile'],
    stats: [
      { label: 'Pairs', value: '60+' },
      { label: 'Commission', value: '0%' },
      { label: 'Max leverage', value: '1:200' },
    ],
  },
  {
    slug: 'gold-metals',
    icon: 'Coins',
    title: 'Gold & Metals',
    tagline: 'XAU/USD and precious metals',
    description:
      'Take positions on gold and silver with deep liquidity, fast execution and the pricing local traders trust.',
    points: ['Spot gold (XAU)', 'Silver & metals', 'Deep liquidity', 'No hidden fees'],
    stats: [
      { label: 'Instruments', value: 'XAU · XAG' },
      { label: 'Commission', value: '0%' },
      { label: 'Sessions', value: '24/5' },
    ],
  },
  {
    slug: 'indices',
    icon: 'BarChart3',
    title: 'Indices',
    tagline: 'Global stock indices',
    description:
      "Get exposure to the world's leading indices — US30, NAS100, S&P 500 and more — from a single account.",
    points: ['US30 · NAS100 · SPX', 'Low margin', 'Round-the-clock markets', 'One-click execution'],
    stats: [
      { label: 'Indices', value: 'US30 · NAS100 · SPX' },
      { label: 'Commission', value: '0%' },
      { label: 'Execution', value: 'One-click' },
    ],
  },
  {
    slug: 'funding-cashout',
    icon: 'Wallet',
    title: 'Funding & Cashout',
    tagline: 'Local & digital methods',
    description:
      'Deposit and withdraw through Whish, OMT, USDT and bank transfer. 95% of deposits land instantly, cashouts are fast.',
    points: ['Whish Money', 'OMT & bank transfer', 'USDT / crypto', '95% instant deposits'],
    stats: [
      { label: 'Instant deposits', value: '95%' },
      { label: 'Moved monthly', value: '$2M+' },
      { label: 'Routes', value: '4' },
    ],
  },
];

/** services/page.tsx → included */
const INCLUDED = [
  '0% commission on every instrument',
  'Fixed spreads that hold through news',
  'Whish, OMT, USDT and bank funding',
  '95% of deposits credited instantly',
  'Arabic & English desk support, 24/7',
  'Leverage options up to 1:200',
];

/** lib/content.ts → steps */
const STEPS = [
  { title: 'Talk to the desk', text: 'Message us on WhatsApp or fill the form. We answer fast and set you up.' },
  { title: 'Open your MT5 account', text: 'Get your BBCorp trading account with 0% commission, usually within a day.' },
  { title: 'Fund & trade', text: 'Deposit via Whish, OMT or USDT — 95% land instantly — and start trading.' },
];

/** lib/content.ts → serviceFaqs */
const FAQS = [
  { q: 'How do I open an account?', a: 'Start by messaging the GTM desk — our team of experts is here to help. Once we send you your personal registration link, you can set up the account yourself in just a few minutes.' },
  { q: 'What markets can I trade?', a: 'The most popular global markets, all from a single account — forex, commodities and stocks, covering the instruments traders follow most.' },
  { q: 'What is the minimum deposit?', a: "Just $10. You can start small, get comfortable on the platform, and scale up whenever you're ready." },
  { q: 'How do I fund my account?', a: 'Two easy ways: directly through your client portal (CRM), or by sending a Whish transfer and sharing the receipt with the desk. We confirm your deposit and your balance updates right away.' },
  { q: 'What trading platform do you offer?', a: 'MetaTrader 5 (MT5) — the industry-standard platform, available on desktop, web and mobile so you can trade from anywhere.' },
  { q: 'What leverage is available?', a: 'Up to 1:200. Higher leverage magnifies both profit and loss, so the desk will help you pick a level that fits your risk tolerance.' },
];

/** English-only page copy. */
const COPY = {
  headerEyebrow: 'What we offer',
  liveNote: 'Live in ~1 business day',
  includedEyebrow: 'One account',
  includedTitle: 'Everything is included — nothing is upsold',
  includedSubtitle: 'Every GTM trading account ships with the same full setup, whatever you trade.',
  stepsEyebrow: 'Get started',
  faqEyebrow: 'FAQ',
  faqTitle: 'Everything you need to know about GTM',
  faqSubtitle: 'The questions the desk gets asked every day.',
  ctaTitle: 'Ready to start trading today?',
  ctaSubtitle:
    'Open your account with the GTM desk today — most traders are live within a single business day.',
};

function buildPage(m) {
  return {
    seo: { metaTitle: m.services.title, metaDescription: m.services.subtitle },
    header: { eyebrow: COPY.headerEyebrow, title: m.services.title, subtitle: m.services.subtitle },
    liveNote: COPY.liveNote,
    included: {
      head: { eyebrow: COPY.includedEyebrow, title: COPY.includedTitle, subtitle: COPY.includedSubtitle },
      items: tags(INCLUDED),
    },
    howToStart: {
      head: { eyebrow: COPY.stepsEyebrow, title: m.steps.title, subtitle: m.steps.subtitle },
      items: STEPS,
    },
    faq: {
      head: { eyebrow: COPY.faqEyebrow, title: COPY.faqTitle, subtitle: COPY.faqSubtitle },
      items: FAQS,
    },
    ctaBand: { title: COPY.ctaTitle, subtitle: COPY.ctaSubtitle, cta: { label: m.hero.ctaPrimary } },
  };
}

(async () => {
  const strapi = await createStrapi(await compileStrapi()).load();
  const services = strapi.documents(SERVICE_UID);

  for (const [i, s] of SERVICES.entries()) {
    const data = {
      title: s.title,
      slug: s.slug,
      icon: s.icon,
      tagline: s.tagline,
      description: s.description,
      points: tags(s.points),
      stats: s.stats,
      order: i,
    };
    const [existing] = await services.findMany({ filters: { slug: s.slug }, locale: 'en' });
    const doc = existing
      ? await services.update({ documentId: existing.documentId, locale: 'en', data })
      : await services.create({ locale: 'en', data });
    await services.publish({ documentId: doc.documentId, locale: 'en' });
    // No Arabic source copy exists — seed the English text so editors can
    // translate in place rather than starting from an empty entry.
    await services.update({ documentId: doc.documentId, locale: 'ar', data });
    await services.publish({ documentId: doc.documentId, locale: 'ar' });
    console.log(`  service ${s.slug} (${doc.documentId})`);
  }

  const page = strapi.documents(PAGE_UID);
  const existing = await page.findFirst({ locale: 'en' });
  const doc = existing
    ? await page.update({ documentId: existing.documentId, locale: 'en', data: buildPage(en) })
    : await page.create({ locale: 'en', data: buildPage(en) });
  await page.publish({ documentId: doc.documentId, locale: 'en' });
  console.log(`Seeded services page en (documentId ${doc.documentId})`);

  await page.update({ documentId: doc.documentId, locale: 'ar', data: buildPage(ar) });
  await page.publish({ documentId: doc.documentId, locale: 'ar' });
  console.log('Seeded services page ar');

  await strapi.destroy();
  process.exit(0);
})().catch((e) => {
  console.error('SEED FAILED:', e);
  process.exit(1);
});
