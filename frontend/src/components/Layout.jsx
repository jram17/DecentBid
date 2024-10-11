import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
const Layout = () => (
  <div className="flex flex-col min-h-screen max-w-[100vw]">
    <div className="flex-grow">
      <Outlet />
      <Toaster />
    </div>
  </div>
);

export default Layout;
