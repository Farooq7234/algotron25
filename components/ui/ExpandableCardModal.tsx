import React, { useRef } from "react";
import { useOutsideClick } from "@/components/hooks/use-outside-click";
import { Calendar, Clock } from "lucide-react";

interface ExpandableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  description: string;
  linkTo: string;
}

const ExpandableCardModal: React.FC<ExpandableCardModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  title,
  description,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 pt-40">
      <div
        ref={modalRef}
        className="relative bg-[#0f0f0f] text-white rounded-md shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-5xl font-bold hover:text-red-500 z-10"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Left Content */}
        <div className="space-y-4">
          <h1 className="text-purple-400 text-sm font-semibold uppercase">
            Technical Event
          </h1>

          <h2 className="text-4xl font-bold text-white">{title}</h2>

          <p className="text-md text-gray-300">{description}</p>

          {/* Time & Round Info */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1">
              <Clock size={18} className="text-white" />
              <span className="text-purple-400 font-medium">Prelims</span>
              <span className="text-white text-sm">Rolling Event (35 mins)</span>
            </div>

            <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1">
              <Clock size={18} className="text-white" />
              <span className="text-purple-400 font-medium">Finals</span>
              <span className="text-white text-sm">45 mins</span>
            </div>

            <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1">
              <Calendar size={18} className="text-white" />
              <span className="text-white text-sm">April 12</span>
            </div>
          </div>

          {/* Rules Section */}
          <div className="mt-4 space-y-3">
            <h3 className="text-green-400 font-semibold">• Team Formation</h3>
            <p className="text-sm text-gray-300 ml-4">
              ◦ Up to 2-3 members per team
            </p>

            <h3 className="text-green-400 font-semibold">• Rules</h3>
            <ul className="list-disc ml-8 text-sm text-gray-300 space-y-1">
              <li>
                Prelims: Sample Input & Output will be given, find the logic and output.
              </li>
              <li>
                Finals: One member gets clues to logic; others decode it.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center items-center">
          <img
            src={imageSrc}
            alt={title}
            className="rounded-md w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpandableCardModal;
