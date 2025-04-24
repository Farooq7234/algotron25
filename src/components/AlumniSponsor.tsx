import React from 'react';
import NeonCard from './ui/NeonCard';

const alumniData = [
  { name: "Nithin", batch: "2024" },
  { name: "Komathi", batch: "2024" },
  { name: "Bharath", batch: "2024" },
  { name: "Arumugam", batch: "2023" },
  { name: "Santhosh", batch: "2023" },
  { name: "Rethika", batch: "2022" },
  { name: "Praveen", batch: "2022" },
];

const AlumniSponsor = () => {
  return (
    <div className="bg-transparent shadow-lg rounded-2xl p-4 w-full max-w-5xl mx-auto mt-8 overflow-hidden">
      {/* <h2 className="text-xl font-bold text-center text-white mb-4">Alumni Sponsors</h2> */}
      <h2 className="text-4xl font-bold mb-16 text-center gradient-text"> Alumni Sponsors</h2>

      <div className="relative overflow-hidden h-36">
        <div className="flex animate-marquee gap-6 whitespace-nowrap">
          {[...alumniData, ...alumniData].map((alumni, index) => (
            <div
              key={index}
              className="min-w-[200px] bg-transparent border border-gray-300 rounded-xl shadow-md p-4 text-center"
            >
              <p className="text-indigo-700 font-bold">{alumni.name}</p>
              <p className="text-sm text-gray-600">Batch {alumni.batch}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlumniSponsor;
