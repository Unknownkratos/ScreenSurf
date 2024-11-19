import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Browse.css';
import MovieItem from './MovieItem';
import Pagination from './Pagination';

const API_KEY = 'apikey'; // Replace with your actual API key
const API_URL = 'https://api.themoviedb.org/3/discover/movie';

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          sort_by: 'popularity.desc',
          page: pageNumber,
        },
      });
      setMovies(response.data.results);
    } catch (err) {
      setError('Error fetching movie data.');
      console.error('Error fetching movie data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className="browse">
      {/* Header */}
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

      {/* Main content */}
      <main className="browse-main">
        <h2>Movies</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <div className="error-container">
            <p className="error">{error}</p>
            <button onClick={() => fetchMovies(page)} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="browse-movie-grid">
              {movies.map((movie) => (
                <MovieItem key={movie.id} movie={movie} />
              ))}
            </div>
            {/* Pagination */}
            <Pagination 
              page={page}
              onNext={handleNextPage} 
              onPrev={handlePrevPage}
            />
          </>
        )}
      </main>

      {/* Footer */}
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
