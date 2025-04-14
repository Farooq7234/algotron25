'use client';
import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import StarsCanvas from '../main/StarCanvas';
import Image from 'next/image';
interface CardProps {
  imageSrc: string;
  initialDescription: string;
  linkTo: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  imageSrc,
  initialDescription,
  linkTo,
  onClick,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setImageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="px-4 lg:px-0"
      onClick={onClick}
    >
          <div
      className="px-4 lg:px-0 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    />

    
      <div className="relative group transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] w-[320px]">
        {/* Glowing Canvas Background */}
        <div className="absolute -top-14 -left-14 w-72 h-72 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute -bottom-14 -right-14 w-72 h-72 bg-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse z-0" />

        {/* Card Wrapper */}
        <div className="relative z-10 bg-gradient-to-br from-[#1e1b4b] via-[#1e293b] to-[#0f172a] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 w-full max-w-[400px] lg:max-w-[480px] mx-auto">
          <div className="h-[350px] w-full flex items-center justify-center overflow-hidden rounded-t-2xl">
            {imageLoading ? (
              <div className="flex justify-center items-center w-full h-full bg-black/50">
                <BeatLoader color="#ffffff" size={10} />
              </div>
            ) : (
              <Image
                src={imageSrc}
                width={400}
                height={400}
                alt={'Competition Image'}
                className="object-cover w-full h-full"
                onLoad={() => setImageLoading(false)}
              />
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default Card;
