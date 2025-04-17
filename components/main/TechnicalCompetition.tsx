'use client';

import React, { useState, useMemo } from "react";
import Card from "../sub/CompetitionCard";
import ExpandableCardModal from "../ui/ExpandableCardModal";
import FlareCursor from "./Cursor";

interface Types {
  types: string;
}

interface EventCardData {
  imageSrc: string;
  title: string;
  description: string;
  linkTo: string;
  eventDate: string;
  rounds: { title: string; duration: string }[];
  teamInfo: string;
  rules: string[];
  coordinators: { name: string; phone: string }[];
}

const Technical: React.FC<Types> = ({ types }) => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardDataList: EventCardData[] = useMemo(() => [
    {
      imageSrc: "/images/events/Quiz.png",
      title: "Tech Quiz",
      description: "Put your knowledge to the test in this ultimate tech showdown!",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: "Prelims", duration: "30 mins" },
        { title: "Finals", duration: "45 mins" }
      ],
      teamInfo: "Solo or a team of duo",
      rules: [
        "Compete in solo or teams of two through three intense rounds filled with mind-boggling questions. No phones, no second chances — just pure brainpower. Stay sharp, play fair, and aim for the top. Let the smartest team win!"
      ],
      coordinators: [
        { name: "Ajay", phone: "9876543210" },
        { name: "Keerthi", phone: "9123456789" }
      ]
    },
    {
      imageSrc: "/images/events/Idea.png",
      title: "Ideathon",
      description: "Present your innovative ideas that can solve real-world problems.",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: "Presentation Round", duration: "10 mins per team" }
      ],
      teamInfo: "Up to 3 per team",
      rules: [
        "Presentation should not exceed time limit.",
        "Originality will be rewarded.",
        "No plagiarised content.",
        "send your ppt's to this email before 23rd April."
      ],
      coordinators: [
        { name: "Saran", phone: "9876501234" },
        { name: "Nivetha", phone: "9123498765" }
      ]
    },
    {
      imageSrc: "/images/events/Code.png",
      title: "Strike The Code",
      description: "Solve programming challenges with accuracy and speed.",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: "Prelims", duration: "25 mins" },
        { title: "Finals", duration: "30 mins" }
      ],
      teamInfo: "Solo or Duo allowed",
      rules: [
        "Sharpen your logic and dive into this 90-minute challenge where only the smartest minds survive! Go solo or team up with a buddy to crack problems under pressure — but no switching screens, no mobiles, and definitely no AI tools. Stay focused, stay fair, and bring your A-game. One slip could cost you the win!"
      ],
      coordinators: [
        { name: "Mohan", phone: "9876567890" },
        { name: "Divya", phone: "9001234567" }
      ]
    },
    {
      imageSrc: "/images/events/Design.png",
      title: "Posteria",
      description: "Got a flair for colors and creativity? Fire up your favorite design app and let your imagination run wild!",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: "Presentation", duration: "10 mins + 5 mins Q&A" }
      ],
      teamInfo: "Individual only",
      rules: [
        "Format: JPG, PNG, or PDF.",
        "Software Allowed: Canva(Suggested), Word, Figma, or any digital design tool.",
        "Theme: Will be disclosed at the beginning of the competition",
        "Originality: All work must be original. Use of AI-generated art, stock templates, or plagiarism will lead to disqualification",
      ],
      coordinators: [
        { name: "Raj", phone: "7890654321" },
        { name: "Anjali", phone: "9101234987" }
      ]
    }
  ], []);

  const handleCardClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative text-white w-full">
        <FlareCursor />

        <h1 className="pt-28 text-center text-5xl sm:text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-space m-10 my-10">
          {types}
        </h1>

        {/* Cards */}
        <div className="flex flex-col items-center justify-center px-4 pb-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {cardDataList.map((card, idx) => (
              <Card
                key={idx}
                imageSrc={card.imageSrc}
                initialDescription={''}
                linkTo={card.linkTo}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedEvent && (
          <ExpandableCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            imageSrc={selectedEvent.imageSrc}
            title={selectedEvent.title}
            description={selectedEvent.description}
            linkTo={selectedEvent.linkTo}
            eventDate={selectedEvent.eventDate}
            rounds={selectedEvent.rounds}
            teamInfo={selectedEvent.teamInfo}
            rules={selectedEvent.rules}
            coordinators={selectedEvent.coordinators}
          />
        )}
      </div>
    </>
  );
};

export default Technical;
