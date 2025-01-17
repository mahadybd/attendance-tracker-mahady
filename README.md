Certainly! Here's your updated `README.md` in a single-page format:

---

# Attendance Tracker

A web application for tracking attendance. This project uses Node.js, Express, MongoDB, and Tailwind CSS for front-end styling. It supports features like authentication, session management, and email notifications.

## Features

- **User Authentication**: Login, register, and logout functionality with JWT authentication.
- **Attendance Tracking**: Track the attendance of users, including timestamps and status.
- **Session Management**: Secure session handling using `express-session` and MongoDB as the session store.
- **Responsive Design**: Built with Tailwind CSS for a modern, responsive UI.
- **Email Notifications**: Sends email alerts for important actions using `Nodemailer`.
- **Data Storage**: Uses MongoDB to store user and attendance data.

## Technologies Used

- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for Node.js to handle routes and HTTP requests.
- **MongoDB**: NoSQL database for storing attendance and user data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB to simplify data interaction.
- **JWT**: JSON Web Token for secure user authentication.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Nodemailer**: For sending emails.
- **Moment.js**: For date/time handling.
- **Nodemon**: For automatic server reloading during development.

## Installation

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine. Verify with:
  ```bash
  node -v
  npm -v
  ```

- **MongoDB**: You need a MongoDB database. Use either a local installation or a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mahadybd/attendance-tracker-mahady.git
   cd attendance-tracker-mahady
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `config.env` file in the root of your project and add the following variables:
     ```env
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongo_db_connection_string
     SESS_NAME=your_session_name
     SESS_SECRET=your_session_secret
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your_email
     EMAIL_PASS=your_email_password
     ```

4. **Ignore the `config.env` file**:
   - If you're using a `config.env` file for sensitive configuration, ensure that it is ignored by Git by adding the following line to your `.gitignore` file:
     ```gitignore
     /config/config.env
     ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will run the server with `nodemon`, which automatically reloads when changes are detected.

6. **Access the app**:
   Open your browser and navigate to `http://localhost:5000`.

## Usage

- **Register**: Create a new account using the registration form.
- **Login**: Use the login form to authenticate.
- **Track Attendance**: Once logged in, mark and view attendance records.
- **Email Notifications**: Receive notifications for specific actions, such as when attendance is marked.

## Contributing

Contributions are welcome! If you'd like to improve this project, feel free to fork the repository and submit a pull request.

### Steps for contributing:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:

- Ensure your `.env` file contains valid credentials and secrets.
- Replace placeholders in the MongoDB URI and email credentials with actual values.
- For issues or suggestions, please open an issue in the GitHub repository.

---