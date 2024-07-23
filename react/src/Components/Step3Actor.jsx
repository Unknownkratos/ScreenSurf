import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Step3Actor = () => {
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMovies, selectedGenres } = location.state || {};

  useEffect(() => {
    const fetchActors = async () => {
      const response = await axios.get('https://api.themoviedb.org/3/person/popular?api_key=YOUR_API_KEY');
      setActors(response.data.results);
    };

    fetchActors();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY&with_genres=${selectedGenres.join(',')}&with_cast=${selectedActor}`);
      navigate('/recommendations', { state: { recommendedMovies: response.data.results } });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div>
      <h2>Select an Actor</h2>
      {actors.slice(0, 10).map(actor => (
        <div key={actor.id}>
          <input
            type="radio"
            name="actor"
            value={actor.id}
            onChange={e => setSelectedActor(e.target.value)}
          />
          {actor.name}
        </div>
      ))}
      <button onClick={handleSubmit}>Get Recommendations</button>
    </div>
  );
};

export default Step3Actor;
