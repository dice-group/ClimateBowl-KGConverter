import Home from "./components/Home";
import React, { useState } from "react";

import LoginPage from "./components/LoginPage";

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
      {isLoggedIn && <Home handleLogout={handleLogout} />}
      {!isLoggedIn && <LoginPage onLogin={handleLogin} />}
    </>
  );
  return (
    <>
      <Home />
    </>
  );
}
export default App;
