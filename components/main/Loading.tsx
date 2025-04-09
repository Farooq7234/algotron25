'use client';

import React from 'react';
import { Atom } from "react-loading-indicators";

const AlgotronLoader: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden bg-black">

      {/* Glowing Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#7F00FF_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 animate-pulse" />

      {/* Optional Nebula Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/nebula.svg')] bg-cover bg-center blur-sm opacity-30" />

      {/* Loader */}
      <div className="z-10">
        <Atom color="#9e05f4" size="large" text="" textColor="" />
      </div>
    </div>
  );
};

export default AlgotronLoader;
