import React from 'react';
import { FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 text-center w-full">
      {/* Location Pill */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 border border-[#2c2c2c] px-6 py-3 rounded-full bg-[#0f0f0f]">
          <FaMapMarkerAlt className="text-3xl text-white" />
          <span className="text-lg md:text-3xl font-semibold tracking-wide">
            Thanthai Periyar Government Institute of Technology · Bagayam · Vellore - 632002 · Tamil Nadu · India
          </span>
        </div>
      </div>

      {/* Instagram Button */}
      <div className="flex justify-center cursor-pointer">
        <a
          href="https://www.instagram.com/algotron_v4.0?igsh=dXZiN3N4dTdhZzhk"
          target="_blank"
          rel="noopener noreferrer"
          style={{ zIndex: 50, position: 'relative' }}
          className="flex items-center gap-2 bg-black text-purple-400 border border-purple-500 px-6 py-3 rounded-full shadow-[0_0_15px_#a855f7] hover:scale-105 transition-all duration-300 font-semibold"
        >
          <FaInstagram className="text-4xl " />
          <span className="text-2xl">Follow us on Instagram!</span>
        </a>
      </div>
      <span className="mt-12 text-lg md:text-xl text-gray-400 font-semibold tracking-wide">
      Made with 💜 by  <span className="text-purple-400 inline">CSE Department</span>.
      </span>
    </footer>
  );
};

export default Footer;
