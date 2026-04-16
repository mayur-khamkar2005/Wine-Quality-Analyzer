# Wine Quality Analyzer

A MERN stack web application for predicting wine quality from chemical inputs, visualizing quality trends, and managing prediction history with role-based access.

The project includes:
- JWT authentication with protected routes
- Wine quality prediction workflow with saved history
- Analytics dashboard with charts and insights
- Admin panel for platform monitoring
- Responsive light/dark UI with a wine-inspired design system

## total Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- Recharts
- Framer Motion
- Tailwind CSS + custom global CSS variables

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod
- Helmet
- CORS
- Morgan
- express-rate-limit
- compression

## Core Features

- User registration and login with JWT-based authentication
- Protected application routes and admin-only access control
- Wine analyzer form with validation and numeric input handling
- Prediction result view with score, rating, category, and metrics
- History page with category filter and pagination
- Dashboard with score trends, category mix, recent activity, and insights
- Admin panel with user analytics and platform-wide prediction tracking
- Responsive UI built for mobile, tablet, laptop, and large screens

## Application Flow

```text
Frontend -> API -> Route -> Controller -> Service -> Database -> Response -> UI
```

## Project Structure

```text
wine test site/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- constants/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- validators/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env
|   |-- package.json
|   `-- package-lock.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- app/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- styles/
|   |   `-- utils/
|   |-- .env
|   |-- index.html
|   |-- tailwind.config.js
|   |-- postcss.config.js
|   |-- vite.config.js
|   `-- package.json
|-- package.json
`-- README.md
```

## Frontend Routes

- `/login` - user login
- `/register` - user registration
- `/dashboard` - analytics dashboard
- `/analyzer` - wine input and prediction page
- `/history` - saved prediction history
- `/admin` - admin-only monitoring page

## API Overview

Base URL:

```text
http://localhost:5000/api/v1
```

Main route groups:

- `GET /health` - health check
- `/auth` - `POST /register`, `POST /login`, `GET /me`
- `/wines` - `POST /predict`, `GET /`
- `/dashboard` - `GET /summary`
- `/admin` - `GET /overview`, `GET /users`, `GET /records`

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas connection

### 1. Install Dependencies

From the project root:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Create Environment Files

This workspace currently uses local `.env` files directly. Create these files manually:

- `backend/.env`
- `frontend/.env`

### 3. Backend Environment Variables

Use the following values in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/wine-quality-analyzer
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional admin bootstrap
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Platform Admin
```

Notes:
- `MONGODB_URI` and `JWT_SECRET` are required
- `CLIENT_URL` supports multiple values separated by commas
- If admin bootstrap values are provided, the server will ensure an admin user exists on startup

### 4. Frontend Environment Variables

Use the following value in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Start the App

Run both frontend and backend from the root:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`

## Available Scripts

### Root

```bash
npm run dev
npm run build
npm run start
npm run format
```

What they do:
- `npm run dev` - runs backend and frontend together
- `npm run build` - builds the frontend for production
- `npm run start` - starts the backend server
- `npm run format` - formats the project with Prettier

### Backend

```bash
npm --prefix backend run dev
npm --prefix backend run start
```

### Frontend

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run preview
```

## Architecture Notes

### Backend

- Modular Express structure with route, controller, service, and model separation
- Centralized validation and error handling
- Secure middleware stack with CORS, Helmet, compression, and rate limiting
- Graceful shutdown handling for MongoDB and the HTTP server

### Frontend

- Route-level lazy loading
- Protected route wrapper for authenticated and admin-only pages
- Shared design system using CSS variables and responsive layout utilities
- Reusable cards, charts, form fields, tables, and empty states

## UI Highlights

- Wine-inspired premium color palette
- Light mode and dark mode support
- Responsive dashboard cards and charts
- Touch-friendly controls for mobile devices
- Scroll-safe tables and chart containers

## Production Notes

For a production deployment:

1. Set `NODE_ENV=production`
2. Point `MONGODB_URI` to your production database
3. Use a strong `JWT_SECRET`
4. Set `CLIENT_URL` to your deployed frontend URL
5. Build the frontend with `npm run build`
6. Start the backend with `npm run start`

## Health Check

You can verify the backend server with:

```text
GET /api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "Wine Quality Analyzer API is healthy"
}
```
