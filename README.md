# Voting Application

This is a full-stack voting application that allows users to register, log in, cast their votes for candidates, and view live vote counts. It also includes an admin panel for managing candidates.

## Table of Contents

* [Features](https://www.google.com/search?q=%23features)

* [Technologies Used](https://www.google.com/search?q=%23technologies-used)

* [Project Structure](https://www.google.com/search?q=%23project-structure)

* [Setup and Installation](https://www.google.com/search?q=%23setup-and-installation)

  * [Prerequisites](https://www.google.com/search?q=%23prerequisites)

  * [Backend Setup](https://www.google.com/search?q=%23backend-setup)

  * [Frontend Setup](https://www.google.com/search?q=%23frontend-setup)

* [Usage](https://www.google.com/search?q=%23usage)

* [Admin Functionality](https://www.google.com/search?q=%23admin-functionality)

* [Contributing](https://www.google.com/search?q=%23contributing)

* [License](https://www.google.com/search?q=%23license)

## Features

* **User Authentication:** Secure user registration and login using Aadhar Card Number and password.

* **Role-Based Access Control:** Differentiates between `voter` and `admin` roles.

* **Voter Dashboard:** Displays available candidates and allows authenticated voters to cast a single vote.

* **Live Vote Counts:** Shows real-time vote tallies for all parties/candidates.

* **User Profile Management:** Users can view their profile details and change their password.

* **Admin Panel:**

  * Add new candidates (name, party, age).

  * Update existing candidate details.

  * Delete candidates.

* **Responsive UI:** Designed to be user-friendly across various devices.

* **Secure API Communication:** Uses JWT for authentication on API calls.

## Technologies Used

**Backend:**

* **Node.js:** JavaScript runtime environment.

* **Express.js:** Web application framework for Node.js.

* **MongoDB:** NoSQL database for data storage.

* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.

* **bcryptjs:** For password hashing.

* **jsonwebtoken (JWT):** For secure authentication.

* **passport & passport-local:** For authentication strategies.

**Frontend:**

* **React.js:** JavaScript library for building user interfaces.

* **Tailwind CSS:** A utility-first CSS framework for rapid UI development (via CDN for simplicity).

* **React Hooks:** For state management and lifecycle methods in functional components.

## Project Structure

```

.
├── Backend/
│   ├── .env              \# Environment variables (e.g., MongoDB URI, JWT Secret)
│   ├── db.js             \# MongoDB connection setup
│   ├── jwt.js            \# JWT token generation and verification
│   ├── models/
│   │   ├── candidate.js  \# Mongoose schema for Candidates
│   │   └── user.js       \# Mongoose schema for Users
│   ├── node\_modules/     \# Backend dependencies (ignored by Git)
│   ├── package.json      \# Backend dependencies and scripts
│   ├── package-lock.json \# Locked versions of backend dependencies
│   ├── planning.txt      \# (Optional) Any planning notes for backend
│   ├── routes/
│   │   ├── candidateRoutes.js \# API routes for candidate management and voting
│   │   └── userRoutes.js      \# API routes for user authentication and profile
│   └── server.js         \# Main backend server file
├── Frontend/
│   └── client/
│       ├── public/       \# Public assets (HTML, manifest, favicons)
│       ├── src/          \# React source code
│       │   ├── App.js    \# Main React application component
│       │   ├── index.js  \# React entry point
│       │   └── ... (other components, CSS files)
│       ├── node\_modules/ \# Frontend dependencies (ignored by Git)
│       ├── .gitignore    \# Git ignore rules for frontend
│       ├── package.json    \# Frontend dependencies and scripts
│       └── package-lock.json \# Locked versions of frontend dependencies
└── .gitignore            \# Global Git ignore rules
└── README.md             \# This file

```

## Setup and Installation

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (LTS version recommended)

* **npm** (Node Package Manager, comes with Node.js)

* **MongoDB Community Server** or access to a MongoDB Atlas cluster.

### Backend Setup

1. **Navigate to the Backend directory:**

```

cd Backend

```

2. **Install dependencies:**

```

npm install

```

3. **Create a `.env` file:**
In the `Backend` directory, create a file named `.env` and add your environment variables.

```

PORT=3000
MONGODB\_URI=your\_mongodb\_connection\_string
JWT\_SECRET=your\_jwt\_secret\_key

```

* Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., `mongodb://localhost:27017/votingapp` for local, or your Atlas connection string).

* Replace `your_jwt_secret_key` with a strong, random string (e.g., generated using an online tool or `require('crypto').randomBytes(32).toString('hex')` in Node.js console).

4. **Run the Backend Server:**

```

npm start

```

The backend server will start on `http://localhost:3000` (or your specified PORT).

### Frontend Setup

1. **Navigate to the Frontend client directory:**

```

cd Frontend/client

```

2. **Install dependencies:**

```

npm install

```

3. **Run the Frontend Application:**

```

npm start

```

The React application will open in your browser, usually at `http://localhost:3001`.

## Usage

1. **Register:**

* Access the application in your browser.

* If you don't have an account, click "Create Account" or "Signup here".

* Fill in the required details, including your Aadhar Card Number and a strong password. Select your role (voter or admin).

* **Note:** For initial setup, you might want to create an `admin` user first to add candidates.

2. **Login:**

* Enter your Aadhar Card Number and password.

3. **Voter Dashboard:**

* After logging in as a `voter`, you will see the dashboard displaying available candidates and live vote counts.

* You can cast your vote by clicking the "Vote" button next to your preferred candidate. You can only vote once.

4. **User Profile:**

* Navigate to the "Profile" section from the top navigation bar to view your personal information and change your password.

## Admin Functionality

If you logged in as an `admin`:

1. **Admin Panel:**

* Navigate to the "Admin Panel" from the top navigation bar.

* **Add New Candidate:** Use the form to add a new candidate with their name, party, and age.

* **Update Candidate:** Select an existing candidate from the dropdown, update their details in the form, and click "Update Candidate."

* **Delete Candidate:** Select a candidate from the dropdown and click "Delete Candidate."

## Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1. Fork the repository.

2. Create a new branch (`git checkout -b feature/your-feature-name`).

3. Make your changes.

4. Commit your changes (`git commit -m 'Add new feature'`).

5. Push to the branch (`git push origin feature/your-feature-name`).

6. Open a Pull Request.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details. (You might want to create a `LICENSE` file in your root directory if you haven't already).
