import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastProvider';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import StaffList from './pages/staff/StaffList';
import StaffForm from './pages/staff/StaffForm';
import StaffDetails from './pages/staff/StaffDetails';
import BuyerList from './pages/buyers/BuyerList';
import BuyerForm from './pages/buyers/BuyerForm';
import BuyerDetails from './pages/buyers/BuyerDetails';
import Placeholder from './pages/Placeholder';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="users" element={<UserManagement />} />

          <Route path="staff" element={<StaffList />} />
          <Route path="staff/new" element={<StaffForm />} />
          <Route path="staff/:id" element={<StaffDetails />} />
          <Route path="staff/:id/edit" element={<StaffForm />} />

          <Route path="buyers" element={<BuyerList />} />
          <Route path="buyers/new" element={<BuyerForm />} />
          <Route path="buyers/:id" element={<BuyerDetails />} />
          <Route path="buyers/:id/edit" element={<BuyerForm />} />

          <Route path="vehicles" element={<Placeholder moduleKey="vehicles" />} />
          <Route path="production" element={<Placeholder moduleKey="production" />} />
          <Route path="machinery" element={<Placeholder moduleKey="machinery" />} />
          <Route path="other" element={<Placeholder moduleKey="other" />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
