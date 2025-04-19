import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/firebase';
import {
  Menu, X, LogOut, User
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const publicLinks = [
    { name: 'Home', path: '/#home' },
    { name: 'About', path: '/#about' },
    { name: 'Events', path: '/#events' },
    { name: 'Faculties', path: '/#faculty' },
    { name: 'Sponsors', path: '/#sponsors' },
    { name: 'Contact', path: '/#contact' },
    { name: 'FAQs', path: '/#faqs' }
  ];

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Events', path: '/user/events' },
    { name: 'Payments', path: '/user/payments' },
    { name: 'Tickets', path: '/user/tickets' }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Events', path: '/admin/events' },
    { name: 'Payments', path: '/admin/payments' },
    { name: 'Attendance', path: '/admin/attendance' }
  ];

  const activeLinks = isAdmin
    ? adminLinks
    : currentUser
    ? userLinks
    : isHomePage || isAuthPage
    ? publicLinks
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-md z-50 border-b border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl flex items-center">
              <span className="gradient-text text-2xl font-extrabold tracking-wider">ALGOTRON</span>
              <span className="ml-1 text-3xl font-light">4.0</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {activeLinks.map((link) =>
              (isHomePage || isAuthPage) && link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    location.pathname === link.path
                      ? 'text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-300 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {link.name}
                </Link>
              )
            )}

            {!currentUser && (isHomePage || isAuthPage) && (
              <Link
                to="/signup"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Register
              </Link>
            )}

            {!currentUser && !isHomePage && !isAuthPage && (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <User size={20} className="mr-1" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Register
                </Link>
              </>
            )}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut size={20} className="mr-1" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black bg-opacity-95 backdrop-blur-md z-40 px-4 py-4 space-y-3">
          {activeLinks.map((link) =>
            (isHomePage || isAuthPage) && link.path.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.path}
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-purple-400 bg-gray-900'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            )
          )}

          {!currentUser && (isHomePage || isAuthPage) && (
            <Link
              to="/signup"
              className="block bg-purple-600 text-white w-full text-center px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Register
            </Link>
          )}

          {!currentUser && !isHomePage && !isAuthPage && (
            <>
              <Link
                to="/login"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                <User size={20} className="inline-block mr-2" />
                Login
              </Link>
              <Link
                to="/signup"
                className="block bg-purple-600 text-white w-full text-center px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}

          {currentUser && (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              <LogOut size={20} className="inline-block mr-2" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
