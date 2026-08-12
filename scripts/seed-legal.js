/**
 * Seeds the Legal Documents collection (en + ar) from the frontend's
 * `src/lib/legal.ts`.
 *
 *   node scripts/seed-legal.js
 *
 * The source is TypeScript, so it is transpiled in memory with the frontend's
 * own TypeScript install and evaluated — retyping legal copy by hand would
 * risk silent divergence from the text the site is serving today.
 *
 * Each section becomes an h2 heading followed by its paragraphs, which is what
 * the frontend's blocks renderer already draws for legal pages.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const FE_DIR = process.env.FE_DIR || path.resolve(__dirname, '..', '..', 'gtmlb-fe');
const UID = 'api::legal-document.legal-document';

const en = require(path.join(FE_DIR, 'messages', 'en.json'));
const ar = require(path.join(FE_DIR, 'messages', 'ar.json'));

/** Load a frontend .ts module by transpiling it (types stripped, no checking). */
function loadTsModule(relPath, resolveImport) {
  const ts = require(path.join(FE_DIR, 'node_modules', 'typescript'));
  const source = fs.readFileSync(path.join(FE_DIR, relPath), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  new Function('module', 'exports', 'require', outputText)(module, module.exports, resolveImport);
  return module.exports;
}

const site = loadTsModule('src/lib/site.ts', () => {
  throw new Error('site.ts is expected to have no imports');
});
const { legalDocs } = loadTsModule('src/lib/legal.ts', (id) => {
  if (id === './site') return site;
  // legal.ts also exports a Strapi fetcher for the frontend. Only the static
  // `legalDocs` array matters here, so the client is stubbed out.
  if (id === './strapi') return { strapiFetch: async () => null };
  throw new Error(`Unexpected import in legal.ts: ${id}`);
});

/** Arabic titles that already exist in the messages files. */
const AR_TITLE = { privacy: 'privacyTitle', terms: 'termsTitle', risk: 'riskTitle' };

/** { heading, body[] }[] → Strapi blocks. */
function toBlocks(sections) {
  return sections.flatMap((s) => [
    { type: 'heading', level: 2, children: [{ type: 'text', text: s.heading }] },
    ...s.body.map((text) => ({ type: 'paragraph', children: [{ type: 'text', text }] })),
  ]);
}

(async () => {
  const strapi = await createStrapi(await compileStrapi()).load();
  const docs = strapi.documents(UID);

  for (const d of legalDocs) {
    const body = toBlocks(d.sections);
    const enData = {
      title: d.title,
      slug: d.slug,
      updated: d.updated,
      body,
      seo: { metaTitle: d.title, metaDescription: en.common.riskWarning.slice(0, 195) },
    };

    const [existing] = await docs.findMany({ filters: { slug: d.slug }, locale: 'en' });
    const doc = existing
      ? await docs.update({ documentId: existing.documentId, locale: 'en', data: enData })
      : await docs.create({ locale: 'en', data: enData });
    await docs.publish({ documentId: doc.documentId, locale: 'en' });

    // Only the titles exist in Arabic; the legal text itself has never been
    // translated, so seed the English body for editors to work from.
    const arTitle = ar.legal[AR_TITLE[d.slug]] || d.title;
    await docs.update({
      documentId: doc.documentId,
      locale: 'ar',
      data: {
        ...enData,
        title: arTitle,
        seo: { metaTitle: arTitle, metaDescription: ar.common.riskWarning.slice(0, 195) },
      },
    });
    await docs.publish({ documentId: doc.documentId, locale: 'ar' });

    console.log(`  ${d.slug}: ${body.length} blocks (${d.sections.length} sections) — ${doc.documentId}`);
  }

  await strapi.destroy();
  process.exit(0);
})().catch((e) => {
  console.error('SEED FAILED:', e);
  process.exit(1);
});
