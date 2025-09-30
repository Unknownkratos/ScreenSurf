import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, TrendingUp, Star, Clock } from 'lucide-react';
import Navigation from '../components/ui/Navigation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const api_key = import.meta.env.VITE_TMDB_API_KEY || 'dcce6d555b2e844ae0baef071ef69d93';

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % Math.min(5, trendingMovies.length));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const [trendingRes, topRatedRes, upcomingRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}`),
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}`),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}`)
      ]);

      const [trendingData, topRatedData, upcomingData] = await Promise.all([
        trendingRes.json(),
        topRatedRes.json(),
        upcomingRes.json()
      ]);

      setTrendingMovies(trendingData.results);
      setTopRatedMovies(topRatedData.results.slice(0, 10));
      setUpcomingMovies(upcomingData.results.slice(0, 10));
      setFeaturedMovie(trendingData.results[0]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to browse page with search query
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const MovieCarousel = ({ movies, title, icon: Icon }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const carouselRef = React.useRef(null);

    const scroll = (direction) => {
      const container = carouselRef.current;
      if (container) {
        const scrollAmount = container.clientWidth * 0.8;
        const newPosition = direction === 'left' 
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
        
        container.scrollTo({
          left: newPosition,
          behavior: 'smooth'
        });
        setScrollPosition(newPosition);
      }
    };

    return (
      <motion.section 
        className="carousel-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="carousel-header">
          <h2 className="carousel-title">
            <Icon size={24} className="carousel-icon" />
            {title}
          </h2>
          <div className="carousel-controls">
            <button 
              className="carousel-btn" 
              onClick={() => scroll('left')}
              disabled={scrollPosition === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => scroll('right')}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="carousel-container" ref={carouselRef}>
          <div className="carousel-track">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                className="carousel-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  movie={movie}
                  variant="default"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  onPlay={(movie) => console.log('Play:', movie)}
                  onAddToList={(movie) => console.log('Add to list:', movie)}
                  onLike={(movie) => console.log('Like:', movie)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  if (loading) {
    return (
      <div className="home">
        <Navigation />
        <SkeletonLoader variant="hero" />
        <div className="home-content">
          <SkeletonLoader variant="movie-card" count={6} />
        </div>
      </div>
    );
  }

  const currentHeroMovie = trendingMovies[currentHeroIndex] || featuredMovie;

  return (
    <div className="home">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <AnimatePresence mode="wait">
          {currentHeroMovie && (
            <motion.div
              key={currentHeroMovie.id}
              className="hero-content-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div 
                className="hero-backdrop"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${currentHeroMovie.backdrop_path})`
                }}
              >
                <div className="hero-gradient" />
                <div className="hero-vignette" />
              </div>
              
              <div className="hero-details">
                <motion.div 
                  className="hero-info"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="hero-title">{currentHeroMovie.title}</h1>
                  <div className="hero-meta">
                    <span className="hero-rating">
                      <Star size={16} fill="currentColor" />
                      {currentHeroMovie.vote_average.toFixed(1)}
                    </span>
                    <span className="hero-year">
                      {new Date(currentHeroMovie.release_date).getFullYear()}
                    </span>
                  </div>
                  <p className="hero-overview">
                    {currentHeroMovie.overview.length > 200 
                      ? currentHeroMovie.overview.substring(0, 200) + '...'
                      : currentHeroMovie.overview}
                  </p>
                  <div className="hero-actions">
                    <Button 
                      variant="primary" 
                      size="large"
                      icon={<Play size={20} fill="white" />}
                    >
                      Play Now
                    </Button>
                    <Button 
                      variant="glass" 
                      size="large"
                      icon={<Info size={20} />}
                      onClick={() => navigate(`/movie/${currentHeroMovie.id}`)}
                    >
                      More Info
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              {/* Hero Indicators */}
              <div className="hero-indicators">
                {trendingMovies.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentHeroIndex ? 'active' : ''}`}
                    onClick={() => setCurrentHeroIndex(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Enhanced Search Bar */}
      <section className="search-section">
        <motion.div 
          className="search-container"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="search-title">Discover Your Next Favorite</h2>
          <p className="search-subtitle">
            Millions of movies and TV shows to explore. Start watching now.
          </p>
          <form onSubmit={handleSearch} className="search-form-enhanced">
            <input
              type="text"
              placeholder="Search for movies, TV shows, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-enhanced"
            />
            <Button type="submit" variant="primary" size="large">
              Search
            </Button>
          </form>
        </motion.div>
      </section>

      {/* Content Sections */}
      <div className="home-content">
        <MovieCarousel 
          movies={trendingMovies} 
          title="Trending Now" 
          icon={TrendingUp}
        />
        
        <MovieCarousel 
          movies={topRatedMovies} 
          title="Top Rated" 
          icon={Star}
        />
        
        <MovieCarousel 
          movies={upcomingMovies} 
          title="Coming Soon" 
          icon={Clock}
        />
      </div>

      {/* Enhanced Footer */}
      <footer className="footer-enhanced">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ScreenSurf</h3>
            <p>Your ultimate destination for movies and TV shows.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">t</a>
              <a href="#" aria-label="Instagram">i</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ScreenSurf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;