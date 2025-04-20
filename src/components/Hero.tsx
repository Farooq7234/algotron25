import { motion } from 'framer-motion';
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='text-center space-y-6'
        >
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
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-purple-300/50'
        >
          <p className='text-white text-base sm:text-lg md:text-xl font-medium tracking-wider'>
            APRIL 25
          </p>
        </motion.div>

        {/* Timer & Register Button */}
        <div className='flex flex-col items-center space-y-16'>
          <motion.div
            initial="initial"
            animate="animate"
            className='mt-4'
          >
            <Timer />
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
          >
            <Link to="/sign-up">
              <motion.button
                className="mt-6 cursor-pointer w-[12em] sm:w-[16em] md:w-[18em] h-[3em] text-white font-semibold text-sm sm:text-base md:text-lg bg-gradient-to-r from-violet-500 via-sky-500 to-pink-500 bg-[length:400%] rounded-[10px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:via-purple-500 before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[10px] before:hover:blur-lg before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                style={{ zIndex: 0 }}
              >
                Register Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
