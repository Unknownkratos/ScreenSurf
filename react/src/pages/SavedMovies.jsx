import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, Info, Search, Film } from 'lucide-react';
import Navigation from '../components/ui/Navigation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getSavedMovies, removeMovie, clearSavedMovies } from '../utils/savedMovies';
import '../styles/SavedMovies.css';

const SavedMovies = () => {
  const navigate = useNavigate();
  const [savedMovies, setSavedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    loadSavedMovies();
  }, []);

  const loadSavedMovies = () => {
    const movies = getSavedMovies();
    setSavedMovies(movies);
  };

  const handleRemoveMovie = (movieId) => {
    if (removeMovie(movieId)) {
      setSavedMovies(prevMovies => prevMovies.filter(m => m.id !== movieId));
    }
  };

  const handleClearAll = () => {
    if (clearSavedMovies()) {
      setSavedMovies([]);
      setShowConfirmClear(false);
    }
  };

  const handleAddToList = (movie) => {
    // This is already saved, so we'll remove it instead
    handleRemoveMovie(movie.id);
  };

  const filteredMovies = savedMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="saved-movies">
      <Navigation />
      
      <div className="saved-movies-container">
        <div className="saved-header">
          <div className="saved-title">
            <Bookmark size={32} />
            <h1>My Saved Movies</h1>
            <span className="saved-count">{savedMovies.length} movies</span>
          </div>
          
          <div className="saved-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search saved movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            {savedMovies.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => setShowConfirmClear(true)}
                icon={<Trash2 size={18} />}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {filteredMovies.length > 0 ? (
          <motion.div 
            className="saved-movies-grid"
            layout
          >
            <AnimatePresence>
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="saved-movie-wrapper"
                >
                  <Card 
                    movie={movie}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    onAddToList={handleAddToList}
                  />
                  <div className="saved-movie-actions">
                    <Button
                      variant="glass"
                      size="small"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      icon={<Info size={16} />}
                    >
                      Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleRemoveMovie(movie.id)}
                      icon={<Trash2 size={16} />}
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="empty-state">
            <Film size={64} />
            <h2>{searchTerm ? 'No movies found' : 'No saved movies yet'}</h2>
            <p>
              {searchTerm 
                ? 'Try a different search term'
                : 'Browse movies and save your favorites to watch later'}
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                onClick={() => navigate('/browse')}
              >
                Browse Movies
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmClear(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Clear All Saved Movies?</h3>
              <p>This will remove all {savedMovies.length} saved movies. This action cannot be undone.</p>
              <div className="modal-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmClear(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleClearAll}
                  icon={<Trash2 size={18} />}
                >
                  Clear All
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedMovies;