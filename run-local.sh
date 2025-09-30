#!/bin/bash

echo "🚀 Starting Screensurf Application..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    sudo systemctl start mongodb || mongod --dbpath ~/data/db &
    sleep 2
else
    echo "✅ MongoDB is already running"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "react/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd react && npm install && cd ..
fi

# Start backend server
echo "🔧 Starting backend server on port 5000..."
npm run dev:server &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend dev server
echo "⚛️ Starting React frontend on port 5173..."
cd react && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ Screensurf is running!"
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID