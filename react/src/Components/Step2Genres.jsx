import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Step2Genres = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMovies } = location.state || {};

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_API_KEY');
      setGenres(response.data.genres);
    };

    fetchGenres();
  }, []);

  const handleSubmit = () => {
    navigate('/step3', { state: { selectedMovies, selectedGenres } });
  };

  return (
    <div>
      <h2>Select Two Genres</h2>
      {genres.map(genre => (
        <div key={genre.id}>
          <input
            type="checkbox"
            value={genre.id}
            onChange={e => {
              const { value, checked } = e.target;
              setSelectedGenres(prev =>
                checked
                  ? [...prev, value]
                  : prev.filter(id => id !== value)
              );
            }}
          />
          {genre.name}
        </div>
      ))}
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default Step2Genres;
