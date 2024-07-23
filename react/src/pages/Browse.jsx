// src/pages/Browse.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Browse.css';

const API_KEY = '44d4972f66d435a74e47ff73bed7d208'; // Replace with your actual API key
const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL);
        setMovies(response.data.results);
      } catch (error) {
        setError('Error fetching movie data.');
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="browse">
      <header className="header">
        <div className="logo">ScreenSurf</div>
        <nav className="nav-menu">
          <Link to="/home">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/MovieMatch">MovieMatch</Link>
          <Link to="/more">More</Link>
        </nav>
        <div className="user-profile">
          <Link to="/login">Login</Link>
        </div>
      </header>
      <main className="browse-main">
        <h2>Movies</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="browse-movie-grid">
            {movies.map(movie => (
              <div key={movie.id} className="browse-movie-item">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="browse-movie-info">
                  <h3>{movie.title}</h3>
                  <p>Rating: {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="browse-footer">
        <div className="browse-quick-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Browse;
