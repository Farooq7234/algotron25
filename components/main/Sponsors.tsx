import React from "react";
import Image from "next/image";

const sponsors = [
  { name: "Sponsor 1", logo: "/qspider.png" },
  { name: "Sponsor 2", logo: "/algotron_logo.png" },
  { name: "Sponsor 3", logo: "/algotron_logo.png" },
  { name: "Sponsor 4", logo: "/algotron_logo.png" },
  { name: "Sponsor 5", logo: "/algotron_logo.png" },
  // Add more if needed
];

const SponsorSection: React.FC = () => {
  return (
    <section className="py-32 overflow-hidden ">
      <h1 className="text-center text-5xl sm:text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-mono">
        Our Sponsors
      </h1>

      <div className="relative w-full overflow-x-hidden mt-14">
        <div className="flex justify-center items-center gap-40 flex-wrap">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-80 h-52 flex items-center justify-center bg-white/70 rounded-xl px-4"
            >
              

              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={250}
                height={100}
                className="object-contain max-h-full  transition duration-300 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
