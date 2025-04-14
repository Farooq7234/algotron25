'use client';

import React, { useState, useMemo } from "react";
import Card from "../sub/CompetitionCard";
import ExpandableCardModal from "../ui/ExpandableCardModal";
import FlareCursor from "./Cursor";
import Footer from "./Footer";

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

const Technical: React.FC<Types> = ({ types }) => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const cardDataList: EventCardData[] = useMemo(() => [
    {
      imageSrc: "/images/events/Tech_quiz.jpg",
      title: "Tech Quiz",
      description: "High-flying aerial drone race with loops, obstacles, and adrenaline!",
      linkTo: "https://your-link.com/drone",
      eventDate: "April 12",
      rounds: [
        { title: "Prelims", duration: "30 mins" },
        { title: "Finals", duration: "45 mins" }
      ],
      teamInfo: "2–3 members per team",
      rules: [
        "Prelims: Complete a timed obstacle course.",
        "Finals: Perform aerial tricks and precision landing."
      ]
    },
    {
      imageSrc: "/images/events/Idea.jpg",
      title: "Idea Presentation",
      description: "Battle your bots in an arena of sparks, tactics, and destruction!",
      linkTo: "https://your-link.com/robotics",
      eventDate: "April 13",
      rounds: [
        { title: "Knockout", duration: "10 mins" },
        { title: "Finals", duration: "15 mins" }
      ],
      teamInfo: "Up to 4 per team",
      rules: [
        "Build your own bot (restrictions apply).",
        "No external interference or weapons.",
        "Win by pushing opponent out or disabling them."
      ]
    },
    {
      imageSrc: "/images/events/Coding.jpg",
      title: "Coding",
      description: "Race against time to find and fix bugs in tricky programs.",
      linkTo: "https://your-link.com/debug",
      eventDate: "April 14",
      rounds: [
        { title: "Prelims", duration: "25 mins" },
        { title: "Finals", duration: "30 mins" }
      ],
      teamInfo: "Solo or Duo allowed",
      rules: [
        "Code in C/Python/Java.",
        "Pre-written code with hidden bugs.",
        "Debug the code and explain your logic."
      ]
    },
    
    {
      imageSrc: "/images/events/ppt.jpg",
      title: "Paper Presentation",
      description: "Design fast, think smart. Solve user problems with great UI/UX.",
      linkTo: "https://your-link.com/uiux",
      eventDate: "April 15",
      rounds: [
        { title: "Design Phase", duration: "1 hour" }
      ],
      teamInfo: "1–2 per team",
      rules: [
        "Use any design tool (Figma/XD).",
        "Follow the given user problem statement.",
        "Pitch your design in 5 minutes."
      ]
    }
  ], []);
  console.log(cardDataList);
  console.log(selectedEvent);

  const handleCardClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };
  

  return (
 <>   <div className="relative  text-white w-full">
 <FlareCursor />

 <h1 className="pt-28 text-center text-4xl sm:text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-space m-10 my-10">
   {types}
 </h1>

 {/* Cards */}
 <div className="flex flex-col items-center justify-center px-4 pb-10">
   <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
     {cardDataList.map((card, idx) => (
       <Card
         key={idx}
         imageSrc={card.imageSrc}
         initialDescription={card.description}
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
<Footer />
</>
  );
};

export default Technical;
