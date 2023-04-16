const Staff = require('../models/Staff');
const Buyer = require('../models/Buyer');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  const [totalStaff, activeStaff, totalBuyers, activeBuyers] = await Promise.all([
    Staff.countDocuments(),
    Staff.countDocuments({ accountStatus: 'Active' }),
    Buyer.countDocuments(),
    Buyer.countDocuments({ accountStatus: 'Active' }),
  ]);

  const inactiveStaff = totalStaff - activeStaff;
  const inactiveBuyers = totalBuyers - activeBuyers;

  res.json({
    success: true,
    data: {
      totalStaff,
      totalBuyers,
      activeStaff,
      inactiveStaff,
      activeBuyers,
      inactiveBuyers,
      activeUsers: activeStaff + activeBuyers,
      inactiveUsers: inactiveStaff + inactiveBuyers,
    },
  });
};

module.exports = { getDashboardStats };
