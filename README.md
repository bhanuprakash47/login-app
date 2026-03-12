# Login App — MERN Authentication

A full-stack authentication application built with the MERN stack (MongoDB, Express, React, Node.js).

This project implements a complete and real-world authentication system from scratch — user registration, login, token-based session management, and secure account deletion. It is split into two separate apps: a React frontend and a Node.js backend, both connected over REST API.

---
## Live Demo

Frontend: https://login-app-frontend-kappa.vercel.app  
Backend API: https://login-app-backend-uqbw.onrender.com



## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Authentication Flow](#authentication-flow)
- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Run Locally](#run-locally)
- [Security Design](#security-design)
- [What This Project Shows](#what-this-project-shows)
- [Planned Improvements](#planned-improvements)

---

## Project Overview

This app allows users to:

- Create an account with name, email, password, phone, and gender
- Log in and receive a JWT access token
- Access a home page that requires login
- Log out and clear session
- Permanently delete their account

The backend is a REST API built with Express and MongoDB. The frontend is built with React using class components, React Router for navigation, and Axios for API calls.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI Library |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP requests to backend |
| js-cookie | Read and write browser cookies |
| Vite | Frontend build tool and dev server |

### Backend

| Technology | Purpose |
|---|---|
| Node.js (ES Modules) | Server runtime |
| Express v5 | Web framework and routing |
| MongoDB + Mongoose | Database and data modelling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation and verification |
| dotenv | Load environment variables |
| cors | Allow cross-origin requests |

---

## Authentication Flow

1. User fills signup form and submits.
2. Backend validates all required fields.
3. Password is hashed using bcrypt with 10 salt rounds.
4. User record is saved in MongoDB.
5. User goes to login page and enters email and password.
6. Backend finds user by email and compares password hash.
7. On success, server generates a JWT token with userId and email as payload.
8. JWT token is signed with 1 hour expiry — after this the server rejects the token on any protected API call.
9. Frontend stores the token in a browser cookie named `jwt_token` with a **1-hour expiry** — both the JWT and the cookie expire at the same time, keeping session behaviour consistent.
10. For protected API calls (like delete account), token is read from cookie and sent in `Authorization: Bearer <token>` header.
11. Backend middleware verifies token on protected routes before processing the request.
12. On logout, cookie is removed and user is redirected to login.

---

## Main Features

### 1. User Signup

- Form fields: username, email, phone, gender (radio), password
- Client-side validation:
  - All fields are required
  - Email must match valid format
  - Phone must be exactly 10 digits
- Backend validation:
  - Checks all required fields
  - Checks for duplicate email
- Password is hashed before saving
- Returns 201 on success

### 2. User Login

- Form fields: email, password
- Client-side validation:
  - Both fields required
  - Email format check
- Backend verifies credentials and returns JWT access token
- JWT token is valid for **1 hour** (enforced by the server on every protected API call)
- The token is stored in a browser cookie that also expires in **1 hour** — both expire together, so there is no stale cookie with a dead token sitting in the browser
- After 1 hour, the cookie is removed from the browser and the user will need to log in again
- On success, user is redirected to home page

### 3. Home Page (Session Check)

- Checks if `jwt_token` cookie is present on every render
- If token is missing, user is redirected to login immediately
- Home page shows welcome message, Logout button, and Delete Account button
- This is a client-side guard — the token is not verified against the server on this page

### 4. Logout

- Removes `jwt_token` cookie from browser
- Redirects user to login page

### 5. Delete Account

- Shows confirmation dialog before proceeding
- Sends `DELETE /api/users/delete` with token in Authorization header
- Backend verifies token, extracts userId, and deletes the user from MongoDB
- On success, cookie is cleared and user is redirected to login

---

## Project Structure

```text
Login_App/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection setup
│   │   └── env.js             # Load and validate env variables
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification middleware
│   │   └── error.middleware.js # Global error handler
│   ├── modules/
│   │   └── user/
│   │       ├── user.controller.js  # Request/response handlers
│   │       ├── user.model.js       # Mongoose schema
│   │       ├── user.routes.js      # Route definitions
│   │       └── user.service.js     # Business logic
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── utils/
│   │   └── ApiError.js        # Custom error class
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home/
│   │   │   │   ├── index.jsx  # Protected home page
│   │   │   │   └── index.css
│   │   │   ├── Login/
│   │   │   │   ├── index.jsx  # Login form
│   │   │   │   └── index.css
│   │   │   └── Signup/
│   │   │       ├── index.jsx  # Signup form
│   │   │       └── index.css
│   │   ├── App.jsx            # Routes definition
│   │   ├── App.css
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Backend Overview

### server.js
Entry point. Connects to MongoDB first, then starts Express server on configured PORT. Exits process if DB connection fails.

### app.js
Sets up Express app. Enables CORS, JSON parsing, user routes, health check endpoint, and global error handler.

### config/env.js
Reads environment variables with dotenv. Throws error at startup if MONGO_URI or JWT_SECRET_KEY is missing.

### config/db.js
Connects Mongoose to MongoDB URI. Logs success or exits on failure.

### middleware/auth.middleware.js
Reads Authorization header, extracts bearer token, verifies it using JWT secret. Adds decoded user data to `req.user` on success. Returns 401 on missing or invalid token.

### middleware/error.middleware.js
Global error handler. Returns JSON with `success: false` and `message`. Uses current response status or defaults to 500.

### modules/user/user.model.js
Mongoose schema with fields: `name`, `email` (unique), `gender`, `phone`, `password`. Includes auto timestamps.

### modules/user/user.service.js
Pure business logic layer:
- `createUser` — checks duplicate email, hashes password, saves user
- `validateUser` — finds user, compares password hash
- `DeleteAccount` — finds and deletes user by id

### modules/user/user.controller.js
Handles HTTP layer. Validates input, calls service functions, sends response. Generates JWT on login.

### utils/ApiError.js
Custom error class that carries `statusCode` and `message` for consistent error handling.

---

## Frontend Overview

### App.jsx
Defines three client-side routes using React Router:
- `/` → Home
- `/login` → Login
- `/signup` → Signup

### components/Login/index.jsx
Class component. Checks token on mount and redirects if already logged in. Validates form input, calls login API, stores token in cookie on success.

### components/Signup/index.jsx
Class component. Validates username, email format, 10-digit phone, and password. Calls signup API and redirects to login on success.

### components/Home/index.jsx
Class component. Checks cookie on render — redirects to login if missing. Handles logout (clears cookie) and delete account (calls backend API with token).

---

## API Reference

### Health Check

```
GET /api/health
```

Response:
```json
{ "status": "OK" }
```

---

### Signup

```
POST /api/users/signup
```

Request body:
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "gender": "MALE",
  "phone": "9876543210"
}
```

Success response `201`:
```json
{ "message": "Signup successful. Please login." }
```

Error responses:
- `400` — Missing fields
- `409` — Email already exists

---

### Login

```
POST /api/users/login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response `200`:
```json
{
  "message": "Login successful",
  "accessToken": "<jwt_token>"
}
```

Error responses:
- `400` — Missing fields
- `401` — Invalid email or password

---

### Delete Account

```
DELETE /api/users/delete
```

Header:
```
Authorization: Bearer <jwt_token>
```

Success response `200`:
```json
{ "message": "Account Successfully Deleted" }
```

Error responses:
- `401` — Missing or invalid token
- `404` — User not found

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
JWT_SECRET_KEY=your_strong_secret_key
MONGO_URI=your_mongodb_connection_string
```

> Backend will throw an error and refuse to start if MONGO_URI or JWT_SECRET_KEY is not set.

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=https://login-app-backend-uqbw.onrender.com
```


---

## Run Locally

### Prerequisites

- Node.js 18 or above
- npm
- MongoDB Atlas account or local MongoDB

### Step 1 — Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 2 — Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Open `http://localhost:5173` in your browser and use the app.

---

## Security Design

| Concern | How It Is Handled |
|---|---|
| Password storage | Hashed with bcrypt (10 salt rounds) |
| Token generation | JWT signed with secret key, expires in 1 hour (server enforced) |
| Token storage | Stored in browser cookie that also expires in 1 hour — JWT and cookie expiry are in sync |
| Protected API routes | Backend middleware verifies JWT on each request |
| Home page access | Client-side token presence check, redirect if missing |
| Sensitive fields | Password field removed from all response objects |

---

## What This Project Shows

- Clean separation between frontend and backend codebases
- Real JWT-based authentication system built from scratch
- Modular backend architecture with routes, controllers, services, and models as separate layers
- Input validation on both client and server sides
- Secure password handling using industry-standard bcrypt hashing
- Protected API endpoint with middleware-based token verification
- React class component patterns with state management and lifecycle methods
- Client-side routing and navigation using React Router
- REST API integration using Axios with Authorization headers
- Environment-based configuration for local and production setup

---

## Planned Improvements

- Add server-side email and phone format validation
- Fix error middleware to use custom `statusCode` from ApiError class
- Add refresh token support for longer sessions
- Restrict CORS to specific frontend domain
- Add unit and integration tests
- Move to HttpOnly cookie for more secure token storage
- Add `.env.example` files for easier project setup
