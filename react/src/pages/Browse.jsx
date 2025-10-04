import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Grid, 
  List,
  Calendar,
  Star,
  TrendingUp 
} from 'lucide-react';
import Navigation from '../components/ui/Navigation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import '../styles/Browse.css';

const api_key = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3';

if (!api_key) {
  throw new Error('TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file');
}

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular', icon: TrendingUp },
  { value: 'vote_average.desc', label: 'Top Rated', icon: Star },
  { value: 'release_date.desc', label: 'Newest First', icon: Calendar },
  { value: 'release_date.asc', label: 'Oldest First', icon: Calendar }
];

const Browse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const MAX_MOVIES = 200; // Limit total movies to prevent memory issues
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [yearRange, setYearRange] = useState({ min: 1990, max: new Date().getFullYear() });
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 10 });
  
  const searchQuery = searchParams.get('search');
  const { ref, inView } = useInView({ threshold: 0 });
  
  const fetchMovies = useCallback(async (pageNumber, reset = false) => {
    setLoading(true);
    try {
      let url = '';
      const params = new URLSearchParams({
        api_key,
        page: pageNumber,
        sort_by: sortBy,
        'vote_average.gte': ratingRange.min,
        'vote_average.lte': ratingRange.max,
        'primary_release_date.gte': `${yearRange.min}-01-01`,
        'primary_release_date.lte': `${yearRange.max}-12-31`,
        with_genres: selectedGenres.join(',')
      });

      if (searchQuery) {
        url = `${API_URL}/search/movie?api_key=${api_key}&query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`;
      } else {
        url = `${API_URL}/discover/movie?${params}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (reset) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => {
          const newMovies = [...prev, ...(data.results || [])];
          // Limit total movies to prevent memory issues
          return newMovies.slice(0, MAX_MOVIES);
        });
      }

      // Stop loading more if we've reached the limit or no more pages
      setHasMore(pageNumber < (data.total_pages || 0) && movies.length < MAX_MOVIES);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies(reset ? [] : prev => prev);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, selectedGenres, yearRange, ratingRange]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
    
    // Cleanup function to prevent memory leaks
    return () => {
      setMovies([]);
    };
  }, [searchQuery, sortBy, selectedGenres, yearRange, ratingRange, fetchMovies]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMovies(page + 1);
    }
  }, [inView, hasMore, page, loading, fetchMovies]);

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setYearRange({ min: 1990, max: new Date().getFullYear() });
    setRatingRange({ min: 0, max: 10 });
  };

  return (
    <div className="browse">
      <Navigation />
      
      <div className="browse-container">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {(isFiltersOpen || window.innerWidth > 768) && (
            <motion.aside
              className={`filters-sidebar ${isFiltersOpen ? 'open' : ''}`}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-header">
                <h2>Filters</h2>
                <button 
                  className="filters-close"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sort By */}
              <div className="filter-section">
                <h3>Sort By</h3>
                <div className="sort-options">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                      onClick={() => setSortBy(option.value)}
                    >
                      <option.icon size={16} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="filter-section">
                <h3>Genres</h3>
                <div className="genre-grid">
                  {GENRES.map(genre => (
                    <button
                      key={genre.id}
                      className={`genre-chip ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                      onClick={() => toggleGenre(genre.id)}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div className="filter-section">
                <h3>Release Year</h3>
                <div className="range-inputs">
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={yearRange.min}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        setYearRange(prev => ({ ...prev, min: value }));
                      }
                    }}
                    className="range-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={yearRange.max}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        setYearRange(prev => ({ ...prev, max: value }));
                      }
                    }}
                    className="range-input"
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div className="filter-section">
                <h3>Rating</h3>
                <div className="rating-slider">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={ratingRange.min}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        setRatingRange(prev => ({ ...prev, min: value }));
                      }
                    }}
                    className="slider"
                  />
                  <div className="rating-values">
                    <span>{ratingRange.min.toFixed(1)}</span>
                    <span>{ratingRange.max.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={ratingRange.max}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        setRatingRange(prev => ({ ...prev, max: value }));
                      }
                    }}
                    className="slider"
                  />
                </div>
              </div>

              <Button 
                variant="secondary" 
                fullWidth
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="browse-main">
          {/* Content Header */}
          <div className="content-header">
            <div className="header-left">
              <button 
                className="filter-toggle"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter size={20} />
                Filters
              </button>
              {searchQuery && (
                <h2 className="search-results-title">
                  Search results for "{searchQuery}"
                </h2>
              )}
            </div>
            <div className="view-toggles">
              <button
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedGenres.length > 0 || searchQuery) && (
            <div className="active-filters">
              {selectedGenres.map(genreId => {
                const genre = GENRES.find(g => g.id === genreId);
                return (
                  <span key={genreId} className="filter-tag">
                    {genre?.name}
                    <button onClick={() => toggleGenre(genreId)}>
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
              {searchQuery && (
                <span className="filter-tag">
                  Search: {searchQuery}
                </span>
              )}
            </div>
          )}

          {/* Movies Grid */}
          <motion.div 
            className={`movies-grid ${viewMode}`}
            layout
          >
            <AnimatePresence>
              {movies.map((movie, index) => (
                <motion.div
                  key={`${movie.id}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <Card 
                    movie={movie}
                    variant={viewMode === 'list' ? 'detailed' : 'default'}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="loading-more">
              <LoadingSpinner variant="dots" />
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {hasMore && !loading && (
            <div ref={ref} className="scroll-trigger" />
          )}

          {/* No More Results */}
          {!hasMore && movies.length > 0 && (
            <div className="no-more-results">
              <p>You've reached the end!</p>
            </div>
          )}

          {/* No Results */}
          {!loading && movies.length === 0 && (
            <div className="no-results">
              <h3>No movies found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Browse;