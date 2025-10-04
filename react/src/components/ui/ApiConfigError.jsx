import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import './ApiConfigError.css';

const ApiConfigError = () => {
  return (
    <div className="api-config-error">
      <div className="error-content">
        <AlertCircle size={64} className="error-icon" />
        <h1>API Configuration Required</h1>
        <p>The TMDB API key is not configured. This app requires a valid API key to fetch movie data.</p>

        <div className="setup-instructions">
          <h2>Setup Instructions:</h2>
          <ol>
            <li>
              Get a free API key from{' '}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
              >
                TMDB <ExternalLink size={14} />
              </a>
            </li>
            <li>Add the API key to your environment variables</li>
            <li>
              <strong>For deployment:</strong> Set <code>VITE_TMDB_API_KEY</code> in your hosting platform
            </li>
            <li>
              <strong>For local development:</strong> Create a <code>.env</code> file with:
              <pre>VITE_TMDB_API_KEY=your_api_key_here</pre>
            </li>
          </ol>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ApiConfigError;
