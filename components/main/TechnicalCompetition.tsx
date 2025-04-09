'use client';

import React, { useState } from "react";
import Card from "../sub/CompetitionCard";
import ExpandableCardModal from "../ui/ExpandableCardModal"; // import modal
import FlareCursor from "./Cursor";
import Navbar from "@/components/main/Navbar";
import Footer from "./Footer";

interface Types {
  types: string;
}

const sampleCardData = {
  imageSrc: "/images/skyquest1.jpeg",
  title: "Your Event Title",
  description:
    "Get ready for the ultimate adrenaline rush in the most thrilling drone challenge yet! With twists and loops it's a high-flying adventure like no other. Strap in, rev up, and prepare to soar to new heights in this electrifying competition!",
  linkTo:
    "https://www.canva.com/design/DAF_BUmtfPE/oortHCPz2bSUfzKOuzhpdw/view?utm_content=DAF_BUmtfPE&utm_campaign=designshare&utm_medium=link&utm_source=editor",
};

const Technical: React.FC<Types> = ({ types }) => {
  const [selectedCard, setSelectedCard] = useState<null | typeof sampleCardData>(
    null
  );

  return (
    <div className="max-h-screen relative ">
      <FlareCursor />
      <h1 className="pt-28 text-center text-3xl sm:text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-space m-10">
        {types}
      </h1>
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-center">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(4)].map((_, idx) => (
            <Card
              key={idx}
              imageSrc={sampleCardData.imageSrc}
              title={sampleCardData.title}
              initialDescription={sampleCardData.description}
              linkTo={sampleCardData.linkTo}
              onClick={() => setSelectedCard(sampleCardData)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <ExpandableCardModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        imageSrc={selectedCard?.imageSrc || ""}
        title={selectedCard?.title || ""}
        description={selectedCard?.description || ""}
        linkTo={selectedCard?.linkTo || ""}
      />

      <Navbar />
      <Footer />
    </div>
  );
};

export default Technical;
