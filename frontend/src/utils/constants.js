export const GENDERS = ['Male', 'Female', 'Other'];

export const STATUSES = ['Active', 'Inactive'];

export const DEPARTMENTS = [
  'Administration',
  'Production',
  'Field Operations',
  'Machinery',
  'Quality Control',
  'Finance',
  'Stores',
];

export const POSITIONS = [
  'Factory Manager',
  'Assistant Manager',
  'Production Supervisor',
  'Field Supervisor',
  'Clerk',
  'Technician',
  'Quality Officer',
  'Machine Operator',
  'Store Keeper',
  'Accountant',
];

export const MODULES = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    path: '/',
    icon: 'dashboard',
    available: true,
  },
  {
    key: 'users',
    name: 'User Management',
    path: '/users',
    icon: 'users',
    available: true,
  },
  {
    key: 'vehicles',
    name: 'Vehicle Management',
    path: '/vehicles',
    icon: 'truck',
    available: false,
  },
  {
    key: 'production',
    name: 'Production Management',
    path: '/production',
    icon: 'factory',
    available: false,
  },
  {
    key: 'machinery',
    name: 'Machinery Management',
    path: '/machinery',
    icon: 'cog',
    available: false,
  },
  {
    key: 'other',
    name: 'Other Management',
    path: '/other',
    icon: 'grid',
    available: false,
  },
];

export const MODULE_DESCRIPTIONS = {
  dashboard: 'System overview and user statistics.',
  users: 'Staff and tea buyer account administration.',
  vehicles: 'Vehicle registry, transport records and maintenance.',
  production: 'Tea leaf collection, production batches and output.',
  machinery: 'Machine registry and maintenance schedules.',
  other: 'Additional factory administration features.',
};
