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
      imageSrc: "/images/events/Crick.png",
      title: "Crick Witz",
      description: "Are you the ultimate IPL fan? Prove it in this high-energy quiz showdown!",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: "Prelims", duration: "30 mins" },
        { title: "Finals", duration: "45 mins" }
      ],
      teamInfo: "1-2 members per team",
      rules: [
        "Battle through 5 thrilling rounds, each with 5 quick-fire questions.",
        " You’ve got 30 seconds per question, no second guesses.",
         "Talk fast, think faster — only one answer counts. No negatives, just non-stop cricket fun!"
      ],
      coordinators: [
        { name: "Sanjay C", phone: "8608122761" },
        { name: "Pachaiyappan D", phone: "6380685156" }
      ]
    },
    {
      imageSrc: "/images/events/Rampage.png",
      title: "Rampage Rumble",
      description: "Memorize & Observe Think you’ve got a sharp eye and a sharp mind?",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: " Round", duration: "30 mins" }
      ],
      teamInfo: "Up to 2 members per team",
      rules: [
        "In Ram Rumble, you'll get just 2 minutes to study an image packed with details — then it’s game on!",
        " Answer questions based on what you remember.",
        " The more you observe, the more you score. Simple, fun, and full of surprises — test your memory like never before!"
      ],
      coordinators: [
        { name: "Bhagavathi T", phone: "8870773370" },
        { name: "Saranya K", phone: "8148083394" }
      ]
    },
    {
      imageSrc: "/images/events/Frame.png",
      title: "Frame Fusion",
      description: "Love taking photos? Every picture tells a story – what’s yours?",
      linkTo: "/sign-up",
      eventDate: "April 25",
      rounds: [
        { title: "Prelims", duration: "25 mins" },
        { title: "Finals", duration: "30 mins" }
      ],
      teamInfo: "Solo or Duo members allowed",
      rules: [
        "Grab your camera, step into the world around you, and let your creativity shine as you transform everyday scenes into timeless memories."
      ],
      coordinators: [
        { name: "Avaneesh J", phone: "9486435359" },
        { name: "Kavitha C", phone: "9344658621" }
      ]
    },
    
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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
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
