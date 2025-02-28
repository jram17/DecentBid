import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from './Header/Header';
import Footer from './Footer/Footer';
const Layout = () => (
  <div className="flex flex-col min-h-screen max-w-[100vw] bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 ">
    <Header />
    <div className="flex-grow mt-[69px]">
      <Outlet />
      <Toaster />
      
    </div>
    <Footer />
  </div>
);

export default Layout;
// bg-gradient-to-br from-[#6B5B95] via-[#836FFF] to-[#B79CED]