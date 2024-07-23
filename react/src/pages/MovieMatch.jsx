import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/MovieMatch.css';




const API_KEY = '44d4972f66d435a74e47ff73bed7d208';
const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

const MovieMatch = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL);
        setMovies(response.data.results.slice(0, 10)); // Get only 10 movies
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleRating = (rating) => {
    const currentMovie = movies[currentMovieIndex];
    setRatings({ ...ratings, [currentMovie.id]: rating });
    setCurrentMovieIndex(currentMovieIndex + 1);
  };

  const currentMovie = movies[currentMovieIndex];

  return (
    <div className="movie-match-container">
      {currentMovie ? (
        <>
          <h2>Calculating your taste...</h2>
          <TransitionGroup>
            <CSSTransition
              key={currentMovie.id}
              timeout={300}
              classNames="movie"
            >
              <div className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                  alt={currentMovie.title}
                />
                <h3>{currentMovie.title}</h3>
                <p>{currentMovie.release_date.split('-')[0]}</p>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <div className="rating-buttons">
            <button className="rating-button awful" onClick={() => handleRating('awful')}>Awful</button>
            <button className="rating-button meh" onClick={() => handleRating('meh')}>Meh</button>
            <button className="rating-button good" onClick={() => handleRating('good')}>Good</button>
            <button className="rating-button amazing" onClick={() => handleRating('amazing')}>Amazing</button>
          </div>
          <button className="havenotseen-button" onClick={() => handleRating('havenotseen')}>
            Haven't Seen
          </button>
        </>
      ) : (
        <h2>No more movies to rate!</h2>
      )}
    </div>
  );
};

export default MovieMatch;
