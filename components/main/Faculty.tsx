'use client';
import Image from 'next/image';
import React, { useState } from 'react';

interface FacultyMember {
  name: string;
  degree: string;
  position: string;
  profileImg: string;
  bio: string;
}

const facultyList: FacultyMember[] = [
  {
    name: 'Dr. Anjali Rao',
    degree: 'Ph.D. in Artificial Intelligence',
    position: 'Professor & Head of Department',
    profileImg: '/images/img1.jpeg',
    bio: 'Dr. Rao has over 20 years of teaching and research experience in AI and Data Science.',
  },
  {
    name: 'Prof. Rajeev Menon',
    degree: 'M.Tech in Embedded Systems',
    position: 'Associate Professor',
    profileImg: '/images/img2.jpeg',
    bio: 'Specialized in Embedded Systems and IoT, Prof. Menon leads various student innovation programs.',
  },
  {
    name: 'Dr. Meena Iyer',
    degree: 'Ph.D. in Cybersecurity',
    position: 'Assistant Professor',
    profileImg: '/images/img3.jpeg',
    bio: 'Expert in Cybersecurity and Cloud Computing, Dr. Meena has several international publications.',
  },
  {
    name: 'Prof. Vinay Kulkarni',
    degree: 'M.Tech in Software Engineering',
    position: 'Assistant Professor',
    profileImg: '/images/img4.jpeg',
    bio: 'Known for his creative teaching in Software Engineering and Web Development.',
  },
  {
    name: 'Dr. Kavitha Sharma',
    degree: 'Ph.D. in Machine Learning',
    position: 'Professor',
    profileImg: '/images/img5.jpeg',
    bio: 'A senior faculty with deep knowledge in Machine Learning and Natural Language Processing.',
  },
];

const FacultyCard: React.FC<FacultyMember> = ({
  name,
  degree,
  position,
  profileImg,
  bio,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <div className="max-w-lg w-full rounded-2xl shadow-lg overflow-hidden bg-transparent p-5 relative">
      {/* Image section */}
      <div
        className="relative w-full h-96 cursor-pointer"
        onClick={handleCardClick}
      >
        <Image
          src={profileImg}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>

      {/* Details section */}
      {showDetails && (
        <div className="text-center mt-4">
          <h3 className="text-3xl font-bold text-white">{name}</h3>
          <p className="text-lg text-white italic">{degree}</p>
          <p className="text-lg text-indigo-300 font-medium">{position}</p>
          <p className="mt-3 text-lg text-white">{bio}</p>
        </div>
      )}
    </div>
  );
};

const Faculty: React.FC = () => {
  return (
    <section className="py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">Meet Our Faculty</h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {facultyList.map((faculty, index) => (
          <FacultyCard key={index} {...faculty} />
        ))}
      </div>
    </section>
  );
};

export default Faculty;
