import React, { useState } from 'react';
import './FilterBar.css';

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
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'title.asc', label: 'Title A-Z' },
  { value: 'title.desc', label: 'Title Z-A' }
];

const FilterBar = ({ onFilterChange, filters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    genre: filters.genre || '',
    year: filters.year || '',
    rating: filters.rating || '',
    sort: filters.sort || 'popularity.desc'
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      year: '',
      rating: '',
      sort: 'popularity.desc'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.genre || localFilters.year || localFilters.rating;

  return (
    <div className="filter-bar">
      <button 
        className="filter-bar__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path 
            d="M3 7h14M6 12h8M9 17h2" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="filter-bar__badge" aria-label="Active filters">
            {[localFilters.genre, localFilters.year, localFilters.rating].filter(Boolean).length}
          </span>
        )}
      </button>

      <div className={`filter-bar__content ${isOpen ? 'filter-bar__content--open' : ''}`}>
        <div className="filter-bar__group">
          <label htmlFor="genre-filter" className="filter-bar__label">
            Genre
          </label>
          <select
            id="genre-filter"
            className="filter-bar__select"
            value={localFilters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {GENRES.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__group">
          <label htmlFor="year-filter" className="filter-bar__label">
            Year
          </label>
          <select
            id="year-filter"
            className="filter-bar__select"
            value={localFilters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {YEARS.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__group">
          <label htmlFor="rating-filter" className="filter-bar__label">
            Min Rating
          </label>
          <select
            id="rating-filter"
            className="filter-bar__select"
            value={localFilters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="9">9+ ⭐</option>
            <option value="8">8+ ⭐</option>
            <option value="7">7+ ⭐</option>
            <option value="6">6+ ⭐</option>
            <option value="5">5+ ⭐</option>
          </select>
        </div>

        <div className="filter-bar__group">
          <label htmlFor="sort-filter" className="filter-bar__label">
            Sort By
          </label>
          <select
            id="sort-filter"
            className="filter-bar__select"
            value={localFilters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            className="filter-bar__clear"
            onClick={clearFilters}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;