/**
 * Seeds the About Page single type (en + ar) from the frontend's own content.
 *
 *   node scripts/seed-about.js
 *
 * Translated copy comes from `messages/{en,ar}.json`; the lists and the
 * English-only page copy mirror `about/page.tsx` + `lib/content.ts`.
 */
'use strict';

const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const FE_DIR = process.env.FE_DIR || path.resolve(__dirname, '..', '..', 'gtmlb-fe');
const UID = 'api::about-page.about-page';

const en = require(path.join(FE_DIR, 'messages', 'en.json'));
const ar = require(path.join(FE_DIR, 'messages', 'ar.json'));

/** Strapi blocks paragraph. */
const p = (text) => ({ type: 'paragraph', children: [{ type: 'text', text }] });

/** lib/content.ts → aboutStats */
const TRUST_STATS = [
  { value: '0%', label: 'Commission on every trade' },
  { value: '$2M+', label: 'Cashouts moved monthly' },
  { value: '95%', label: 'Deposits credited instantly' },
  { value: '24/7', label: 'Beirut support desk' },
];

/** about/page.tsx → missionPillars */
const MISSION_PILLARS = [
  { icon: 'Award', title: 'Trusted expertise', text: 'Seasoned market knowledge you can lean on with confidence.' },
  { icon: 'LineChart', title: 'Advanced solutions', text: 'MetaTrader 5, deep liquidity and the tools serious traders need.' },
  { icon: 'Headset', title: 'Personalized support', text: 'A real Beirut desk that answers fast, in Arabic or English.' },
  { icon: 'Target', title: 'Client-focused', text: "Every decision measured against what's right for you." },
];

/** about/page.tsx → visionPillars */
const VISION_PILLARS = [
  { icon: 'Handshake', title: 'Trust', text: 'Lasting client relationships built on doing right by you, every single time.' },
  { icon: 'Eye', title: 'Transparency', text: 'Clear terms and honest answers — no hidden fees, no surprises.' },
  { icon: 'Compass', title: 'Personalized guidance', text: 'Support shaped around your goals, not a one-size-fits-all script.' },
  { icon: 'ShieldCheck', title: 'Professionalism & integrity', text: 'A desk empowered to serve every client with care and respect.' },
];

/** lib/content.ts → aboutFaqs */
const FAQS = [
  { q: 'Who is GTM and where are you based?', a: 'GTM (Global Trade Market) is a trading desk based in Rive Gauche Tower, Achrafieh, Beirut. We give Lebanese traders, investors and introducing brokers access to global markets through our BBCorp broker partnership.' },
  { q: 'Is GTM a broker?', a: 'GTM is not the broker itself — we provide access to regulated broker infrastructure (BBCorp) plus a local Beirut desk for onboarding, funding, cashouts and day-to-day support in Arabic and English.' },
  { q: 'How long does it take to open an account?', a: 'Usually one business day. You message the desk or submit the open-account form, we verify your details and issue your MetaTrader 5 login.' },
  { q: 'What is the minimum deposit?', a: "Just $10 to get started. You can begin small, get comfortable on MT5, and scale up whenever you're ready." },
  { q: 'How do I deposit and withdraw money in Lebanon?', a: 'Through Whish Money, OMT, USDT (TRC20/ERC20) or local bank transfer. 95% of deposits are credited instantly and the desk processes over $2M in cashouts every month.' },
  { q: 'What does trading with GTM cost?', a: '0% commission. The fixed spread is your only cost, so what you pay per trade stays predictable even during volatile news sessions.' },
  { q: 'Can I speak to a real person?', a: 'Yes. The Beirut desk answers on WhatsApp and Telegram 24/7 — usually within minutes, in Arabic or English.' },
];

/** English-only page copy (never had a translation to seed from). */
const COPY = {
  headerEyebrow: 'Who we are',
  storyEyebrow: 'Our story',
  storyTitle: 'Every market you trade, on one account',
  deskEyebrow: 'The desk',
  deskTitle: 'Talk to a real person in Beirut',
  deskText:
    'No call centre, no ticket queue. The same team that opens your account handles your funding, your cashouts and your questions — in Arabic or English, day or night.',
  officeLabel: 'Office',
  officeValue: 'Rive Gauche Tower, Achrafieh, Beirut, Lebanon',
  whatsappLabel: 'WhatsApp',
  whatsappValue: '+961 78 78 97 67 — replies in minutes',
  missionEyebrow: 'Our mission',
  missionTitle: 'Empowering every trader we serve',
  missionSubtitle: 'What the GTM desk sets out to do for you, every day.',
  missionQuote:
    'We empower traders by combining trusted expertise, advanced trading solutions and personalized support — creating a transparent, professional and client-focused trading experience.',
  visionEyebrow: 'Our vision',
  visionTitle: 'Relationships first, always',
  visionSubtitle: 'How the GTM desk shows up for every client we work with.',
  visionQuote:
    'Our mission is to build lasting client relationships through trust, transparency and personalized guidance — empowering our sales team to deliver exceptional service and support every client with professionalism and integrity.',
  faqEyebrow: 'FAQ',
  faqTitle: 'Questions traders ask before they join',
  faqSubtitle: 'Still unsure? The desk answers on WhatsApp in minutes.',
  ctaTitle: 'Ready to start trading today?',
  ctaSubtitle:
    'Open your account with the GTM desk today — most traders are live within a single business day.',
};

function buildData(m) {
  return {
    seo: { metaTitle: `${m.about.title} | GTM`, metaDescription: m.about.subtitle },
    header: { eyebrow: COPY.headerEyebrow, title: m.about.title, subtitle: m.about.subtitle },
    story: {
      head: { eyebrow: COPY.storyEyebrow, title: COPY.storyTitle },
      body: [p(m.about.body1), p(m.about.body2)],
      missionLabel: m.about.missionTitle,
      missionQuote: m.about.mission,
    },
    deskCard: {
      eyebrow: COPY.deskEyebrow,
      title: COPY.deskTitle,
      text: COPY.deskText,
      officeLabel: COPY.officeLabel,
      officeValue: COPY.officeValue,
      whatsappLabel: COPY.whatsappLabel,
      whatsappValue: COPY.whatsappValue,
      cta: { label: m.hero.ctaPrimary },
    },
    trustStats: TRUST_STATS,
    mission: {
      head: { eyebrow: COPY.missionEyebrow, title: COPY.missionTitle, subtitle: COPY.missionSubtitle },
      quote: COPY.missionQuote,
      items: MISSION_PILLARS,
    },
    vision: {
      head: { eyebrow: COPY.visionEyebrow, title: COPY.visionTitle, subtitle: COPY.visionSubtitle },
      quote: COPY.visionQuote,
      items: VISION_PILLARS,
    },
    faq: {
      head: { eyebrow: COPY.faqEyebrow, title: COPY.faqTitle, subtitle: COPY.faqSubtitle },
      items: FAQS,
    },
    ctaBand: {
      title: COPY.ctaTitle,
      subtitle: COPY.ctaSubtitle,
      cta: { label: m.hero.ctaPrimary },
    },
  };
}

(async () => {
  const strapi = await createStrapi(await compileStrapi()).load();
  const docs = strapi.documents(UID);

  const existing = await docs.findFirst({ locale: 'en' });
  const data = buildData(en);
  const doc = existing
    ? await docs.update({ documentId: existing.documentId, locale: 'en', data })
    : await docs.create({ locale: 'en', data });
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
