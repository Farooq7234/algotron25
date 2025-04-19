
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import CountdownTimer from '../components/CountdownTimer';
import EventCard from '../components/EventCard';
import FacultyCard from '../components/FacultyCard';
import SponsorCard from '../components/SponsorCard';
import Navbar from '../components/Navbar';
import FaqAccordion from '../components/ui/FaqAccordion';
import { fetchEvents } from '../firebase/firebase';
import ImageGallery from '../components/ImageGallery';

// Import images for events, faculty, and sponsors
// Note: In actual implementation, these would be properly imported

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any>({});
  const targetDate = new Date('April 25, 2025 00:00:00');
  
  // Faculty data
  const faculty = [
   
    {
      name: 'Dr.N.Jagadeeswari',
      qualification: 'M.E.,Ph.D.',
      title: 'Assistant Professor',
      role: 'Treasurer & Event Coordinator',
      image: '/faculty/1.png'
    },
    {
      name: 'Dr.P.K.Palani',
      qualification: 'B.E.(HONS),M.E.,Ph.D.',
      title: 'Principal',
      role: '',
      image: '/faculty/2.png'
    },
    {
      name: 'Dr.S.LETITIA',
      qualification: 'M.E.,Ph.D.',
      title: 'Head of the Department',
      role: '',
      image: '/faculty/3.jpg'
    },
    {
      name: 'Prof.B.Jothi',
      qualification: 'M.E.',
      title: 'Associate Professor',
      role: '',
      image: '/faculty/4.png'
    },
    {
      name: 'Dr.K.Saraswathi',
      qualification: 'M.E.,Ph.D.',
      title: 'Assistant Professor',
      role: '',
      image: '/faculty/5.png'
    }
  ];
  
  // Sponsors data
  const sponsors = [
    {
      name: 'QSpiders',
      image: '/sponsor/qspider.png'
    },
    {
      name: 'Algotron',
      image: '/sponsor/default.png'
    },
    {
      name: 'Algotron',
      image: '/sponsor/default.png'
    },
    {
      name: 'Algotron',
      image: '/sponsor/default.png'
    },
    {
      name: 'Algotron',
      image: '/sponsor/default.png'
    }
  ];
  
  // FAQ data
  const faqs = [
    {
      question: 'How can I register for Algotron 2025?',
      answer: 'You can register by clicking on the "Register" button at the top of this page. Fill out the registration form with your details and follow the instructions for payment.'
    },
    {
      question: 'Will I get a refund if I don\'t attend after registering?',
      answer: 'No, the registration fee is non-refundable if you fail to attend.'
    },
    {
      question: 'Can I register alone, or only as a team?',
      answer: 'You can register as an individual or as a team depending on the event requirements. Some events are individual-based while others require team participation.'
    },
    {
      question: 'How can I contact the organizing team?',
      answer: 'You can contact the organizing team through the contact details provided at the bottom of this page. We have two coordinators available to assist you.'
    },
    {
      question: 'What ID is required at the venue?',
      answer: 'Please bring your college ID card and a government-issued photo ID for verification at the venue.'
    },
    {
      question: 'Can I register on the spot at the venue?',
      answer: 'Yes, on-spot registration will be available, but we recommend pre-registration to secure your spot and for a smoother check-in experience.'
    }
  ];
  
  // Gallery images
  
  
  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };
    
    getEvents();
  }, []);
  
  const techEvents = Object.entries(events)
    .filter(([_, event]: [string, any]) => event.type === 'technical')
    .map(([id, event]: [string, any]) => ({
      id,
      ...event,
      image: '/' + event.image || '/default-tech.png'
    }));
  
  const nonTechEvents = Object.entries(events)
    .filter(([_, event]: [string, any]) => event.type === 'non-technical')
    .map(([id, event]: [string, any]) => ({
      id,
      ...event,
      image: '/' + event.image || '/default-tech.png'
    }));
  
  // Helper function to get tech event images
  
  
  // Helper function to get non-tech event images
  
  
  return (
    <div className="min-h-screen">
       <Navbar />
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-10">
            <div className="flex space-x-8 sm:space-x-16">
              <img src="/logo/tpgit_logo.png" alt="Logo 1" className="w-20 h-20 sm:w-32 sm:h-32 object-contain" />
              <img src="/logo/csealogo.png" alt="Logo 2" className="w-20 h-20 sm:w-32 sm:h-32 object-contain" />
              <img src="/logo/TamilNadu_Logo.svg" alt="Logo 3" className="w-20 h-20 sm:w-32 sm:h-32 object-contain" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold mb-4">
            <span className="gradient-text">ALGOTRON</span> <span className="text-white">4.0</span>
          </h1>
          <p className="text-gray-300 text-xl mb-8">A National Level Technical Symposium</p>
          
          <div className="inline-block bg-black bg-opacity-30 px-6 py-2 rounded-full border border-purple-600 mb-10">
            <div className="flex items-center justify-center text-purple-400">
              <Calendar size={20} className="mr-2" />
              <span>APRIL 25</span>
            </div>
          </div>
          
          <CountdownTimer targetDate={targetDate} />
          
          <div className="mt-12">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 glow-button"
            >
              Register Now
            </button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center gradient-text">About Algotron 4.0</h2>
          
          <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-purple-300 font-sharetech">
  A National Level Technical Symposium!
</h3>

<p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto text-justify font-sharetech">
  Algotron 2025, organized by the Department of Computer Science and Engineering at Thanthai Periyar
  Government Institute of Technology (TPGIT), Vellore, is set to be a dynamic convergence of innovation, intellect,
  and inspiration. This annual technical symposium serves as a vibrant platform where tech enthusiasts, coders,
  and problem-solvers from various institutions unite to showcase their talents, exchange ideas, and push the
  boundaries of what's possible in the digital era. Whether you're a passionate programmer, an aspiring innovator,
  or just curious about the world of tech — Algotron 2025 is the place to be. Join us and be a part of a celebration
  that blends learning with excitement and sparks the future of technology.
</p>
          </div>
          <ImageGallery/>
        </div>
      </section>
      
      {/* Events Section */}
      <section id="events" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center gradient-text">Events</h2>
          
          {/* Technical Events */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-10 text-center text-indigo-400">Technical Events</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techEvents.length > 0 ? (
                techEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              ) : (
                // Placeholder tech events
                [
                  { id: 'quiztronic', name: 'Quiztronic', type: 'technical' as 'technical', image: '/events/Quiz.png', description: 'A technical quiz competition', rules: 'Individual event. Max 1 hour.', venue: 'Lab A101', time: '10:00 AM', registrationOpen: true },
                  { id: 'ideaforge', name: 'IdeaForge', type: 'technical' as 'technical', image: '/events/Quiz.png', description: 'Project idea presentation', rules: 'Team of 2. 15 mins per team.', venue: 'Seminar Hall', time: '11:30 AM', registrationOpen: true },
                  { id: 'codestorm', name: 'CodeStorm', type: 'technical' as 'technical', image: '/events/Quiz.png', description: 'Competitive coding challenge', rules: 'Individual event. 2 hours.', venue: 'Lab B202', time: '2:00 PM', registrationOpen: true },
                  { id: 'designverse', name: 'Design Verse', type: 'technical' as 'technical', image: '/lovable-uploads/933d6938-2040-471e-88c2-1254f945c15b.png', description: 'UI/UX design competition', rules: 'Individual or team of 2. 3 hours.', venue: 'Lab C303', time: '9:30 AM', registrationOpen: true }
                ].map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              )}
            </div>
          </div>
          
          {/* Non-Technical Events */}
          <div>
            <h3 className="text-3xl font-bold mb-10 text-center text-pink-400">Non-Technical Events</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nonTechEvents.length > 0 ? (
                nonTechEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              ) : (
                // Placeholder non-tech events
                [
                  { id: 'crickwitz', name: 'Crick Witz', type: 'non-technical' as 'non-technical', image: '/lovable-uploads/81e900b1-039b-441d-9876-979017f03c33.png', description: 'Cricket trivia and fun games', rules: 'Team of 3. Multiple rounds.', venue: 'Outdoor Stage', time: '3:30 PM', registrationOpen: true },
                  { id: 'rampagerumble', name: 'Rampage Rumble', type: 'non-technical' as 'non-technical', image: '/lovable-uploads/81e900b1-039b-441d-9876-979017f03c33.png', description: 'Gaming tournament', rules: 'Individual participation. Knockout rounds.', venue: 'Game Arena', time: '4:00 PM', registrationOpen: true },
                  { id: 'framefusion', name: 'FrameFusion', type: 'non-technical' as 'non-technical', image: '/lovable-uploads/81e900b1-039b-441d-9876-979017f03c33.png', description: 'Photography contest', rules: 'Individual entry. Theme-based submissions.', venue: 'Creative Zone', time: '1:00 PM', registrationOpen: true }
                ].map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Faculty Section */}
      <section id="faculty" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center gradient-text">Meet Our Faculties</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {faculty.map((member, index) => (
              <FacultyCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Sponsors Section */}
      <section id="sponsors" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center gradient-text">Our Sponsors</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {sponsors.map((sponsor, index) => (
              <SponsorCard key={index} {...sponsor} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center gradient-text">Contact & Location</h2>
          
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="bg-black bg-opacity-70 p-4 rounded-lg border border-purple-800 flex items-center space-x-4">
                <Users size={24} className="text-green-500" />
                <div>
                  <p className="text-green-400 font-medium">KAUSIK V</p>
                  <p className="text-gray-300">+91 88387 87722</p>
                </div>
              </div>
              
              <div className="bg-black bg-opacity-70 p-4 rounded-lg border border-purple-800 flex items-center space-x-4">
                <Users size={24} className="text-green-500" />
                <div>
                  <p className="text-green-400 font-medium">UDHAYA REKHA M</p>
                  <p className="text-gray-300">+91 90877 18474</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black bg-opacity-70 p-4 rounded-lg border border-purple-800 flex items-center space-x-4">
              <MapPin size={24} className="text-purple-500" />
              <div>
                <p className="text-purple-400 font-medium">Thanthai Periyar Government Institute of Technology</p>
                <p className="text-gray-300">Bagayam, Vellore - 632002, Tamil Nadu, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faqs" className="py-20 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center gradient-text">Frequently Asked Questions</h2>
          
          <FaqAccordion items={faqs} />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">© Thanthai Periyar Government Institute of Technology - Algotron 4.0</p>
          <div className="text-sm text-gray-500">
            <p> Made with ❤️ by CSE Department</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
