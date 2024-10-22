import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  const { publicKey } = useWallet(); // Use Solana wallet
  const navigate = useNavigate();

  // // Effect to automatically navigate when the wallet is connected
  // useEffect(() => {
  //   if (publicKey) {
  //     navigate("/token-form"); // Redirect to the form page if wallet is connected
  //   }
  // }, [publicKey, navigate]);

  const handleLaunchTokenClick = () => {
    if (publicKey) {
      navigate("/token-form"); // Redirect to the form page if wallet connected
    } else {
      setShowModal(true); // Show modal to connect wallet
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  return (
    <section className="relative h-screen flex items-center justify-between px-12 bg-gradient-to-r from-black via-gray-900 to-black">
      {/* Left Text Content */}
      <div className="z-10 max-w-2xl">
        <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
          Launching the future of Solana
        </h1>
        <p className="text-white text-xl mb-8">
          Solana Launchpad empowers projects to launch and grow on the fastest
          blockchain in the world. We provide a seamless platform for token
          creation, distribution, and management, leveraging Solana's
          high-speed, low-cost infrastructure.
        </p>
        <button
          onClick={handleLaunchTokenClick}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-purple-600 hover:to-blue-600 transition duration-300"
        >
          Launch Your Token
        </button>
        <a href="#" className="text-white hover:underline block mt-6">
          Scroll to explore
        </a>
      </div>

      {/* Animated Shapes */}
      <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center">
        <div className="relative w-80 h-80 bg-gradient-to-r from-purple-400 to-blue-500 opacity-20 animate-spin-slow"></div>
      </div>

      <div className="absolute top-20 right-20 bg-purple-600 rounded-full w-20 h-20 opacity-50 animate-pulse"></div>
      <div className="absolute bottom-32 right-10 bg-blue-500 rounded-full w-10 h-10 opacity-70 animate-bounce"></div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-center border border-purple-500 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                boxShadow: "0 0 20px 5px rgba(128,0,255, 0.8)",
              }}
            >
              {/* Close Icon */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              >
                <FaTimes />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-white">
                Connect Your Wallet
              </h2>
              <p className="mb-8 text-gray-300">
                Please connect your wallet to continue with token creation.
              </p>

              {/* Use WalletMultiButton to trigger the Phantom Wallet modal */}
              <WalletMultiButton className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:from-purple-600 hover:to-blue-600 transition duration-300" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
