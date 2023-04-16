import { MODULES } from './constants';

const PLACEHOLDER_TITLES = {
  '/vehicles': 'Vehicle Management',
  '/production': 'Production Management',
  '/machinery': 'Machinery Management',
  '/other': 'Other Management',
};

export const getPageMeta = (pathname) => {
  if (pathname === '/') {
    return {
      title: 'Dashboard',
      subtitle: 'System overview and user statistics',
    };
  }

  if (pathname === '/users') {
    return {
      title: 'User Management',
      subtitle: 'Manage staff and tea buyer accounts',
    };
  }

  if (pathname === '/staff') {
    return { title: 'Staff Management', subtitle: 'Staff account records' };
  }

  if (pathname === '/staff/new') {
    return { title: 'Add Staff Member', subtitle: 'Create a new staff account' };
  }

  if (/^\/staff\/[^/]+\/edit$/.test(pathname)) {
    return { title: 'Edit Staff Member', subtitle: 'Update staff account details' };
  }

  if (/^\/staff\/[^/]+$/.test(pathname)) {
    return { title: 'Staff Details', subtitle: 'Staff account information' };
  }

  if (pathname === '/buyers') {
    return { title: 'Buyer Management', subtitle: 'Buyer account records' };
  }

  if (pathname === '/buyers/new') {
    return { title: 'Add Buyer', subtitle: 'Create a new buyer account' };
  }

  if (/^\/buyers\/[^/]+\/edit$/.test(pathname)) {
    return { title: 'Edit Buyer', subtitle: 'Update buyer account details' };
  }

  if (/^\/buyers\/[^/]+$/.test(pathname)) {
    return { title: 'Buyer Details', subtitle: 'Buyer account information' };
  }

  if (PLACEHOLDER_TITLES[pathname]) {
    return {
      title: PLACEHOLDER_TITLES[pathname],
      subtitle: 'Module under development',
    };
  }

  const legacy = MODULES.find((module) => module.path === pathname);
  if (legacy) {
    return { title: legacy.name, subtitle: 'Tea Factory Management System' };
  }

  return { title: 'Page Not Found', subtitle: 'The requested page does not exist' };
};
