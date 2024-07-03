import Home from "./components/Home";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EnergyEfficiencyModels from "./components/EnergyEfficiencyModels";
import PcfTracking from "./components/PcfTracking";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <Router>
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/pcf-tracking" element={<PcfTracking />} />
              {/* <Route
                path="/energy-efficiency-models"
                element={<EnergyEfficiencyModels />}
              /> */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
          <Route path="/" element={<Navigate to="/pcf-tracking" />} />
          <Route
            path="/login"
            element={<LoginPage handleLogin={handleLogin} />}
          />
        </Routes>
        <Footer></Footer>
      </Router>
    </>
  );
}
export default App;
