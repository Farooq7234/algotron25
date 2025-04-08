import React from 'react';
import { FaUser } from 'react-icons/fa';

const Contact: React.FC = () => {
  const contacts = [
    { name: 'Madesh S', phone: '+91 91506 14484' },
    { name: 'Navinkumar R', phone: '+91 88388 92353' },
    { name: 'Krishna Keerthan K', phone: '+91 77089 47628' },
    { name: 'Umar Farooq A', phone: '+91 73972 90572' },
  ];

  return (
    <section className="bg-black text-white py-14 px-4 text-center" id='contact'>
      <h2 className="text-xl md:text-2xl font-bold text-purple-400 mb-12 tracking-wide">
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
