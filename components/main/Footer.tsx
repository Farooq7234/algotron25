import React from 'react';
import { FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 text-center">
      {/* Location Pill */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 border border-[#2c2c2c] px-6 py-3 rounded-full bg-[#0f0f0f]">
          <FaMapMarkerAlt className="text-lg text-white" />
          <span className="text-lg md:text-3xl font-semibold tracking-wide">
            Thanthai Periyar Government Institute of Technology · Bagayam · Vellore - 632002 · Tamil Nadu · India
          </span>
        </div>
      </div>

      {/* Instagram Button */}
      <div className="flex justify-center cursor-pointer">
        <Link
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black text-purple-400 border border-purple-500 px-6 py-3 rounded-full shadow-[0_0_15px_#a855f7] hover:scale-105 transition-all duration-300 font-semibold"
        >
          <FaInstagram className="text-4xl " />
          <span className="text-2xl">Follow us on Instagram!</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
