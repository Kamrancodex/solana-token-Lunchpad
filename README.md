# Solana Token Launchpad

This project is a **Solana Token Launchpad** built using **React** and **Vite**, integrating Solana Web3 features for creating and managing tokens on the Solana blockchain. It uses Metaplex for token metadata management, Bundlr for file storage, and various other libraries for wallet interaction and UI.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Solana Token Launchpad is designed to allow users to create, mint, and manage SPL tokens with ease. The platform offers an intuitive UI and supports wallet integration for seamless interaction with the Solana blockchain. Users can create tokens, upload metadata (like images and descriptions), and view transactions via Solana Explorer.

## Features

- **Token Creation**: Easily create SPL tokens on the Solana blockchain.
- **Metadata Management**: Upload token metadata using the Metaplex protocol.
- **Wallet Integration**: Support for various Solana wallets via Wallet Adapter.
- **Transaction Viewing**: Check token minting transactions on Solana Explorer.
- **Glassmorphism UI**: Modern glass UI design with animated transitions using GSAP and Framer Motion.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/), [Ant Design](https://ant.design/)
- **Blockchain**: [Solana](https://solana.com/), [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/), [Metaplex](https://www.metaplex.com/), [SPL Token](https://spl.solana.com/token)
- **File Storage**: [Bundlr Network](https://bundlr.network/), [Pinata](https://www.pinata.cloud/) for IPFS
- **Animations**: [GSAP](https://greensock.com/gsap/), [Framer Motion](https://www.framer.com/motion/)

## Installation

To get started with the Solana Token Launchpad, clone the repository and install the dependencies.

```bash
git clone https://github.com/ksmrancodex/token-launchpad.git
cd token-launchpad
npm install
```

### Environment Variables

Create a .env file in the root directory and add the following environment variables:

```bash
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
```

These keys are required for uploading images and metadata to IPFS using Pinata.

## Usage

To start the development server, run:

```bash
Copy code
npm run dev
```

Build the project for production:

```bash
Copy code
npm run build
```

Preview the production build locally:

### Scripts

npm run dev: Starts the development server.
npm run build: Builds the app for production.
npm run preview: Previews the production build.
npm run lint: Lints the code with ESLint.

### Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you'd like to change.

Fork the repository
Create your feature branch (git checkout -b feature/new-feature)
Commit your changes (git commit -m 'Add new feature')
Push to the branch (git push origin feature/new-feature)
Open a pull request
License
This project is licensed under the MIT License. See the LICENSE file for details.
