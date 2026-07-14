import { LogOut } from 'lucide-react';
import './Navbar.css';

function NavbarAbove({ aFunctionCall, authToken, uname }) {
  const logoutCall = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/user/logout/', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
        }
      });
      if (response.status === 200) {
        aFunctionCall(null);
      } else {
        alert("Sorry for the inconvenience. We're working to solve this issue.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="apple-navbar glass-panel">
      <div className="navbar-brand">
        <h1>Todo</h1>
      </div>
      <div className="navbar-user">
        <span className="navbar-greeting">Welcome, {uname}</span>
        <button className="icon-btn logout-btn" onClick={logoutCall} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default NavbarAbove;