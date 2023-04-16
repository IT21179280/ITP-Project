const Counter = require('../models/Counter');

/**
 * Atomically increments a named counter and returns a formatted ID.
 */
const generateId = async (counterName, prefix) => {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `${prefix}-${String(counter.seq).padStart(4, '0')}`;
};

module.exports = generateId;
