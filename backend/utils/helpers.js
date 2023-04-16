const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const trimString = (value) => (typeof value === 'string' ? value.trim() : '');

module.exports = { escapeRegex, trimString };
