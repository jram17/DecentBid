import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from './Header/Header';
import Footer from './Footer/Footer';
const Layout = () => (
  <div className="flex flex-col min-h-screen max-w-[100vw]">
    <Header />
    <div className="flex-grow">
      <Outlet />
      <Toaster />
    </div>
    <Footer />
  </div>
);

export default Layout;
