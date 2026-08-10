'use strict';

/** Turn a title into a url-safe slug ("Gold Outlook: Q3!" → "gold-outlook-q3"). */
module.exports = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
