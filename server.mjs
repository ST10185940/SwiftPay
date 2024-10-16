import https from "https"; // Importing the HTTPS module for secure server creation
import fs from "fs"; // Importing the File System module for file operations

// Importing routes for customer, transaction, and bank employee operations
import customer from "./routes/customer.mjs"
import transaction  from "./routes/transaction.mjs";
import bankEmp from "./routes/bankEmp.mjs" 

import express from "express"; // Importing Express.js for web application framework
import cors from "cors"; // Importing CORS for cross-origin resource sharing

// Importing security modules for HTTP headers, rate limiting, and slowing down
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

import expressSSL from "express-sslify"; // Importing Express SSLify for HTTPS redirection

const PORT = 3001; // Defining the port number for the server
const app = express(); // Creating an Express.js application

// Reading SSL/TLS certificates for HTTPS
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/new-cert.pem')
};

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({extended:true}));

// rate limit for 10 requests within 15 minutes
const limiter = rateLimit({
    window: 15* 60 * 1000,
    limits: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
});

// speed limiter to slow down requests after 5 hits
const speedLimiter = slowDown({
    window: 15 * 60 * 1000,
    delayAfter: 5,
    delayMs: (hits) => hits * 100
});

// Helmet for security headers
app.use(helmet({
    contentSecurityPolicy:{
        directives:{
            "default-script":['"self"'],
            "script-src": ["'self'"]
        },
        frameguard: {
            action: "deny"
        }
    }
   })
);

// Applying rate limiter and speed limiter
app.use(limiter);
app.use(speedLimiter);

// Enabling HTTPS redirection
app.use(expressSSL.HTTPS());

// Enabling CORS for cross-origin requests
app.use(cors());

// Mounting routes for customer, transaction, and bank employee operations
app.use("/customer", customer);
app.use("/transaction",transaction);
app.use("/bankEmp",bankEmp);

app.route("/customer", customer);
app.route("/transaction",transaction);
app.route("/bankEmp",bankEmp);

// Creating an HTTPS server with the Express.js application
let server = https.createServer(options,app);
server.listen(PORT, () => console.log("SwiftPay Server running on " + PORT));

