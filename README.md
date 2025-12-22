## Student Hub

Student Hub is a Node.js/Express web application that provides a simple student directory and profile management system. Students can sign up, create and edit a profile (with avatar and document uploads), and browse a public directory, while admins can manage users and maintain a list of banned words for content moderation.

### Features

- **Authentication**
  - Student sign up and login.
  - Session-based authentication using `express-session` and `connect-mongo`.
- **Student Profiles**
  - View and edit personal profile.
  - Upload profile pictures and student ID documents.
- **Student Directory**
  - Public directory of students (depending on your controller/view logic).
- **Admin Panel**
  - Admin dashboard to view students and pending accounts.
  - Manage banned words for safer content.
- **Content Moderation**
  - Middleware to check user-generated content against banned words.

### Tech Stack

- **Backend**: Node.js, Express
- **View Engine**: EJS templates (`views` folder)
- **Database**: MongoDB with Mongoose (`models/User.js`, `models/BannedWord.js`)
- **Sessions**: `express-session` with `connect-mongo`
- **File Uploads**: Multer (`config/multer.js`)
- **Styling & Assets**: CSS, JS, and images in `public`

### Project Structure

- `app.js` – Main Express application entry point and route mounting.
- `config/` – Database (`db.js`) and Multer (`multer.js`) configuration.
- `controllers/` – Route handlers for auth, profiles, admin, and public pages.
- `middleware/` – Authentication and content moderation middleware.
- `models/` – Mongoose models for users and banned words.
- `routes/` – Express routers for auth, profile, admin, and public routes.
- `views/` – EJS views (pages and partials).
- `public/` – Static assets (CSS, JS, images, uploads).

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node)
- **MongoDB** running locally or in the cloud (e.g. MongoDB Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohamedKhaled217/Student_Hub.git
   cd Student_Hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create an environment file**

   In the project root, create a `.env` file:

   ```bash
   touch .env
   ```

   Add at least:

   ```env
   MONGODB_URI=mongodb://localhost:27017/student_hub
   SESSION_SECRET=your-strong-secret
   PORT=3000
   ```

   Adjust `MONGODB_URI` for your environment (local or cloud MongoDB).

### Running the App

- **Development (with nodemon)**:

  ```bash
  npm start
  ```

  This runs `nodemon app.js` (see `package.json`), watching for file changes.

- Once the server is running, open:

  ```text
  http://localhost:3000
  ```

### Scripts

- **`npm start`** – Starts the development server with nodemon.

### Environment & Configuration

- Sessions are stored in MongoDB via `connect-mongo` using `MONGODB_URI`.
- The session secret is read from `SESSION_SECRET` in `.env`.
- Static files (CSS, JS, images, uploads) are served from `public/`.

### License

This project is licensed under the ISC License. See `LICENSE` for details.


