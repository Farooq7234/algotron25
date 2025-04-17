import React from 'react';
import { FaUser } from 'react-icons/fa';

const Contact: React.FC = () => {
  const contacts = [
    { name: 'KAUSIK V', phone: '+91 88387 87722' },
    { name: 'UDHAYA REKHA M', phone: '+91 90877 16474' }
  ];

  return (
    <section className=" text-white py-28 px-4 text-center" id='contact'>
      <h2 className="text-2xl md:text-5xl Welcome-text text-transparent font-semibold text-purple-400 mb-12 tracking-wide">
        ✦ Contact & Location ✦
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-[#0e0e0e] border border-[#2d2d2d] rounded-full px-6 py-3 shadow-md hover:shadow-purple-500/40 transition duration-300"
          >
            <FaUser className="text-white text-lg" />
            <span className="font-medium">{contact.name}</span>
            <span className="text-purple-400 font-semibold">{contact.phone}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;
