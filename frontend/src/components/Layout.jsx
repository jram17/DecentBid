import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from './Header/Header';
import Footer from './Footer/Footer';
const Layout = () => (
  <div className="flex flex-col min-h-screen max-w-[100vw] bg-gray-100">
    <Header />
    <div className="flex-grow mt-[69px]">
      <Outlet />
      <Toaster />
    </div>
    <Footer />
  </div>
);

export default Layout;
