import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex justify-between items-center py-6 px-6 md:px-12 bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="flex items-center">
        <img src="/path-to-solana-logo.svg" alt="Logo" className="h-8 w-auto" />
        <span className="ml-2 text-white text-xl font-bold">
          SOLANA LAUNCHPAD
        </span>
      </div>
      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Nav Links for Desktop and Hidden on Mobile */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex items-center space-x-8 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-black md:bg-transparent py-6 md:py-0 text-center`}
      >
        <Link
          to="/"
          className="text-white hover:text-gray-300 block md:inline-block"
        >
          About
        </Link>
        <Link
          to="/projects"
          className="text-white hover:text-gray-300 block md:inline-block"
        >
          Projects
        </Link>
        <Link
          to="/how-it-works"
          className="text-white hover:text-gray-300 block md:inline-block"
        >
          How It Works
        </Link>
        <Link
          to="/token-metrics"
          className="text-white hover:text-gray-300 block md:inline-block"
        >
          Token Metrics
        </Link>
      </nav>
      {/* Connect Wallet Button */}
      <div className="hidden md:block">
        <WalletMultiButton className="border border-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-400 transition duration-300" />
      </div>
    </header>
  );
};

export default Header;
