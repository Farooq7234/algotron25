'use client';

import { useState } from 'react';
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import FlareCursor from "@/components/Cursor";  

const faqData = [
    {
      question: 'How can I register for Algotron 2025?',
      answer: 'You can register by clicking on the "Register" button at the top of this page. Fill out the registration form with your details and follow the instructions for payment.'
    },
    {
      question: 'Will I get a refund if I don\'t attend after registering?',
      answer: 'No, the registration fee is non-refundable if you fail to attend.'
    },
    {
      question: 'Can I register alone, or only as a team?',
      answer: 'You can register as an individual or as a team depending on the event requirements. Some events are individual-based while others require team participation.'
    },
    {
      question: 'How can I contact the organizing team?',
      answer: 'You can contact the organizing team through the contact details provided at the bottom of this page. We have two coordinators available to assist you.'
    },
    {
      question: 'What ID is required at the venue?',
      answer: 'Please bring your college ID card and a government-issued photo ID for verification at the venue.'
    },
    {
      question: 'Can I register on the spot at the venue?',
      answer: 'Yes, on-spot registration will be available, but we recommend pre-registration to secure your spot and for a smoother check-in experience.'
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
      <h2 className="text-4xl font-bold mb-16 text-center gradient-text">Frequently Asked Questions</h2>

      <div className='py-3 mx-auto px-3'>
        <div className='mx-auto mx max-w-7xl flex flex-col'>
          {faqData.map((faq, index) => (
            <div key={faq.question} className="z-10">
              <div
                onClick={() => handleClick(index)}
                className="flex cursor-pointer justify-between gap-2 text-[#bdbdbe] hover:text-green-400 font-space bg-black border-[#76767661] border m-3 sm:m-5 px-5 py-5 rounded-xl"
              >
                <span className="text-lg sm:text-2xl font-thin">{faq.question}</span>
                <span>
                  {openStates[index] ? (
                    <IconChevronUp stroke={1.5} size={24} />
                  ) : (
                    <IconChevronDown size={24} stroke={1.5} />
                  )}
                </span>
              </div>
              {openStates[index] ? (
                <div className='flex  py-3'>
                  <p className='text-sm sm:text-xl text-green-400 font-space px-5 sm:px-10 text-wrap '>{faq.answer}</p>
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