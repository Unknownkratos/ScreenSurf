import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MovieMatch.css';

const API_KEY = 'apikey';
const MOVIE_API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const MovieRating = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(MOVIE_API_URL);
        setMovies(shuffleArray(response.data.results));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleRating = (rating) => {
    setRatings((prevRatings) => [...prevRatings, { movie: movies[currentMovieIndex], rating }]);
    if (currentMovieIndex < movies.length - 1) {
      setCurrentMovieIndex((prevIndex) => prevIndex + 1);
    } else {
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    try {
      const genreCounts = {};
      ratings.forEach((rating) => {
        rating.movie.genre_ids.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });
      const favoriteGenre = Object.keys(genreCounts).reduce((a, b) => (genreCounts[a] > genreCounts[b] ? a : b));

      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${favoriteGenre}`
      );
      setRecommendations(shuffleArray(response.data.results.slice(0, 3)));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const currentMovie = movies[currentMovieIndex];

  return (
    <div className="movie-rating">
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

      {currentMovie && (
        <div className="movie-container">
          <img
            src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
            alt={currentMovie.title}
            className="movie-poster"
          />
          <div className="rating-buttons">
            <button className="rating-btn awful" onClick={() => handleRating('awful')}>
              Awful
            </button>
            <button className="rating-btn meh" onClick={() => handleRating('meh')}>
              Meh
            </button>
            <button className="rating-btn good" onClick={() => handleRating('good')}>
              Good
            </button>
            <button className="rating-btn amazing" onClick={() => handleRating('amazing')}>
              Amazing
            </button>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>Your Recommendations</h2>
          <div className="recommendation-list">
            {recommendations.map((movie) => (
              <div key={movie.id} className="recommendation-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="recommendation-poster"
                />
                <div className="recommendation-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                  <div className="rating">Rating: {movie.vote_average}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieRating;
