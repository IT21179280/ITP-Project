require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Staff = require('./models/Staff');
const Buyer = require('./models/Buyer');
const Counter = require('./models/Counter');

const DEMO_PASSWORD = 'Password@123';

const staffSeed = [
  {
    staffId: 'STF-0001',
    fullName: 'Nuwan Perera',
    username: 'nuwan.perera',
    email: 'nuwan.perera@teafactory.lk',
    contactNumber: '0771234567',
    address: '45/2 Galle Road, Matara',
    gender: 'Male',
    position: 'Factory Manager',
    department: 'Administration',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
  {
    staffId: 'STF-0002',
    fullName: 'Chamari Silva',
    username: 'chamari.silva',
    email: 'chamari.silva@teafactory.lk',
    contactNumber: '0712345678',
    address: '12 Hill Street, Badulla',
    gender: 'Female',
    position: 'Assistant Manager',
    department: 'Production',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
  {
    staffId: 'STF-0003',
    fullName: 'Kasun Fernando',
    username: 'kasun.fernando',
    email: 'kasun.fernando@teafactory.lk',
    contactNumber: '0763456789',
    address: '88 Temple Road, Kandy',
    gender: 'Male',
    position: 'Field Supervisor',
    department: 'Field Operations',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
  {
    staffId: 'STF-0004',
    fullName: 'Dilani Jayasinghe',
    username: 'dilani.j',
    email: 'dilani.jayasinghe@teafactory.lk',
    contactNumber: '0774567890',
    address: '23 Station Road, Nuwara Eliya',
    gender: 'Female',
    position: 'Clerk',
    department: 'Administration',
    password: DEMO_PASSWORD,
    accountStatus: 'Inactive',
  },
  {
    staffId: 'STF-0005',
    fullName: 'Ruwan Bandara',
    username: 'ruwan.bandara',
    email: 'ruwan.bandara@teafactory.lk',
    contactNumber: '0715678901',
    address: '7 Lake View, Ratnapura',
    gender: 'Male',
    position: 'Technician',
    department: 'Machinery',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
  {
    staffId: 'STF-0006',
    fullName: 'Sithara Wickramasinghe',
    username: 'sithara.w',
    email: 'sithara.w@teafactory.lk',
    contactNumber: '0766789012',
    address: '56 Tea Estate Road, Haputale',
    gender: 'Female',
    position: 'Quality Officer',
    department: 'Quality Control',
    password: DEMO_PASSWORD,
    accountStatus: 'Inactive',
  },
];

const buyerSeed = [
  {
    buyerId: 'BUY-0001',
    fullName: 'Mohamed Rizwan',
    username: 'rizwan.buyer',
    email: 'rizwan@ceylonteatraders.lk',
    contactNumber: '0777890123',
    address: '15 Main Street, Colombo 03',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
  {
    buyerId: 'BUY-0002',
    fullName: 'Anoma Weerasinghe',
    username: 'anoma.w',
    email: 'anoma@hillcountrytea.lk',
    contactNumber: '0718901234',
    address: '8 Park Avenue, Kandy',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
  {
    buyerId: 'BUY-0003',
    fullName: 'Suresh Kumar',
    username: 'suresh.kumar',
    email: 'suresh@globalteabuyers.com',
    contactNumber: '0769012345',
    address: '102 Market Road, Colombo 11',
    password: DEMO_PASSWORD,
    accountStatus: 'Inactive',
  },
  {
    buyerId: 'BUY-0004',
    fullName: 'Priya Nadesan',
    username: 'priya.n',
    email: 'priya@lankateaexports.lk',
    contactNumber: '0770123456',
    address: '33 Beach Road, Galle',
    password: DEMO_PASSWORD,
    accountStatus: 'Active',
  },
];

const runSeed = async () => {
  await connectDB();

  console.log('[Seed] Clearing existing staff, buyers and counters...');
  await Promise.all([
    Staff.deleteMany({}),
    Buyer.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  console.log('[Seed] Inserting sample staff and buyers...');
  await Staff.create(staffSeed);
  await Buyer.create(buyerSeed);

  // Keep the ID counters in sync with the seeded records.
  await Counter.insertMany([
    { _id: 'staff', seq: staffSeed.length },
    { _id: 'buyer', seq: buyerSeed.length },
  ]);

  console.log(`[Seed] Done. ${staffSeed.length} staff and ${buyerSeed.length} buyers inserted.`);
  console.log(`[Seed] Demo password for every seeded account: ${DEMO_PASSWORD}`);

  await mongoose.connection.close();
  process.exit(0);
};

runSeed().catch(async (error) => {
  console.error('[Seed] Failed:', error.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
