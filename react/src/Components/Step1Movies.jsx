import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Step1Movies = ({ movies }) => {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/step2', { state: { selectedMovies } });
  };

  return (
    <div>
      <h2>Select Two Movies</h2>
      {movies.slice(0, 10).map(movie => (
        <div key={movie.id}>
          <input
            type="checkbox"
            value={movie.id}
            onChange={e => {
              const { value, checked } = e.target;
              setSelectedMovies(prev =>
                checked
                  ? [...prev, value]
                  : prev.filter(id => id !== value)
              );
            }}
          />
          {movie.title}
        </div>
      ))}
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default Step1Movies;
