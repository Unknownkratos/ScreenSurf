import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X as XIcon, 
  Star, 
  Calendar, 
  Clock, 
  RefreshCw,
  Sparkles,
  Info,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/ui/Navigation';
import '../styles/MovieMatch.css';

const api_key = import.meta.env.VITE_TMDB_API_KEY || 'dcce6d555b2e844ae0baef071ef69d93';

const MovieMatch = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [passedMovies, setPassedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [genres, setGenres] = useState({});
  const [matchStats, setMatchStats] = useState({ liked: 0, passed: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const cardRef = useRef(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedLiked = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const savedPassed = JSON.parse(localStorage.getItem('passedMovies') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('matchStats') || '{"liked": 0, "passed": 0}');
    
    setLikedMovies(savedLiked);
    setPassedMovies(savedPassed);
    setMatchStats(savedStats);
  }, []);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`);
        const data = await response.json();
        const genreMap = {};
        data.genres.forEach(genre => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch multiple pages for variety
        const pages = [1, 2, 3];
        const allMovies = [];
        
        for (const page of pages) {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`
          );
          const data = await response.json();
          allMovies.push(...data.results);
        }
        
        // Filter out already seen movies
        const seenIds = [...likedMovies, ...passedMovies].map(m => m.id);
        const unseenMovies = allMovies.filter(movie => !seenIds.includes(movie.id));
        
        // Shuffle movies
        const shuffled = unseenMovies.sort(() => Math.random() - 0.5);
        setMovies(shuffled);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle swipe actions
  const handleSwipe = (direction) => {
    if (currentIndex >= movies.length) return;
    
    const currentMovie = movies[currentIndex];
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === 'right') {
        const newLiked = [...likedMovies, currentMovie];
        setLikedMovies(newLiked);
        localStorage.setItem('likedMovies', JSON.stringify(newLiked));
        
        const newStats = { ...matchStats, liked: matchStats.liked + 1 };
        setMatchStats(newStats);
        localStorage.setItem('matchStats', JSON.stringify(newStats));
      } else {
        const newPassed = [...passedMovies, currentMovie];
        setPassedMovies(newPassed);
        localStorage.setItem('passedMovies', JSON.stringify(newPassed));
        
        const newStats = { ...matchStats, passed: matchStats.passed + 1 };
        setMatchStats(newStats);
        localStorage.setItem('matchStats', JSON.stringify(newStats));
      }
      
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
      
      // Check if we need recommendations - show after every 5 likes
      if (direction === 'right') {
        const totalLikes = likedMovies.length + 1;
        if (totalLikes >= 5 && totalLikes % 5 === 0) {
          generateRecommendations();
        }
      }
      
      // Also show recommendations when running out of movies
      if (currentIndex === movies.length - 1 && likedMovies.length >= 3) {
        generateRecommendations();
      }
    }, 300);
  };

  // Generate recommendations based on liked movies
  const generateRecommendations = async () => {
    if (likedMovies.length === 0) return;
    
    try {
      // Get most common genres from liked movies
      const genreCounts = {};
      likedMovies.forEach(movie => {
        movie.genre_ids?.forEach(genreId => {
          genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
        });
      });
      
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([genreId]) => genreId);
      
      if (topGenres.length > 0) {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${topGenres.join(',')}&sort_by=vote_average.desc&vote_count.gte=100`
        );
        const data = await response.json();
        
        // Filter out already seen movies
        const seenIds = [...likedMovies, ...passedMovies].map(m => m.id);
        const newRecommendations = data.results
          .filter(movie => !seenIds.includes(movie.id))
          .slice(0, 6);
        
        setRecommendations(newRecommendations);
        if (newRecommendations.length > 0) {
          setShowRecommendations(true);
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  // Reset matches
  const resetMatches = () => {
    setCurrentIndex(0);
    setShowRecommendations(false);
    // Refresh movies list
    window.location.reload();
  };

  // Clear history
  const clearHistory = () => {
    localStorage.removeItem('likedMovies');
    localStorage.removeItem('passedMovies');
    localStorage.removeItem('matchStats');
    setLikedMovies([]);
    setPassedMovies([]);
    setMatchStats({ liked: 0, passed: 0 });
    resetMatches();
  };

  const currentMovie = movies[currentIndex];

  return (
    <div className="movie-match-container">
      <Navigation />
      
      <div className="movie-match-content">
        {/* Header Stats */}
        <div className="match-header">
          <div className="match-stats">
            <div className="stat-item">
              <Heart className="stat-icon liked" size={20} />
              <span>{matchStats.liked}</span>
            </div>
            <div className="stat-item">
              <XIcon className="stat-icon passed" size={20} />
              <span>{matchStats.passed}</span>
            </div>
            <div className="stat-item">
              <TrendingUp className="stat-icon" size={20} />
              <span>{Math.round((matchStats.liked / (matchStats.liked + matchStats.passed || 1)) * 100)}%</span>
            </div>
            {likedMovies.length > 0 && likedMovies.length < 5 && (
              <div className="stat-item recommendation-progress">
                <Sparkles size={20} />
                <span>{5 - likedMovies.length} more likes for recommendations</span>
              </div>
            )}
          </div>
          
          <div className="match-actions">
            <motion.button
              className="action-btn"
              onClick={clearHistory}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={18} />
              <span>Clear History</span>
            </motion.button>
          </div>
        </div>

        {/* Main Card Area */}
        <div className="match-main">
          {loading ? (
            <div className="loading-container">
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={40} />
              </motion.div>
              <p>Finding movies for you...</p>
            </div>
          ) : currentMovie ? (
            <div className="swipe-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMovie.id}
                  ref={cardRef}
                  className="movie-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : 0,
                    rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0,
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, { offset }) => {
                    const swipe = offset.x;
                    if (swipe < -100) {
                      handleSwipe('left');
                    } else if (swipe > 100) {
                      handleSwipe('right');
                    }
                  }}
                >
                  <div className="card-image-container">
                    <img
                      src={`https://image.tmdb.org/t/p/w780${currentMovie.backdrop_path || currentMovie.poster_path}`}
                      alt={currentMovie.title}
                      className="card-backdrop"
                    />
                    <div className="card-overlay">
                      <div className="card-info">
                        <h2 className="card-title">{currentMovie.title}</h2>
                        <div className="card-meta">
                          <span className="meta-item">
                            <Star size={16} />
                            {currentMovie.vote_average.toFixed(1)}
                          </span>
                          <span className="meta-item">
                            <Calendar size={16} />
                            {new Date(currentMovie.release_date).getFullYear()}
                          </span>
                          <span className="meta-item">
                            <Clock size={16} />
                            {currentMovie.runtime || '120'} min
                          </span>
                        </div>
                        <div className="card-genres">
                          {currentMovie.genre_ids?.slice(0, 3).map(genreId => (
                            <span key={genreId} className="genre-tag">
                              {genres[genreId]}
                            </span>
                          ))}
                        </div>
                        <p className="card-overview">{currentMovie.overview}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Swipe Indicators */}
                  <div className="swipe-indicator like">
                    <Heart size={60} />
                    <span>LIKE</span>
                  </div>
                  <div className="swipe-indicator pass">
                    <XIcon size={60} />
                    <span>PASS</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="action-buttons">
                <motion.button
                  className="swipe-btn pass-btn"
                  onClick={() => handleSwipe('left')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XIcon size={30} />
                </motion.button>
                
                <motion.button
                  className="swipe-btn info-btn"
                  onClick={() => navigate(`/movie/${currentMovie.id}`)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Info size={24} />
                </motion.button>
                
                <motion.button
                  className="swipe-btn like-btn"
                  onClick={() => handleSwipe('right')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={30} />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="no-more-movies">
              <Sparkles size={60} className="no-more-icon" />
              <h2>No More Movies!</h2>
              <p>You've gone through all available movies.</p>
              <motion.button
                className="reset-btn"
                onClick={resetMatches}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={20} />
                Start Over
              </motion.button>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        {showRecommendations && recommendations.length > 0 && (
          <motion.div
            className="recommendations-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="recommendations-header">
              <Sparkles size={24} className="recommendations-icon" />
              <h3>Recommended For You!</h3>
              <span className="recommendations-badge">Based on your {likedMovies.length} likes</span>
            </div>
            <div className="recommendations-grid">
              {recommendations.map((movie) => (
                <motion.div
                  key={movie.id}
                  className="recommendation-card"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className="recommendation-info">
                    <h4>{movie.title}</h4>
                    <div className="recommendation-rating">
                      <Star size={14} />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Liked Movies History */}
        {likedMovies.length > 0 && (
          <motion.div
            className="liked-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Your Liked Movies ({likedMovies.length})</h3>
            <div className="liked-movies-scroll">
              {likedMovies.slice().reverse().map((movie) => (
                <motion.div
                  key={movie.id}
                  className="liked-movie-item"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <span className="liked-title">{movie.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MovieMatch;