import { AuroraText } from '@/components/magicui/aurora-text';
import { LineShadowText } from '@/components/magicui/line-shadow-text';
import { Link } from 'react-router-dom';
import Timer from './sub/Timer';

const Hero = () => {
  const shadowColor = "white";

  return (
    <section className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'>
      <div className='flex flex-col items-center justify-center w-full px-4 py-16 sm:py-20 space-y-12'>

        {/* Logos */}
        <div className='text-center space-y-6'>
          <div className="flex justify-between w-full max-w-md sm:max-w-xl lg:max-w-4xl mb-8">
            <div className="flex justify-center items-center">
              <img src="/logo/tpgit_logo.png" className="w-14 h-14 sm:w-28 sm:h-28" alt="TPGIT Logo" />
            </div>
            <div className="flex justify-center items-center">
              <img src="/logo/csealogo.png" className="w-16 h-16 sm:w-32 sm:h-32" alt="CSE Logo" />
            </div>
            <div className="flex justify-center items-center">
              <img src="/logo/TamilNadu_Logo.svg" className="w-12 h-12 sm:w-24 sm:h-24" alt="Tamil Nadu Logo" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight">
            <AuroraText className='mr-3'>Algotron</AuroraText>
            <LineShadowText className="italic" shadowColor={shadowColor}>4.0</LineShadowText>
          </h1>

          {/* Subtitle */}
          <p className='text-xl sm:text-2xl md:text-3xl text-purple-300/80 font-medium'>
            A National Level Technical Symposium
          </p>
        </div>

        {/* Date */}
        <div className='bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-purple-300/50'>
          <p className='text-white text-base sm:text-lg md:text-xl font-medium tracking-wider'>
            APRIL 25
          </p>
        </div>

        {/* Timer & Register Button */}
        <div className='flex flex-col items-center space-y-16'>
          <div className='mt-4'>
            <Timer />
          </div>

          <div>
            <Link to="/signup">
              <button
                className="mt-6 cursor-pointer w-[12em] sm:w-[16em] md:w-[18em] h-[3em] text-white font-semibold text-sm sm:text-base md:text-lg bg-gradient-to-r from-violet-500 via-sky-500 to-pink-500 bg-[length:400%] rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-[length:200%] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 active:scale-95"
                style={{ zIndex: 0 }}
              >
                Register Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
