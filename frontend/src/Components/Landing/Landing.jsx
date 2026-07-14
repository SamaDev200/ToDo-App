import { useState } from 'react';
import Login from '../Login/Login.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import './Landing.css';

function Landing({ loggedIn, isDark, authToken, changeLogin }) {
  const [visible, setVisible] = useState("login");

  const aFunctionCall = (data) => {
    changeLogin(data);
  };

  const changeText = () => {
    setVisible(prev => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1 className="landing-title">Declutter Your Schedule</h1>
        <p className="landing-subtitle">Your Busy Life Deserves This</p>
      </div>
      <div className="landing-form-wrapper glass-panel">
        <h2 className="landing-welcome">Welcome, Let's Get Started.</h2>
        {visible === "login" ? (
          <Login 
            loggedIn={loggedIn}
            isDark={isDark}
            aFunctionCall={aFunctionCall}
            authToken={authToken}
            changeText={changeText}
          />
        ) : (
          <SignUp 
            loggedIn={loggedIn}
            isDark={isDark}
            aFunctionCall={aFunctionCall}
            authToken={authToken}
            changeToLogin={changeText}
          />
        )}
      </div>
    </div>
  );
}

export default Landing;
