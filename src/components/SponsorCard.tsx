
import React from 'react';
import NeonCard from './ui/NeonCard';

interface SponsorCardProps {
  name: string;
  image: string;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ name, image }) => {
  return (
    <NeonCard type="sponsor" className="p-4 flex items-center justify-center h-40 bg-white text-black rounded-xl shadow-lg">
      <img 
        src={image} 
        alt={name} 
        className="max-w-full max-h-full object-contain"
      />
    </NeonCard>
  );
};

export default SponsorCard;
