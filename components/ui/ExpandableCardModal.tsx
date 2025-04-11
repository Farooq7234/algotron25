import React, { useRef } from "react";
import { useOutsideClick } from "@/components/hooks/use-outside-click";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";


interface EventRound {
  title: string;
  duration: string;
}

interface ExpandableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  description: string;
  linkTo: string;
  eventDate: string;
  rounds: { title: string; duration: string }[];
  teamInfo: string;
  rules: string[];
}

const ExpandableCardModal: React.FC<ExpandableCardModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  title,
  description,
  eventDate,
  rounds,
  teamInfo,
  rules,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, onClose);

  if (!isOpen) return null;
  console.log(rounds)

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 pt-20 sm:pt-32 my-8">
      <div
        ref={modalRef}
        className="relative bg-[#111111] text-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-screen sm:max-h-[90vh] overflow-y-auto p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl hover:text-red-500 transition"
          aria-label="Close"
        >
          &times;
        </button>


        {/* Left Content */}
        <div className="space-y-5">
          <h1 className="text-lg font-semibold uppercase text-purple-400 tracking-widest">
            Technical Event
          </h1>

          <h2 className="text-4xl font-bold text-white">{title}</h2>

          <p className="text-md text-gray-300 leading-relaxed">{description}</p>

          {/* Time & Round Info */}
          <div className="flex flex-wrap gap-3">
            {rounds.map((round, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1 bg-white/5 hover:bg-white/10 transition"
              >
                <Clock size={18} className="text-white" />
                <span className="text-purple-400 text-md">{round.title}</span>
                <span className="text-white text-md">{round.duration}</span>
              </div>
            ))}

            <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1 bg-white/5 hover:bg-white/10 transition">
              <Calendar size={18} className="text-white" />
              <span className="text-white text-md">{eventDate}</span>
            </div>
          </div>

          {/* Rules Section */}
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-green-400 font-semibold text-2xl">• Team Formation</h3>
              <p className="text-lg text-gray-300 ml-4 mt-1">◦ {teamInfo}</p>
            </div>

            <div>
              <h3 className="text-green-400 font-semibold text-2xl">• Rules</h3>
              <ul className="list-disc ml-8 text-xl text-gray-300 space-y-2 mt-1">
                {rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center items-center">
          <Image
            src={imageSrc}
            width={500}
            height={500}
            alt={title}
            className="rounded-xl w-full h-auto object-cover max-h-[500px] shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpandableCardModal;
