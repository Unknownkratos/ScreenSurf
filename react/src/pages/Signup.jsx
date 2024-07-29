import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Signup.css'; // Ensure the path is correct

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', { // Ensure this matches your Express route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.text(); // Read the response text

      if (response.ok) {
        alert('Signup successful!');
        // Optionally, you can redirect the user or clear the form here
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else if (response.status === 400) {
        alert(`Signup failed: ${responseData}`); // Handle known error like username already taken
      } else {
        alert(`Signup failed: ${responseData}`); // Handle other errors
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <div className="signup-page">
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
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSignup} className="signup-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
