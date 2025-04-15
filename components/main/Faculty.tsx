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
    name: 'Dr. Anjali Rao',
    degree: 'Ph.D. in Artificial Intelligence',
    position: 'Professor & Head of Department',
    profileImg: '/images/img1.jpeg',

  },
  {
    name: 'Prof. Rajeev Menon',
    degree: 'M.Tech in Embedded Systems',
    position: 'Associate Professor',
    profileImg: '/images/img2.jpeg',
   
  },
  {
    name: 'Dr. Meena Iyer',
    degree: 'Ph.D. in Cybersecurity',
    position: 'Assistant Professor',
    profileImg: '/images/img3.jpeg',

  },
  {
    name: 'Prof. Vinay Kulkarni',
    degree: 'M.Tech in Software Engineering',
    position: 'Assistant Professor',
    profileImg: '/images/img4.jpeg',
  
  },
  {
    name: 'Dr. Kavitha Sharma',
    degree: 'Ph.D. in Machine Learning',
    position: 'Professor',
    profileImg: '/images/img5.jpeg',

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
      <div className="relative w-full h-96">
        <Image
          src={profileImg}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
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
