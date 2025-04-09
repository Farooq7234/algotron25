// Layout.js
import React, { ReactNode } from 'react';
import Navbar from '@/components/main/Navbar';

interface LayoutProps {
    children: ReactNode;
  }

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
