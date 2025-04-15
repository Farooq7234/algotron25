import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
const About = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.4 } },
  };

  return (
    <motion.div
      id="about"
      className="container items-center mx-auto my-10"
      initial="hidden"
      animate={controls}
      variants={fadeInVariants}
      ref={ref}
    >
      <h1 className='text-center text-5xl sm:text-7xl font-semibold Welcome-text font-space text-transparent m-10'>
        About Algotron 4.0
      </h1>

      <motion.div
        className="flex flex-col lg:flex-row items-center justify-center lg:justify-between p-8 gap-16"
        variants={fadeInVariants}
      >
        <motion.div
          className="px-2 sm:px-40"
          variants={fadeInVariants}
        >
          <h2 className="text-4xl flex-wrap lg:text-6xl flex justify-around font-space font-semibold mb-2 lg:mb-6 text-left lg:text-left bg-clip-text text-transparent bg-gradient-to-b from-white to-[#AAAAAA]">
            <p className='Welcome-text font-space'>National Level Technical Symposium!</p>
          </h2>
          <motion.p
            className="mt-9 sm:mt-0 text-2xl lg:text-4xl font-space text-justify"
            variants={fadeInVariants}
          >
            Algotron 2025, organized by the Department of Computer Science and Engineering at TPGIT Vellore, is set to be a dynamic convergence of innovation, intellect, and inspiration...
          </motion.p>
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default About;
