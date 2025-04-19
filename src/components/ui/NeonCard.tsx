
import React, { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  type?: 'tech' | 'nontech' | 'faculty' | 'sponsor';
  onClick?: () => void;
}

const NeonCard: React.FC<NeonCardProps> = ({ 
  children, 
  className = '', 
  type = 'tech', 
  onClick
}) => {
  const typeClasses = {
    tech: 'event-card-tech',
    nontech: 'event-card-nontech',
    faculty: 'faculty-card',
    sponsor: 'border border-gray-500 bg-gray-800 bg-opacity-50 hover:shadow-lg transition-all'
  };
  
  const baseClasses = "neon-card rounded-lg overflow-hidden transition-transform";
  
  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default NeonCard;
