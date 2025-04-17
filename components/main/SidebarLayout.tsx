// components/layout/SidebarLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  MenuIcon,
  LayoutDashboardIcon,
  CalendarIcon,
  LogOut,
} from 'lucide-react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const sidebarItems = [
  { href: '/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
  { href: '/event-registration', icon: CalendarIcon, label: 'Event-Registration' },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <div className="flex h-screen ">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-gray-900 text-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center py-4 ">
              {/* <span className="text-xl font-bold">Algotron</span> */}
              <div className='flex items-center mb-2'>
          <Link href="/">
            <img src='/algotron_logo.png' alt='Logo' className='h-[50px] object-contain w-40 mt-4' />
          </Link>
        </div>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                        pathname === item.href
                          ? 'bg-gray-950 text-white'
                          : 'hover:bg-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="" size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Separator />
            <div className="p-4">
              <Button variant="destructive" onClick={() => signOut()} className="w-full text-2xl py-8">
                <LogOut className="mr-2" strokeWidth={5} size={20} />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[20%]  bg-gray-900 text-white">
        <div className="flex items-center justify-center  ">
        
          <Link href="/">
            <img src='/algotron_logo.png' alt='Logo' className='h-[50px] object-contain w-40 mt-4' />
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-gray-950 text-white'
                      : 'hover:bg-gray-950 text-white'
                  }`}
                >
                  <item.icon className="w-15 h-15" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Separator />
        <div className="p-4">
          <Button variant="destructive" onClick={() => signOut()} className="w-full text-xl sm:text-2xl py-8">
            <LogOut className="mr-2" size={20} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="w-full  flex items-center justify-between py-8 sm:py-0">
          <div className="flex items-center space-x-3 px-4">
            <Button
              variant="ghost"
              className="lg:hidden bg-white text-black "
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-20 h-20 text-5xl" />
            </Button>
          </div>
          {/* <div className="flex items-center space-x-4">
            {user && (
              <>
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>
                    {user.firstName?.[0] ?? user.emailAddresses[0].emailAddress[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.firstName}</span>
              </>
            )}
          </div> */}
        </header>

        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
