// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../Components/FormInput.jsx';
import '../styles/Login.css'; // Ensure to import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Logging in with', { email, password });
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="logo">ScreenSurf</div>
        <nav className="nav-menu">
          <a href="/home">Home</a>
          <a href="/Browse">Browse</a>
          <a href="/MovieMatch">MovieMatch</a>
          <a href="/more">More</a>
        </nav>
        <div className="user-profile">
          <a href="/login">Login</a>
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
