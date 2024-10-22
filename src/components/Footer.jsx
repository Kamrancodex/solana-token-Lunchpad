import React from "react";
import { FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gradient-to-r from-black via-gray-900 to-black py-6 px-12 text-white flex flex-col md:flex-row items-center justify-between">
    <div>
      <p>© 2024 Solana Launchpad. All rights reserved.</p>
      <p>Made by Kamran</p>
    </div>
    <div className="flex space-x-6 mt-4 md:mt-0">
      <a
        href="https://twitter.com/kamran11011"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter className="text-xl hover:text-gray-400" />
      </a>
      <a
        href="https://github.com/kamrancodex"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub className="text-xl hover:text-gray-400" />
      </a>
      <a href="mailto:your-najarkamran212@gmail.com">
        <FaEnvelope className="text-xl hover:text-gray-400" />
      </a>
    </div>
  </footer>
);

export default Footer;
