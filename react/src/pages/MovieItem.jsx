import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MovieItem.css';

const MovieItem = ({ movie }) => {
  const { title, poster_path, release_date, genre_ids } = movie;

  // Dummy genre names for the sake of example (You can map these IDs to actual genre names from the API)
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance'];

  return (
    <div className="movie-item">
      <div className="movie-item-content">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          className="movie-item-image"
        />
        <div className="movie-item-details">
          <h3 className="movie-item-title">{title}</h3>
          <p className="movie-item-release-date">{release_date}</p>
          <p className="movie-item-genres">
            {genre_ids.map((genreId) => genres[genreId % genres.length]).join(', ')}
          </p>
        </div>
      </div>
      <div className="movie-item-hover">
        <h3>{title}</h3>
        <p>{release_date}</p>
        <p>{genres[genre_ids[0] % genres.length]}</p>
        <p>Click to see more details!</p>
      </div>
    </div>
  );
};

MovieItem.propTypes = {
  movie: PropTypes.object.isRequired,
};

export default MovieItem;
