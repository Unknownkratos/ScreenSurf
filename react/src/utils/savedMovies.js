const SAVED_MOVIES_KEY = 'savedMovies';
const MAX_SAVED_MOVIES = 100;

export const getSavedMovies = () => {
  try {
    const data = localStorage.getItem(SAVED_MOVIES_KEY);
    if (!data) return [];
    const movies = JSON.parse(data);
    return Array.isArray(movies) ? movies : [];
  } catch (error) {
    console.error('Error reading saved movies:', error);
    return [];
  }
};

export const saveMovie = (movie) => {
  try {
    const savedMovies = getSavedMovies();

    // Check if movie is already saved
    if (savedMovies.find(m => m.id === movie.id)) {
      return false; // Movie already saved
    }

    // Add movie to the beginning of the array
    const updatedMovies = [movie, ...savedMovies];

    // Limit the number of saved movies
    const limitedMovies = updatedMovies.slice(0, MAX_SAVED_MOVIES);

    // Save to localStorage
    localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(limitedMovies));

    return true; // Successfully saved
  } catch (error) {
    console.error('Error saving movie:', error);
    return false;
  }
};

export const removeMovie = (movieId) => {
  try {
    const savedMovies = getSavedMovies();
    const updatedMovies = savedMovies.filter(m => m.id !== movieId);
    localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    return true;
  } catch (error) {
    console.error('Error removing movie:', error);
    return false;
  }
};

export const isMovieSaved = (movieId) => {
  const savedMovies = getSavedMovies();
  return savedMovies.some(m => m.id === movieId);
};

export const clearSavedMovies = () => {
  try {
    localStorage.setItem(SAVED_MOVIES_KEY, '[]');
    return true;
  } catch (error) {
    console.error('Error clearing saved movies:', error);
    return false;
  }
};

export const getSavedMoviesCount = () => {
  return getSavedMovies().length;
};