import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Heart, Star, Clock, Calendar, 
  Globe, DollarSign, Film, Users, Award, TrendingUp, Check, PlayCircle 
} from 'lucide-react';
import Navigation from '../components/ui/Navigation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { saveMovie, removeMovie, isMovieSaved } from '../utils/savedMovies';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiConfigError from '../components/ui/ApiConfigError';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const api_key = import.meta.env.VITE_TMDB_API_KEY;

  // Early return with error UI if API key is missing
  if (!api_key) {
    return <ApiConfigError />;
  }

  useEffect(() => {
    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);
  
  useEffect(() => {
    if (movie) {
      setIsSaved(isMovieSaved(movie.id));
    }
  }, [movie]);

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${api_key}`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}`)
      ]);

      // Validate all responses
      if (!movieRes.ok) {
        throw new Error(`Failed to fetch movie: ${movieRes.status}`);
      }
      if (!creditsRes.ok) {
        throw new Error(`Failed to fetch credits: ${creditsRes.status}`);
      }
      if (!similarRes.ok) {
        throw new Error(`Failed to fetch similar movies: ${similarRes.status}`);
      }
      if (!videosRes.ok) {
        throw new Error(`Failed to fetch videos: ${videosRes.status}`);
      }

      const [movieData, creditsData, similarData, videosData] = await Promise.all([
        movieRes.json(),
        creditsRes.json(),
        similarRes.json(),
        videosRes.json()
      ]);

      setMovie(movieData);
      setCredits(creditsData);
      setSimilar((similarData.results || []).slice(0, 12));
      setVideos((videosData.results || []).filter(v => v.type === 'Trailer' || v.type === 'Teaser'));
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setMovie(null);
      setCredits(null);
      setSimilar([]);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4ade80';
    if (rating >= 6) return '#facc15';
    return '#ef4444';
  };
  
  const handleSaveMovie = () => {
    if (isSaved) {
      removeMovie(movie.id);
      setIsSaved(false);
    } else {
      saveMovie(movie);
      setIsSaved(true);
    }
  };

  if (loading) {
    return (
      <div className="movie-details-loading">
        <Navigation />
        <LoadingSpinner />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details">
        <Navigation />
        <div className="error-message">
          <h2>Movie not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];

  return (
    <div className="movie-details">
      <Navigation />
      
      {/* Hero Section with Backdrop */}
      <section className="details-hero">
        <div className="hero-backdrop-container">
          {movie.backdrop_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="hero-backdrop-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="hero-backdrop-placeholder" style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1a1a2e'
            }} />
          )}
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content-container">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="hero-main-content">
            <motion.div 
              className="poster-section"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750/1a1a2e/FFE8DB?text=No+Poster'}
                alt={movie.title || 'Movie Poster'}
                className="movie-poster"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x750/1a1a2e/FFE8DB?text=Image+Error';
                }}
              />
              {trailer && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-trailer-btn"
                >
                  <PlayCircle size={20} />
                  Watch Trailer
                </a>
              )}
            </motion.div>
            
            <motion.div 
              className="info-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="movie-title">{movie.title}</h1>
              {movie.tagline && (
                <p className="movie-tagline">"{movie.tagline}"</p>
              )}
              
              <div className="movie-meta">
                <div className="rating-badge" style={{ color: getRatingColor(movie.vote_average) }}>
                  <Star size={18} fill="currentColor" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <span className="meta-item">
                  <Calendar size={16} />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="meta-item">
                  <Globe size={16} />
                  {movie.original_language.toUpperCase()}
                </span>
              </div>
              
              <div className="genres">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="movie-overview">{movie.overview}</p>
              
              <div className="action-buttons">
                <Button 
                  variant={isSaved ? "secondary" : "primary"} 
                  size="large"
                  icon={isSaved ? <Check size={20} /> : <Plus size={20} />}
                  onClick={handleSaveMovie}
                >
                  {isSaved ? 'Saved' : 'Save Movie'}
                </Button>
                <button 
                  className="like-button"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart 
                    size={24} 
                    fill={isLiked ? '#5682B1' : 'none'}
                    color={isLiked ? '#5682B1' : '#FFE8DB'}
                  />
                </button>
              </div>
              
              {/* Additional Info */}
              <div className="additional-info">
                {movie.budget > 0 && (
                  <div className="info-item">
                    <span className="info-label">
                      <DollarSign size={16} />
                      Budget
                    </span>
                    <span className="info-value">{formatCurrency(movie.budget)}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="info-item">
                    <span className="info-label">
                      <TrendingUp size={16} />
                      Revenue
                    </span>
                    <span className="info-value">{formatCurrency(movie.revenue)}</span>
                  </div>
                )}
                {movie.production_companies.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">
                      <Film size={16} />
                      Production
                    </span>
                    <span className="info-value">
                      {movie.production_companies.map(c => c.name).slice(0, 2).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Tabs Section */}
      <section className="details-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast & Crew
          </button>
          <button
            className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`tab-button ${activeTab === 'similar' ? 'active' : ''}`}
            onClick={() => setActiveTab('similar')}
          >
            Similar Movies
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="overview-grid">
                  <div className="overview-main">
                    <h3>Synopsis</h3>
                    <p>{movie.overview}</p>
                    
                    {movie.production_companies.length > 0 && (
                      <>
                        <h3>Production Companies</h3>
                        <div className="production-companies">
                          {movie.production_companies.map(company => (
                            <div key={company.id} className="company-item">
                              {company.logo_path ? (
                                <img 
                                  src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                  alt={company.name}
                                  className="company-logo"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="company-name">{company.name}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="overview-sidebar">
                    <div className="detail-card">
                      <h4>Details</h4>
                      <dl>
                        <dt>Status</dt>
                        <dd>{movie.status}</dd>
                        <dt>Release Date</dt>
                        <dd>{new Date(movie.release_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</dd>
                        <dt>Original Title</dt>
                        <dd>{movie.original_title}</dd>
                        <dt>Spoken Languages</dt>
                        <dd>{movie.spoken_languages.map(l => l.english_name).join(', ')}</dd>
                        {movie.homepage && (
                          <>
                            <dt>Homepage</dt>
                            <dd>
                              <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                                Visit Official Site
                              </a>
                            </dd>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cast Tab */}
            {activeTab === 'cast' && credits && (
              <div className="cast-tab">
                <h3>Top Billed Cast</h3>
                <div className="cast-grid">
                  {credits.cast.slice(0, 12).map(person => (
                    <motion.div 
                      key={person.id} 
                      className="cast-card"
                      whileHover={{ y: -5 }}
                    >
                      {person.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                          className="cast-photo"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x300/1a1a2e/FFE8DB?text=No+Photo';
                          }}
                        />
                      ) : (
                        <div className="cast-photo-placeholder">
                          <Users size={40} />
                        </div>
                      )}
                      <h4>{person.name}</h4>
                      <p>{person.character}</p>
                    </motion.div>
                  ))}
                </div>
                
                {credits.crew.filter(p => p.job === 'Director' || p.job === 'Producer' || p.job === 'Writer').length > 0 && (
                  <>
                    <h3>Crew</h3>
                    <div className="crew-grid">
                      {credits.crew
                        .filter(p => p.job === 'Director' || p.job === 'Producer' || p.job === 'Writer')
                        .slice(0, 6)
                        .map((person, index) => (
                          <div key={`${person.id}-${index}`} className="crew-card">
                            <h4>{person.name}</h4>
                            <p>{person.job}</p>
                          </div>
                        ))
                      }
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="videos-tab">
                {videos.length > 0 ? (
                  <div className="videos-grid">
                    {videos.map(video => (
                      <div key={video.id} className="video-card">
                        <a 
                          href={`https://www.youtube.com/watch?v=${video.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-thumbnail"
                        >
                          <img 
                            src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                            alt={video.name}
                          />
                          <div className="play-overlay">
                            <PlayCircle size={40} />
                          </div>
                        </a>
                        <h4>{video.name}</h4>
                        <p>{video.type}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-content">No videos available</p>
                )}
              </div>
            )}
            
            {/* Similar Movies Tab */}
            {activeTab === 'similar' && (
              <div className="similar-tab">
                {similar.length > 0 ? (
                  <div className="similar-grid">
                    {similar.map(movie => (
                      <Card
                        key={movie.id}
                        movie={movie}
                        variant="detailed"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="no-content">No similar movies found</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
};

export default MovieDetails;