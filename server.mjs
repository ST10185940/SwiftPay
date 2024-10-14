import https from "https";

import fs from "fs";

import customer from "./routes/customer.mjs"
import transaction  from "./routes/transaction.mjs";
import bankEmp from "./routes/bankEmp.mjs" 

import express from "express";
import cors from "cors";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

import expressSSL from "express-sslify";


const PORT = 3001;
const app = express();

const options = {
    key: fs.readFileSync('keys\privatekey.pem'),
    cert: fs.readFileSync('keys\new-cert.pem')
};

app.use(express.urlencoded({extended:true}));

const limiter = ratelimit({
    window: 15* 60 * 1000,
    limits: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
});

const speedLimiter = slowDown({
    window: 15 * 60 * 1000,
    delayAfter: 5,
    delayMs: (hits) => hits * 100
});

app.use(helmet({
    contentSecurityPolicy:{
        directives:{
            "default-script":['"self"'],
            "script-src": ["'self'"]
        },
        frameguard: {
            action: deny
        }
    }
   })
);

app.use(limiter);
app.use(speedLimiter);
app.use(expressSSL.HTTPS());
app.use(cors());

app.use("/customer", customer);
app.use("/transaction",transaction);
app.use("bankEmp",bankEmp);

app.route("/customer", customer);
app.route("/transaction",transaction);
app.route("bankEmp",bankEmp);

let server = https.createServer(options,app);
server.listen(PORT, () => console.log("SwiftPay Server running on " + PORT));


