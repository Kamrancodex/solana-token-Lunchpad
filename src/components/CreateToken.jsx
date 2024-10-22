import React, { useState, useEffect } from "react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getAssociatedTokenAddressSync,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import axios from "axios";
import { Spin, notification, Modal, Button } from "antd";
import { Buffer } from "buffer";
import {
  CheckCircleOutlined,
  TwitterOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

// Define METADATA_PROGRAM_ID if needed for future use
const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const CreateToken = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    mintAddress: "",
    associatedToken: "",
    txid: "",
  });

  useEffect(() => {
    // Animated text effect
    const textAnimation = gsap.timeline({ repeat: -1 });
    textAnimation
      .to(".animated-text", {
        duration: 3,
        text: "Create Your Own Token on Solana",
        ease: "none",
      })
      .to(".animated-text", {
        duration: 3,
        text: "Mint Custom SPL Tokens",
        ease: "none",
      })
      .to(".animated-text", {
        duration: 3,
        text: "Launch Your Project Today",
        ease: "none",
      });
  }, []);

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInBytes = 200 * 1024; // 200KB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        notification.error({
          message:
            "Unsupported file type. Please upload JPEG, PNG, or GIF images.",
          placement: "bottomRight",
          duration: 3,
        });
        return;
      }
      if (file.size > maxSizeInBytes) {
        notification.error({
          message: "File is too large. Max size is 200KB.",
          placement: "bottomRight",
          duration: 3,
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Image to Pinata
  const uploadImageToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const pinataApiKey = "2c8fe69202c5d0429f61";
    const pinataSecretApiKey =
      "5ef4fc97beae5bf6184efa5f0c7d51f193db1c7a7f9bd1294aba75831f829813";

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading image to Pinata:", error);
      throw new Error("Failed to upload image to Pinata");
    }
  };

  // Upload Metadata to Pinata
  const uploadMetadataToPinata = async (metadata) => {
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      throw new Error("Failed to upload metadata to Pinata");
    }
  };

  // Find Metadata PDA
  const findMetadataPda = (mint) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    )[0];
  };

  // Handle Token Creation
  const handleCreateToken = async () => {
    setLoading(true);
    try {
      // Validations
      if (!wallet || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!imageFile) {
        throw new Error("Please upload an image for your token");
      }

      if (name.trim() === "" || symbol.trim() === "") {
        throw new Error("Token name and symbol are required");
      }

      if (initialSupply <= 0) {
        throw new Error("Initial supply must be greater than zero");
      }

      // Upload image to Pinata
      const imageUrl = await uploadImageToPinata(imageFile);

      // Create Metadata JSON (optional, remove if not using metadata)
      const metadata = {
        name: name,
        symbol: symbol,
        description: "Your token description",
        image: imageUrl,
      };

      // Upload metadata to Pinata (optional, remove if not using metadata)
      const metadataUrl = await uploadMetadataToPinata(metadata);

      // Create new mint keypair
      const mintKeypair = Keypair.generate();

      // Calculate minimum balance for rent exemption
      const lamports = await connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );

      // Get associated token account address
      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(
        // Create account for the mint
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        // Initialize mint
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          9, // Decimals
          wallet.publicKey,
          wallet.publicKey
        ),
        // Create associated token account for the user
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintKeypair.publicKey
        ),
        // Mint initial supply to the user's associated token account
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          initialSupply * 10 ** 9
        )
      );

      // Set recent blockhash and fee payer
      transaction.feePayer = wallet.publicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;

      // Partially sign the transaction with the mint keypair
      transaction.partialSign(mintKeypair);

      // Sign transaction with the wallet
      const signedTransaction = await wallet.signTransaction(transaction);

      // Send transaction
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm transaction
      await connection.confirmTransaction(txid, "confirmed");

      // Set modal data
      setModalData({
        mintAddress: mintKeypair.publicKey.toBase58(),
        associatedToken: associatedToken.toBase58(),
        txid: txid,
      });

      // Show success modal
      setIsModalVisible(true);

      // Reset form fields
      setName("");
      setSymbol("");
      setInitialSupply(0);
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error creating token:", error);
      notification.error({
        message: "Error Creating Token",
        description: error.message,
        placement: "bottomRight",
        duration: 3,
      });
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Modal Close
  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 animate-gradientDark bg-fixed overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-20 animate-float"
              style={{
                width: `${Math.random() * 4 + 4}px`,
                height: `${Math.random() * 4 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header Section */}
      <div className="pt-20 pb-10 text-center z-10 relative">
        <h1 className="animated-text text-4xl font-bold text-white mb-4">
          Create Your Own Token on Solana
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto px-4">
          Launch your custom SPL token with just a few clicks. Add metadata,
          images, and set your initial supply.
        </p>
      </div>

      {/* Main Form Content */}
      <div className="flex items-center justify-center p-4 z-10 relative">
        <div className="max-w-lg w-full p-8 bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-md shadow-lg text-white">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Token Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter token name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter token symbol"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Token Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Token preview"
                className="mt-2 max-w-full h-auto rounded-md border border-gray-600"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Initial Supply
            </label>
            <input
              type="number"
              value={initialSupply}
              onChange={(e) => setInitialSupply(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter initial supply"
              min="1"
            />
          </div>

          <button
            onClick={handleCreateToken}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Token"}
          </button>

          {loading && (
            <div className="mt-4 flex justify-center">
              <Spin />
            </div>
          )}

          {status && (
            <div className="mt-4 p-4 bg-gray-700 text-sm text-white rounded-md whitespace-pre-wrap">
              {status}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-sm py-4 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm">
              © 2024 Made with ❤️ by Kamran
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Twitter Link */}
              <a
                href="https://twitter.com/kamran11011"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <TwitterOutlined style={{ fontSize: "24px" }} />
              </a>

              {/* GitHub Link */}
              <a
                href="https://github.com/kamrancodex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <GithubOutlined style={{ fontSize: "24px" }} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <CheckCircleOutlined className="text-green-400 animate-pulse" />
            <span className="text-gray-100">Token Created Successfully!</span>
          </div>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="close" type="primary" onClick={handleOk}>
            Close
          </Button>,
        ]}
        centered
        bodyStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background
          backdropFilter: "blur(15px)", // Apply glassmorphism blur
          color: "#fff",
          borderRadius: "16px", // Rounded corners
          border: "1px solid rgba(255, 255, 255, 0.2)", // Light border
          padding: "20px",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        }}
        titleStyle={{
          color: "#fff",
          fontSize: "1.5rem",
        }}
      >
        <div className="flex flex-col space-y-4">
          <p className="text-sm lg:text-base">
            <strong>Mint Address:</strong>{" "}
            {modalData.mintAddress || "Not Available"}
          </p>
          <p className="text-sm lg:text-base">
            <strong>Associated Token Account:</strong>{" "}
            {modalData.associatedToken || "Not Available"}
          </p>
          <p className="text-sm lg:text-base">
            <strong>Transaction ID:</strong>{" "}
            <a
              href={`https://explorer.solana.com/tx/${modalData.txid}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300 transition-colors duration-300"
            >
              View on Solana Explorer
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CreateToken;
