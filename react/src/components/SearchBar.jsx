import React, { useState, useCallback, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search movies...", initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== initialValue) {
        onSearch(searchTerm);
      }
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setIsTyping(true);
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    onSearch('');
    setIsTyping(false);
  }, [onSearch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setIsTyping(false);
  }, [searchTerm, onSearch]);

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-bar__wrapper">
        <svg 
          className="search-bar__icon" 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          aria-hidden="true"
        >
          <path 
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM15 15l4 4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        
        <input
          type="search"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          aria-label="Search movies"
          autoComplete="off"
        />
        
        {searchTerm && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M15 5L5 15M5 5l10 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        
        {isTyping && (
          <div className="search-bar__spinner" aria-label="Searching...">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;