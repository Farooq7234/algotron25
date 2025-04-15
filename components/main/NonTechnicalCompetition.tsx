'use client';

import React, { useState, useMemo } from "react";
import Card from "../sub/CompetitionCard";
import ExpandableCardModal from "../ui/ExpandableCardModal";
import FlareCursor from "./Cursor";
import Navbar from "@/components/main/Navbar";


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
}

const NonTechnical: React.FC<Types> = ({ types }) => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardDataList: EventCardData[] = useMemo(() => [
    {
      imageSrc: "/images/events/Connection.jpg",
      title: "Connections",
      description: "Decode clues, explore the campus, and race to the finish!",
      linkTo: "https://your-link.com/treasure",
      eventDate: "April 16",
      rounds: [
        { title: "Hunt Round", duration: "45 mins" }
      ],
      teamInfo: "3–5 members per team",
      rules: [
        "Follow clues in sequence.",
        "No internet or external help.",
        "Respect college property during the hunt."
      ]
    },
    {
      imageSrc: "/images/events/Photography.jpg",
      title: "Photography",
      description: "Beat the clock in quirky 60-second challenges!",
      linkTo: "https://your-link.com/minute",
      eventDate: "April 16",
      rounds: [
        { title: "Qualifier", duration: "10 mins" },
        { title: "Showdown", duration: "15 mins" }
      ],
      teamInfo: "2 members per team",
      rules: [
        "Each task must be completed in under a minute.",
        "No retries allowed.",
        "Points based on accuracy and speed."
      ]
    },
    {
      imageSrc: "/images/events/Chess.jpg",
      title: "Chess",
      description: "Step into the shoes of a celeb or politician and face the media!",
      linkTo: "https://your-link.com/mockpress",
      eventDate: "April 17",
      rounds: [
        { title: "Speech + Q&A", duration: "20 mins" }
      ],
      teamInfo: "Solo",
      rules: [
        "Choose a famous personality.",
        "Stay in character throughout.",
        "Engage with the 'press' (audience) confidently."
      ]
    },
    {
      imageSrc: "/images/events/Box-cricket.jpg",
      title: "Box Cricket",
      description: "Build your dream team in this simulated IPL auction event!",
      linkTo: "https://your-link.com/ipl",
      eventDate: "April 17",
      rounds: [
        { title: "Bidding Round", duration: "45 mins" }
      ],
      teamInfo: "3–4 per team",
      rules: [
        "Fixed budget for each team.",
        "Bid smartly to form a balanced team.",
        "Points based on team value and player performance analysis."
      ]
    }
    ,
    {
      imageSrc: "/images/events/E-sports.jpg",
      title: "E-sports",
      description: "Build your dream team in this simulated IPL auction event!",
      linkTo: "https://your-link.com/ipl",
      eventDate: "April 17",
      rounds: [
        { title: "Bidding Round", duration: "45 mins" }
      ],
      teamInfo: "3–4 per team",
      rules: [
        "Fixed budget for each team.",
        "Bid smartly to form a balanced team.",
        "Points based on team value and player performance analysis."
      ]
    }
  ], []);


  const handleCardClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };
  return (
    <div className="relative min-h-screen  text-white">
      {/* <Navbar /> */}
      <FlareCursor />

      <h1 className="pt-28 text-center text-5xl sm:text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-200 bg-clip-text font-space m-10 my-10">
        {types}
      </h1>

      {/* Cards */}
      <div className="flex flex-col items-center justify-center px-4 pb-10 w-full ">
        <div className="grid grid-cols-1 gap-x-40 md:grid-cols-2 lg:grid-cols-3">
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
  />
)}


    </div>
  );
};

export default NonTechnical;
