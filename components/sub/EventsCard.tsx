import Link from 'next/link';
import React from 'react';

interface EventsCardProps {
  title: string;
  imageSrc: string;
  name: string;
  href: string;
}

const EventsCard: React.FC<EventsCardProps> = ({ title, imageSrc, name, href }) => {
  return (
    <div className="text-white px-4 py-10">
      <h1 className='text-center sm:text-5xl text-4xl font-semibold text-gray-300 font-space mb-8'>{title}</h1>

      <Link href={href}>
        <div className="relative rounded-xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-in-out bg-gradient-to-r from-[#3a0ca3] via-[#7209b7] to-[#f72585] p-3 sm:p-5 max-w-3xl mx-auto">
          <div className="rounded-lg overflow-hidden bg-[#0f0f1b]">
            <img
              className='h-full w-full object-cover'
              src={imageSrc}
              alt={`Image for ${name}`}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default EventsCard;
