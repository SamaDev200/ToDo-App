import { useState, useEffect } from 'react';
import Todo from './Components/Todo/Todo';
import Landing from './Components/Landing/Landing';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('AuthToken') || '');
  const [isDark, setIsDark] = useState(localStorage.getItem('DarkMode') !== 'Light'); // Default to Dark mode

  useEffect(() => {
    if (authToken !== '') {
      setLoggedIn(true);
    }
  }, [authToken]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const changeLogin = (data) => {
    if (data === null) {
      setLoggedIn(false);
      setAuthToken('');
      localStorage.removeItem('AuthToken');
    } else {
      setLoggedIn(true);
      setAuthToken(data.auth_token);
      localStorage.setItem('AuthToken', data.auth_token);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('DarkMode', !isDark ? 'Dark' : 'Light');
  };

  return (
    <div className={`app-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>

      {loggedIn ? (
        <Todo isDark={isDark} authToken={authToken} changeLogin={changeLogin} />
      ) : (
        <Landing loggedIn={loggedIn} changeLogin={changeLogin} isDark={isDark} authToken={authToken} />
      )}
    </div>
  );
}

export default App;