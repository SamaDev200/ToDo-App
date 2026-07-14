import { useState } from 'react';
import './Login.css';

function Login({ loggedIn, aFunctionCall, changeText }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError(true);
      return;
    }

    if (!loggedIn) {
      const loginData = { username, password };
      try {
        const response = await fetch('http://127.0.0.1:8000/user/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        });

        if (response.status === 200) {
          const data = await response.json();
          aFunctionCall(data);
        } else {
          alert('Wrong Username or Password');
        }
      } catch (err) {
        console.error(err);
      }
    }
    setError(false);
  };

  return (
    <form className="apple-form" onSubmit={handleSubmit}>
      <h3>Sign In</h3>
      
      <div className="form-group">
        <label>Username</label>
        <input 
          type="text" 
          className="apple-input" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter username" 
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input 
          type="password" 
          className="apple-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
        />
      </div>

      {error && <div className="error-text">Please fill out all fields.</div>}

      <button type="submit" className="apple-btn btn-block">Sign In</button>

      <div className="form-divider">
        <span>OR</span>
      </div>

      <div className="form-footer">
        Not a member? <button type="button" className="text-btn" onClick={changeText}>Sign Up</button>
      </div>
    </form>
  );
}

export default Login;