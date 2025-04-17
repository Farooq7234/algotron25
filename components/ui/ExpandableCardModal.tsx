import React, { useRef } from "react";
import { useOutsideClick } from "@/components/hooks/use-outside-click";
import { Calendar, Clock, MapPin, Users2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  coordinators: { name: string; phone: string }[];
}

const ExpandableCardModal: React.FC<ExpandableCardModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  title,
  description,
  linkTo,
  eventDate,
  rounds,
  teamInfo,
  rules,
  coordinators,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, onClose);
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 overflow-hidden border-white">
      <div
      ref={modalRef}
      className="relative bg-[#0D0D0D] text-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 sm:p-10 border-2 border-white max-h-[90vh] overflow-y-auto"
    >
    
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-6xl hover:text-red-500 transition"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="pr-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h2>
          <p className="text-gray-300 mb-6">{description}</p>

          {/* Event Details */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-xl flex flex-col gap-2">
              <h3 className="text-purple-400 font-semibold">Time</h3>
              {rounds.map((round, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="text-gray-100">
                    <strong>{round.title}:</strong> {round.duration}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 p-4 rounded-xl flex flex-col gap-2">
              <h3 className="text-purple-400 font-semibold">Venue</h3>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="text-gray-100">{eventDate}</span>
              </div>
            </div>
          </div>

         {/* Coordinators and Team Info in one row */}
<div className="grid sm:grid-cols-2 gap-4 mb-6">
  {/* Coordinators */}
  <div className="bg-white/5 p-4 rounded-xl flex flex-col gap-2">
    <h3 className="text-purple-400 font-semibold text-xl">Coordinators</h3>
    <div className="flex justify-between text-gray-300">
      <span className="font-medium">John Doe</span>
      <span>+91 98765 43210</span>
    </div>
    <div className="flex justify-between text-gray-300">
      <span className="font-medium">Jane Smith</span>
      <span>+91 91234 56789</span>
    </div>
  </div>

  {/* Team Info */}
  <div className="bg-white/5 p-4 rounded-xl flex flex-col gap-2">
    <h3 className="text-purple-400 font-semibold text-xl">Team Info</h3>
    <div className="flex items-center gap-2 text-gray-300">
      <Users2 size={18} />
      <span>{teamInfo}</span>
    </div>
  </div>
</div>


          {/* Rules Section */}
          <div className="bg-white/5 p-5 rounded-xl mb-6">
            <h3 className="text-purple-400 font-semibold text-2xl mb-3">Rules</h3>
            <ol className="space-y-3 text-gray-300 list-decimal list-inside pl-2">
              {rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">{rule}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Register Button Fixed at Bottom */}
        <div className="mt-6 flex justify-end bottom-0 py-4">
          <Link
            href={linkTo}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-2xl sm:text-3xl transition"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpandableCardModal;
