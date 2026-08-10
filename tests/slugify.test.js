'use strict';
// Run with: node --test tests/
const { test } = require('node:test');
const assert = require('node:assert');
const slugify = require('../src/utils/slugify');
const { beforeCreate } = require('../src/api/blog/content-types/blog/lifecycles');

test('slugify produces url-safe slugs', () => {
  assert.strictEqual(slugify('Gold Outlook: Q3 2026!'), 'gold-outlook-q3-2026');
  assert.strictEqual(slugify('  --Weird   spacing--  '), 'weird-spacing');
  assert.strictEqual(slugify('عنوان'), ''); // non-latin falls through to documentId
});

test('beforeCreate fills missing slug from title', () => {
  const event = { params: { data: { title: 'Market Notes', slug: null } } };
  beforeCreate(event);
  assert.strictEqual(event.params.data.slug, 'market-notes');
});

test('beforeCreate keeps an explicit slug', () => {
  const event = { params: { data: { title: 'Market Notes', slug: 'custom' } } };
  beforeCreate(event);
  assert.strictEqual(event.params.data.slug, 'custom');
});
