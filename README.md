# Practice - Node.js API Project

## Description

Practice for making the apis using nodejs. This project implements a social/dating platform called DevTinder, featuring user authentication, profiles, connection requests, and a feed system. It demonstrates the use of Express.js, MongoDB with Mongoose, JWT authentication, cron jobs, and email services.

## What I Did in This Project

This is a comprehensive Node.js API project where I built a full-stack backend for a dating/social platform. Here's what I implemented:

### 1. Project Setup and Configuration

- Set up a Node.js project with Express.js as the web framework
- Configured MongoDB connection using Mongoose ODM
- Implemented environment variable management with dotenv
- Set up CORS for frontend integration (specifically for React app on localhost:5173)
- Configured cookie parsing for JWT token handling

### 2. Database Design and Models

- Created User model with comprehensive validation (name, email, password, gender, age, skills, photoUrl)
- Implemented ConnectionRequest model for managing user connections
- Added schema-level validations and custom methods for password hashing and JWT generation
- Set up database indexes for efficient querying

### 3. Authentication System

- Built complete user authentication with signup, login, and logout
- Implemented password hashing using bcrypt with salt rounds of 10
- Created JWT token generation and verification
- Set up cookie-based session management for security
- Developed userAuth middleware for protecting routes

### 4. API Routes Development

- **Authentication Routes**: Signup with email validation and welcome emails, login with JWT, logout
- **Profile Routes**: View profile, edit profile with validation, change password
- **Connection Routes**: Send connection requests, review/accept/reject requests
- **User Routes**: Get received requests, view connections, paginated feed

### 5. Security and Validation

- Implemented input validation using validator library
- Added strong password requirements
- Created custom validation functions for signup, profile edit, and password change
- Protected sensitive routes with JWT authentication

### 6. Automated Tasks

- Set up daily cron job at 8 AM to send email notifications for pending connection requests
- Used date-fns for date calculations in cron job
- Integrated nodemailer for SMTP email sending

### 7. Email Integration

- Configured nodemailer with SMTP settings
- Automated welcome emails on user signup
- Daily notifications for users with pending connection requests

### 8. Error Handling and Best Practices

- Comprehensive error handling throughout the application
- Proper HTTP status codes and error messages
- Database connection handling with success/failure logging
- Modular code structure with separate files for routes, models, utils, and middleware

## Features

- User registration and login with JWT authentication
- User profile management (view, edit, change password)
- Connection request system (send, receive, accept/reject)
- User feed with pagination
- Daily email notifications for pending connection requests
- Secure password hashing with bcrypt
- Input validation using validator library
- CORS support for frontend integration
- Cookie-based session management

## Technologies/Libraries Used

- **Express.js** (^5.2.1): Web framework for Node.js - Used for creating the server, handling HTTP requests, routing, and middleware
- **Mongoose** (^9.1.1): MongoDB object modeling for Node.js - Used for database connection, schema definition, and data validation
- **bcrypt** (^6.0.0): Password hashing library - Used for hashing user passwords with salt rounds of 10 for security
- **jsonwebtoken** (^9.0.3): JWT implementation for authentication - Used for generating and verifying JWT tokens with 1-day expiration
- **cookie-parser** (^1.4.7): Parse HTTP request cookies - Used for parsing JWT tokens stored in cookies
- **cors** (^2.8.5): Enable CORS with various options - Configured to allow requests from React frontend on localhost:5173 with credentials
- **dotenv** (^17.2.3): Load environment variables from .env file - Used for managing sensitive configuration like email credentials
- **validator** (^13.15.26): String validation and sanitization - Used for email validation, strong password checking, and URL validation
- **node-cron** (^4.2.1): Task scheduling for cron jobs - Used for scheduling daily email notifications at 8:00 AM
- **nodemailer** (^7.0.12): Send emails from Node.js - Used for SMTP email sending with Gmail configuration
- **date-fns** (^4.1.0): Modern JavaScript date utility library - Used for date calculations in cron jobs (yesterday's date, start/end of day)

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd practice
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables (see Environment Variables section).

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on port 3000.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password
```

These are used for sending emails via nodemailer.

## Folder Structure

```
practice/
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── src/
    ├── app.js                 # Main application entry point
    ├── config/
    │   └── database.js        # MongoDB connection configuration
    ├── middlewares/
    │   └── userAuth.js        # JWT authentication middleware
    ├── models/
    │   ├── connectionRequest.js # Connection request model
    │   └── user.js            # User model
    ├── routes/
    │   ├── auth.js            # Authentication routes (signup, login, logout)
    │   ├── profile.js         # Profile management routes
    │   ├── request.js         # Connection request routes
    │   └── user.js            # User-related routes (feed, connections, requests)
    └── utils/
        ├── cronJob.js         # Scheduled email notifications
        ├── emailService.js    # Email sending service
        └── validation.js      # Input validation functions
```

## Database Models/Schemas

### User Model

The User schema includes the following fields:

- `firstName` (String, required, 3-10 chars)
- `lastName` (String, optional, 3-10 chars)
- `email` (String, required, unique, validated)
- `password` (String, required, strong password validation)
- `gender` (String, validated: male/female/others)
- `photoUrl` (String, default URL, validated)
- `skills` (Array of Strings, max 10)
- `age` (Number, required, >18)

Schema methods:

- `isPassValid(userInputPassword)`: Compares hashed password
- `getjwt()`: Generates JWT token

### ConnectionRequest Model

The ConnectionRequest schema manages connection requests between users:

- `fromUserId` (ObjectId, ref: User, required)
- `toUserId` (ObjectId, ref: User, required)
- `status` (String, enum: interested/ignored/accepted/rejected, required)

Includes a compound index on `fromUserId` and `toUserId` for efficient querying, and a pre-save hook to prevent self-requests.

## API Routes/Endpoints

### Authentication Routes (`/`)

- `POST /signup`: Register a new user
  - Body: firstName, lastName, email, password, gender, skills, age
- `POST /login`: User login
  - Body: email, password
  - Sets JWT token in cookie
- `POST /logout`: User logout
  - Clears JWT token cookie

### Profile Routes (`/`)

- `GET /profile/view`: Get logged-in user's profile (Protected)
- `PATCH /profile/edit`: Edit user profile (Protected)
  - Body: firstName, lastName, photoUrl, gender, skills, age
- `PATCH /profile/forGotPassword`: Change password (Protected)
  - Body: newPassword, confirmPassword

### Request Routes (`/`)

- `POST /request/:status/:toUserId`: Send connection request (Protected)
  - Params: status (interested/ignored), toUserId
- `POST /request/review/:status/:requestId`: Review connection request (Protected)
  - Params: status (accepted/rejected), requestId

### User Routes (`/`)

- `GET /user/requests/received`: Get pending connection requests (Protected)
- `GET /user/connections`: Get user's connections/friends (Protected)
- `GET /feed`: Get user feed with pagination (Protected)
  - Query: page, limit (max 50)

## Authentication (JWT)

- JWT tokens are generated upon successful login using the `getjwt()` method in the User model.
- Tokens are stored in HTTP-only cookies for security.
- The `userAuth` middleware verifies the JWT token on protected routes, decodes it to get the user ID, fetches the user from the database, and attaches it to the request object (`req.findUser`).
- Token expiration is set to 1 day.

## Cron Jobs

A daily cron job runs at 8:00 AM using `node-cron`:

- Fetches pending connection requests (status: "interested") from the previous day using `date-fns` for date calculations.
- Sends email notifications to users with pending requests using the email service.
- Uses MongoDB aggregation to get unique email addresses and filter requests.

## Email Service

- Uses `nodemailer` for sending emails via SMTP.
- Configured with environment variables for host, port, user, and password.
- Sends welcome emails on user signup and daily notifications for pending connection requests.
- From address: "DevTinder" <loonaali358@gmail.com>

## Usage/Running the Project

1. Ensure MongoDB is running and accessible.
2. Set up environment variables in `.env` file.
3. Run `npm run dev` to start the server with nodemon.
4. The API will be available at `http://localhost:3000`.
5. Use tools like Postman or curl to test the endpoints.
6. Protected routes require authentication (login first to get JWT cookie).

Example API call:

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"StrongPass123!","age":25}'
```

## Contributing

This is a practice project. Feel free to fork and modify for your own learning purposes.

## Author

Ali hamza
