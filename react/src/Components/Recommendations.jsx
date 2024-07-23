import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Recommendations = () => {
  const location = useLocation();
  const { recommendedMovies } = location.state || {};
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recommendedMovies) {
      setRecommendations(recommendedMovies);
    }
  }, [recommendedMovies]);

  return (
    <div>
      <h2>Recommendations</h2>
      {loading && <p>Loading...</p>}
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map(movie => (
            <li key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available</p>
      )}
    </div>
  );
};

export default Recommendations;
