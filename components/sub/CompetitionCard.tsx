'use client';
import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import StarsCanvas from '../main/StarCanvas';
import Image from 'next/image';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from '../ui/3d-card';
import { RainbowButton } from '../magicui/rainbow-button';
import { BorderBeam } from '../magicui/border-beam';

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
    <div className="px-4 lg:px-0 w-full " >
      <CardContainer className="mx-auto ">
        {/* Glow Effects */}
        <div className="absolute -top-14 -left-14 w-72 h-72 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute -bottom-14 -right-14 w-72 h-72 bg-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse z-0" />

        <CardBody className="relative z-10 bg-gradient-to-br from-[#210f2f] via-[#040818] to-[#0f172a] border border-white/10 rounded-2xl p-6 w-[320px]  h-full">
      <BorderBeam delay={6} size={200}/>
          <CardItem translateZ="60" className="h-[250px] w-full overflow-hidden rounded-xl">
            {imageLoading ? (
              <div className="flex justify-center items-center w-full h-full bg-black/50 rounded-xl">
                <BeatLoader color="#ffffff" size={10} />
              </div>
            ) : (
              <Image
                src={imageSrc}
                width={400}
                height={250}
                alt="Competition Image"
                className="object-cover w-full h-full"
                onLoad={() => setImageLoading(false)}
              />
            )}
          </CardItem>

          <CardItem
            translateZ="40"
            as="p"
            className="text-neutral-300 text-sm mt-4"
          >
            {initialDescription}
          </CardItem>

          <div className="flex justify-end mt-6">
          
             <RainbowButton className='text-black' onClick={onClick}>Explore</RainbowButton>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default Card;
