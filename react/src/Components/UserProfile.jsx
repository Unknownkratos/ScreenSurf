// src/Components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css'; // Ensure the path is correct

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (!token) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user data');
          navigate('/login'); // Redirect to login if not authorized
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/login'); // Redirect to login if an error occurs
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="user-profile-page">
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
      <div className="profile-container">
        <h2>User Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default UserProfile;
