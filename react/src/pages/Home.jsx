  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import '../styles/Home.css';

  const Home = () => {
    const [movies, setMovies] = useState([]);
    const API_KEY = '44d4972f66d435a74e47ff73bed7d208'; // Replace with your actual API key

    useEffect(() => {
      // Fetch movies from MovieDB API
      fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => setMovies(data.results.slice(0, 6))); // Fetch only the first 6 movies
    }, []);

    return (
      <div className="home">
        <header className="header">
          <div className="logo">ScreenSurf</div>
          <nav className="nav-menu">
            <Link to="/home">Home</Link>
            <Link to="/Browse">Browse</Link>
            <Link to="/MovieMatch">MovieMatch</Link>
            <Link to="/more">More</Link>
          </nav>
          <div className="user-profile">
            <Link to="/login">Login</Link>
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
