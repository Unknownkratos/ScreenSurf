// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../Components/FormInput'; // Adjust path if necessary
import '../styles/Login.css'; // Ensure to import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:5000/api/login', { // Adjust endpoint if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username instead of email
      });

      const responseData = await response.text(); // Read the response text

      if (response.ok) {
        navigate('/home'); // Redirect to homepage
      } else {
        setError(responseData); // Set error message from server response
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="logo">ScreenSurf</div>
        <nav className="nav-menu">
          <a href="/home">Home</a>
          <a href="/browse">Browse</a>
          <a href="/movie-match">MovieMatch</a>
          <a href="/more">More</a>
        </nav>
        <div className="user-profile">
          <a href="/login">Login</a>
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>} {/* Display error messages */}
          <form onSubmit={handleLogin} className="login-form">
            <FormInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
