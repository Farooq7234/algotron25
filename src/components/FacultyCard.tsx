
import React from 'react';
import NeonCard from './ui/NeonCard';

interface FacultyCardProps {
  name: string;
  title: string;
  qualification: string;
  role: string;
  image: string;
}

const FacultyCard: React.FC<FacultyCardProps> = ({
  name,
  title,
  qualification,
  role,
  image
}) => {
  return (
    <NeonCard type="faculty" className="text-center p-4">
      <div className="mx-auto rounded-full overflow-hidden w-32 h-32 border-4 border-blue-500 mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-center bg-no-repeat"
        />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <p className="text-gray-300 text-sm mb-1">{qualification}</p>
      <p className="text-gray-300 text-sm mb-1">{title}</p>
      <p className="text-blue-400 text-sm">{role}</p>
    </NeonCard>
  );
};

export default FacultyCard;
