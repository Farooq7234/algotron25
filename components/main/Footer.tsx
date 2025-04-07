import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <>
      <hr />
      <footer className="text-gray-200 pt-8 z-50 bg-black">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between">
          <div className="mb-8 lg:mb-0 lg:mr-4">
            <h4 className="text-3xl lg:text-3xl mb-4 font-space font-bold">
              Thanthai Periyar Government Institute of Technology, Vellore
            </h4>
            <p className="text-xl lg:text-2xl font-light">
              Registered Address: Bagayam, Vellore - 632002,
              <br />
              Tamil Nadu, India
              <br />
              Phone: 0416-2266666
            </p>
          </div>

          <div className="mb-8 lg:mb-0 lg:mr-8">
            <h4 className="text-3xl lg:text-4xl font-bold font-space mb-4">Contact Us</h4>
            <p className="text-xl lg:text-2xl font-light">
              Student Coordinator: <a href="tel:+919876543210">+91 98765 43210</a>
            </p>
            <p className="text-xl lg:text-2xl font-light">
              Faculty Coordinator: <a href="tel:+919123456789">+91 91234 56789</a>
            </p>
          </div>

          <div>
            <h3 className="text-3xl lg:text-4xl font-bold font-space mb-4">Follow Us</h3>
            <div className="social-links flex">
              <Link
                href="https://www.instagram.com/tpgit_official" // Replace with actual link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="z-50 font-space text-2xl hover:scale-110"
              >
                <FaInstagram className="text-4xl lg:text-5xl mr-3" />
              </Link>
              <Link
                href="https://www.linkedin.com/school/tpgit" // Replace with actual link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="z-50 font-space text-2xl hover:scale-110"
              >
                <FaLinkedin className="text-4xl lg:text-5xl mr-3" />
              </Link>
              <Link
                href="https://github.com/TPGIT-CS" // Replace with actual link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="z-50 font-space text-2xl hover:scale-110"
              >
                <FaGithub className="text-4xl lg:text-5xl mr-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 flex flex-col items-center justify-center">
          <p className="text-2xl font-space">Made with ♥️ by</p>
          <Link
            href="https://github.com/yourusername" // Optional credit link
            target="_blank"
            className="text-purple-400 z-50 font-space text-2xl"
          >
            Algotron 2025 Web Team - Department of CSE
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
