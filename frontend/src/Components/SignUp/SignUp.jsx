import { useState } from 'react';
import './SignUp.css';

function SignUp({ loggedIn, changeToLogin }) {
  const [user, setUser] = useState({
    fname: '', lname: '', username: '', email: '', password: '', cnfpassword: ''
  });
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || user.password !== user.cnfpassword || !user.username) {
      alert("Please check your inputs and agree to terms.");
      return;
    }

    if (!loggedIn) {
      const signUpData = {
        username: user.username,
        password: user.password,
        email: user.email,
        first_name: user.fname,
        last_name: user.lname
      };

      try {
        const response = await fetch('http://127.0.0.1:8000/user/signup/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpData)
        });

        if (response.status === 200) {
          alert('Registered Successfully, Login with your username and password.');
          changeToLogin();
        } else {
          alert('Username already taken or invalid data');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <form className="apple-form" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="fname" className="apple-input" value={user.fname} onChange={handleChange} placeholder="First name" />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lname" className="apple-input" value={user.lname} onChange={handleChange} placeholder="Last name" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" className="apple-input" value={user.username} onChange={handleChange} placeholder="Username" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="apple-input" value={user.email} onChange={handleChange} placeholder="Email" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="apple-input" value={user.password} onChange={handleChange} placeholder="Password" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="cnfpassword" className="apple-input" value={user.cnfpassword} onChange={handleChange} placeholder="Confirm" />
        </div>
      </div>

      <div className="form-checkbox">
        <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <label htmlFor="agree">I agree to the terms and conditions.</label>
      </div>

      <button type="submit" className="apple-btn btn-block">Sign Up</button>

      <div className="form-divider">
        <span>OR</span>
      </div>

      <div className="form-footer">
        Already a member? <button type="button" className="text-btn" onClick={changeToLogin}>Sign In</button>
      </div>
    </form>
  );
}

export default SignUp;