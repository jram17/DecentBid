import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from './Header/Header';
import Footer from './Footer/Footer';
const Layout = () => (
  <div className="flex flex-col min-h-screen max-w-[100vw] bg-gradient-to-br from-[#5c4d6c] via-[#8A2BE2] to-[#D882FF]">
    <Header />
    <div className="flex-grow mt-[69px]">
      <Outlet />
      <Toaster />
      
    </div>
    <Footer />
  </div>
);

export default Layout;
