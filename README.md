# Watch Auctionary

A full-stack web application for listing and bidding on luxury watch
auctions.

Users can create auction listings, place bids, ask and answer questions,
and manage their profile, all within a clean, modern UI.

------------------------------------------------------------------------

## Features

-   User authentication (Sign up / Sign in / Sign out)
-   Create auction listings with end date & starting bid
-   Live bidding system
-   "Highest bidder" and "You won this auction" indicators
-   Question & Answer system (buyers ask, sellers answer)
-   Profile dashboard:
    -   Items selling
    -   Items bidding on
    -   Auctions ended
-   Auction status handling (active / ended)
-   Responsive luxury-themed UI (Bootstrap + custom styling)

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   Vue.js (Vite)
-   Bootstrap
-   Bootstrap Icons
-   LocalStorage (for session handling)

### Backend

-   Node.js
-   Express.js
-   SQLite
-   JWT-style session tokens (custom implementation)
-   JOI validation
-   Password hashing with PBKDF2 (crypto)

------------------------------------------------------------------------

## Project Structure

### Frontend

-   `src/` → Vue components, services, router
-   `public/` → Static assets
-   `index.html` → App entry point
-   `vite.config.js` → Vite configuration

### Backend

-   `app/`
    -   `controllers/`
    -   `models/`
    -   `routes/`
-   `database.js`
-   `server.js`
-   `db.sqlite` (local development database)

------------------------------------------------------------------------

## Installation & Setup

### 1️⃣ Clone the repository

``` bash
git clone https://github.com/FaizanAli-2004/auction-project
cd  project-folder
```

------------------------------------------------------------------------

### 2️⃣ Backend Setup

``` bash
cd backend
npm install
npm run dev
```

Backend will run on:

    http://localhost:3000

------------------------------------------------------------------------

### 3️⃣ Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

    http://localhost:5173

------------------------------------------------------------------------

## Security

-   Passwords are securely hashed using PBKDF2.
-   Session tokens are stored in database.
-   Input validation is handled using JOI.
-   Basic authentication middleware protects private routes.

------------------------------------------------------------------------

## Author

Faizan Ali\
Full-stack Web Developer

------------------------------------------------------------------------

## License

This project is built for educational purposes.
