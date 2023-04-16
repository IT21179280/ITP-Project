const mongoose = require('mongoose');

/**
 * Small sequence collection used to generate readable record IDs such as
 * STF-0001 and BUY-0001 without race conditions.
 */
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);
