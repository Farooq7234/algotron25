'use client';
import Image from 'next/image';
import React, { useState } from 'react';

interface FacultyMember {
  name: string;
  degree: string;
  position: string;
  profileImg: string;
 
}

const facultyList: FacultyMember[] = [
  {
    name: 'Dr.P.K.Palani',
    degree: 'B.E.(HONS),M.E.,Ph.D.,',
    position: 'Principal',
    profileImg: '/images/principal.png',

  },
  {
    name: 'Dr. S.LETITIA',
    degree: 'M.E.,Ph.D.,',
    position: 'Head of the Department',
    profileImg: '/images/letitia_mam.jpg',
   
  },
  {
    name: 'Prof.B.Jothi',
    degree: 'M.E.,',
    position: 'Associate Professor',
    profileImg: '/images/Jothi_mam.png',
  
  },
  {
    name: 'Prof.N.Jagadeeswari',
    degree: 'M.E.,',
    position: 'Assistant Professor',
    profileImg: '/images/jagadeshwari.png',

  },

  {
    name: 'Dr.K.Saraswathi',
    degree: 'M.E.,Ph.D.,',
    position: 'Assistant Professor',
    profileImg: '/images/Dr,SARASWATHI.png',

  },
];

const FacultyCard: React.FC<FacultyMember> = ({
  name,
  degree,
  position,
  profileImg,
}) => {
  return (
    <div className="max-w-lg w-full rounded-2xl shadow-lg overflow-hidden bg-transparent p-5 relative">
      {/* Image section */}
      <div className="relative w-full">
        <Image
          src={profileImg}
          alt={name}
  
          width={100}
          height={100}
          
          className=" rounded-full bg-center"
        />
      </div>

      {/* Details section */}
      <div className="text-center mt-4">
        <h3 className="text-3xl font-bold text-white">{name}</h3>
        <p className="text-lg text-white italic">{degree}</p>
        <p className="text-lg text-indigo-300 font-medium">{position}</p>
      </div>
    </div>
  );
};

const Faculty: React.FC = () => {
  return (
    <section className="py-12 px-6">
       <h1 className=' text-center text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-mono '>Meet Our Faculties</h1> 
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center py-28">
        {facultyList.map((faculty, index) => (
          <FacultyCard key={index} {...faculty} />
        ))}
      </div>
    </section>
  );
};

export default Faculty;
