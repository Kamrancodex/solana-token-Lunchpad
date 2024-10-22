import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

import WalletConnection from "./components/WalletConnection";

import CreateToken from "./components/CreateToken";

function App() {
  return (
    <Router>
      <WalletConnection>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/token-form" element={<CreateToken />} />
        </Routes>
      </WalletConnection>
    </Router>
  );
}

export default App;
