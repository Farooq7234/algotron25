'use client';

import React, { useState } from 'react';
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Navbar from '@/components/main/Navbar';
import FlareCursor from "@/components/main/Cursor";

const faqData = [

  
  {
    question: "How can I register for Algotron 2025?",
    answer: "Visit the official website and go to the registration page. Fill out the details to complete your registration."
  },
  
  {
    question: "Will I get a refund if I don’t attend after registering?",
    answer: "No, the registration fee is non-refundable if you fail to attend."
  },
  
  {
    question: "Can I register alone, or only as a team?",
    answer: "You can register either as an individual or as a team, based on the event requirements."
  },
  
  {
    question: "How can I contact the organizing team?",
    answer: "You can contact us via the email or phone number listed on the website."
  },
  {
    question: "What ID is required at the venue?",
    answer: "Please bring your college ID card for verification."
  },
  {
    question: "Can I register on the spot at the venue?",
    answer: "Yes, on-spot registration is available."
  }
];


function Questions() {
  const [openStates, setOpenStates] = useState(Array(faqData.length).fill(false));

  function handleClick(index: number) {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  }

  return (
    <section className='pt-20' id="faqs">
      <FlareCursor />
      <h1 className='m-20 text-center text-5xl md:text-6xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-space'>
        Frequently Asked Questions
      </h1>
      <div className='py-6 mx-auto px-3'>
        <div className='mx-auto mx max-w-7xl flex flex-col'>
          {faqData.map((faq, index) => (
            <div key={faq.question} className="z-10">
              <Navbar />
              <div
                onClick={() => handleClick(index)}
                className="flex cursor-pointer justify-between gap-2 text-[#bdbdbe] hover:text-green-400 font-extralight font-space bg-black border-[#76767661] border m-5 px-5 py-8 rounded-xl"
              >
                <span className="text-3xl font-thin">{faq.question}</span>
                <span>
                  {openStates[index] ? (
                    <IconChevronUp stroke={1.5} size={24} />
                  ) : (
                    <IconChevronDown size={24} stroke={1.5} />
                  )}
                </span>
              </div>
              {openStates[index] ? (
                <div className='flex justify-center py-5'>
                  <p className='text-3xl text-purple-200 font-space px-10 text-wrap'>{faq.answer}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Questions;