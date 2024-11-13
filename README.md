# ScreenSurf 🎬  
**A Movie Recommendation Web App**  

ScreenSurf is a web application that provides personalized movie recommendations. Built with a modern tech stack, the app leverages the DBMovies API to offer tailored movie suggestions based on user preferences. 

## Features
- **User Authentication**: Secure login and registration.
- **Personalized Recommendations**: Custom movie suggestions for logged-in users.
- **Detailed Movie Information**: Synopsis, cast, and release details for each movie.

## Tech Stack
- **Frontend**: React with Vite for a fast, responsive UI.
- **Backend**: Node.js and Express.js for handling API requests and application logic.
- **Database**: MongoDB for storing user data.
- **API**: DBMovies API for movie data.
- **Middleware**: CORS for cross-origin requests, `bcrypt` for password hashing, and `jsonwebtoken` (JWT) for session management.

## Installation

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/Unknownkratos/ScreenSurf.git
   cd ScreenSurf
2.Install dependencies and set environment variables:

      ```bash
      npm install
      Create a .env file in the root directory and add:

      DB_URI=your_mongodb_uri
      JWT_SECRET=your_jwt_secret
      API_KEY=your_dbmovies_api_key

3.Run the app:

      npm start

Usage

Register or log in to access personalized movie recommendations.
Browse recommended movies or search for specific titles.
Click on a movie to view detailed information.
Project Structure
/react: Contains the React frontend.
/server: Contains the Express backend and database connection.
Contributing
Feel free to fork this repository and make contributions. Submit a pull request with any improvements.

License
This project is open-source and available under the MIT License.
