'use client';

import { slideInFromRight } from "@/public/utils/motion";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth, SignOutButton } from "@clerk/nextjs";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const { isSignedIn } = useAuth();

  const links = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "About", link: "#about" },
    { id: 3, name: "Events", link: "#events" },
    { id: 4, name: "FAQs", link: "#faqs" },
    { id: 5, name: "Contact", link: "#contact" }
  ];

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setNav(false);
      document.body.classList.remove("nav-open");
    }
  };

  const toggleNav = () => {
    setNav(!nav);
    document.body.classList.toggle("nav-open");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`flex justify-between items-center w-full h-28 p-5 text-white z-[999] fixed top-0 left-0 ${nav ? 'nav-open' : ''}`} style={{ backgroundColor: '#030014' }}>
      <motion.div variants={slideInFromRight(40)} className="py-5 px-3">
        <div className='flex items-center mb-2'>
          <Link href="/">
            <img src='/algotron_logo.png' alt='Logo' className='h-13 object-contain w-40' />
          </Link>
        </div>
      </motion.div>

      {/* Desktop Nav */}
      <ul className="hidden md:flex md:items-center">
        {links.map(({ id, name, link }) => (
          <li
            key={id}
            className="text-3xl nav-links px-4 py-2 cursor-pointer hover:scale-105 capitalize hover:text-white duration-200 
              bg-clip-text text-transparent bg-gradient-to-b from-white to-[#AAAAAA] font-space font-bold"
          >
            <Link href={link}>{name}</Link>
          </li>
        ))}
        <li className="ml-4">
          {isSignedIn ? (
            <SignOutButton>
              <button className="text-3xl text-gray-200 bg-red-500 rounded-md border-2 px-5 py-2 font-space font-bold duration-200">
                Logout
              </button>
            </SignOutButton>
          ) : (
            <Link href="/sign-up">
              <button className="text-3xl text-gray-200 bg-purple-600 rounded-md border-2 px-5 py-2 border-purple-600 font-space font-bold hover:bg-purple-700 duration-200">
                Register
              </button>
            </Link>
          )}
        </li>
      </ul>

      {/* Hamburger Icon (Visible on Mobile) */}
      <div
        onClick={toggleNav}
        className="cursor-pointer font-space z-50 text-white text-2xl md:hidden fixed top-8 right-8"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {/* Mobile Nav */}
      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 z-20">
          {links.map(({ id, name, link }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-[#AAAAAA] font-space font-bold"
            >
              <div onClick={toggleNav}>
                <Link href={link} scroll={false}>
                  {name}
                </Link>
              </div>
            </li>
          ))}
          <li className="mt-4">
            {isSignedIn ? (
              <SignOutButton>
                <button className="text-3xl text-purple-300 font-space font-bold">Logout</button>
              </SignOutButton>
            ) : (
              <Link href="/sign-up">
                <button onClick={toggleNav} className="text-3xl text-purple-300 font-space font-bold">Register</button>
              </Link>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
