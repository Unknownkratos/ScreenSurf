// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import ProfilePic from '../assets/pfp.png'; // Import your profile picture

const Home = () => {
  const [movies, setMovies] = useState([]);
  const API_KEY = 'apikey'; // Replace with your actual API key

  useEffect(() => {
    // Fetch movies from MovieDB API
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(data => setMovies(data.results.slice(0, 9))); // Fetch only the first 6 movies
  }, []);

  return (
    <div className="home">
      <header className="header">
        <div className="logo">ScreenSurf</div>
        <nav className="nav-menu">
          <Link to="/home">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/moviematch">MovieMatch</Link>
          <Link to="/more">More</Link>
        </nav>
        <div className="header-right">
          <Link to="/login">
            <img src={ProfilePic} alt="Profile Icon" className="profile-icon" />
          </Link>
        </div>
      </header>

      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="welcome-message">Welcome.</h1>
          <p className="subtitle">Millions of movies, TV shows and people to discover. Explore now.</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for a movie, TV show, person..." />
            <button className="search-button">Search</button>
          </div>
        </div>
      </div>

      <section className="trending-section">
        <h2>Trending</h2>
        <div className="trending-carousel">
          {movies.map(movie => (
            <div key={movie.id} className="movie-item">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.vote_average.toFixed(2)}</p> {/* Format rating to 2 decimal places */}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="quick-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
