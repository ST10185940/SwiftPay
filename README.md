# SwiftPay Server

This server-side implementation is part of a POE Project for APDS73111 titled: "SwiftPay",and serves as a secure and efficient payment processing platform for an international bank. Its build using Node.js, Express.js, and MongoDB for database operations.

## Key Features

* User registration with validation for name, ID number, account number, username, and password
* Secure password storage using Argon2
* Hashing and field-level encryption used to protect sensitive data
* Token-based authentication using JSON Web Tokens (JWT)
* Rate limiting and IP blocking for security against brute-force attacks
* Support for HTTPS encryption
* CORS enabled for cross-origin requests
* Helmet for security headers
* Express SSLify for HTTPS redirection

## API Endpoints

* `/customer/register`: Registers a new customer
* `/transaction/*`: Handles transaction-related operations
* `/bankEmp/*`: Handles bank employee operations

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Argon2
* AES-256-CBC
* JSON Web Tokens (JWT)
* Express Brute
* Helmet
* Express SSLify
* CORS
* HTTPS
* SSL Certificate
* dotenv
* express-rate-limit
* express-slow-down
* mongoose
* nodemon
* validator

## Setup and Running the SwiftPay Server

To set up and run the SwiftPay server, follow these steps:

1. **Clone the Repository**: Clone the SwiftPay server repository from GitHub or your preferred version control system to a local directory on your machine.
2. **Install Dependencies**: Navigate to the cloned repository directory and run `npm install` to install all the required dependencies specified in the `package.json` file.
3. **Start the Server**: Once the dependencies are installed, start the server by running `node server.mjs` in your terminal or command prompt.
4. **Server URL**: The SwiftPay server will now be running on `https://localhost:3001`.
5. **SSL Certificate**: Ensure that the SSL certificates are properly configured and trusted by your system.
6. **Environment Variables**: Set the required environment variables, such as `JWT_SECRET`, before running the server in production.
7. **Database Connection**: Ensure that MongoDB is installed and running on your system. Configure the MongoDB connection settings in the server code to match your MongoDB setup.
8. **Troubleshooting**: Refer to the server logs for error messages and debugging information if you encounter any issues during setup or runtime.

