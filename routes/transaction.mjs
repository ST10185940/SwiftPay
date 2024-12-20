import express from "express";
import checkauth from "../checkAuth.mjs";
import { body, validationResult , matchedData } from "express-validator";

import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY || ""; // 256-bit key
const iv = process.env.ENCRYPTION_IV || ""; // 128-bit I

const router = express.Router();

router.post("/pay", checkauth, [
    body('amount').isNumeric(),
    body('currency').trim().escape(),
    body('accountNumber').trim().escape(),
    body('swiftCode').trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const sanitizedInput = matchedData(req);
    const amount = sanitizedInput.amount;
    const currency = sanitizedInput.currency;
    const accountNumber = sanitizedInput.accountNumber;
    const swiftCode = sanitizedInput.swiftCode;

    // Validate input using regex
    const accountNumberRegex = /^[0-9]{9,18}$/;
    const swiftCodeRegex = /^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$/;

    if (!accountNumberRegex.test(accountNumber) || !swiftCodeRegex.test(swiftCode)) {
        return res.status(400).json({ message: "Invalid account number or swift code" });
    }

    // Encrypt account number and swift code
    const encryptedAccountNumber = encrypt(accountNumber);
    const encryptedSwiftCode = encrypt(swiftCode);

    // Save transaction to database
    let transaction = new Transaction({
        amount,
        currency,
        provider: "SWIFT",
        account_number: encryptedAccountNumber,
        swiftCode: encryptedSwiftCode,
        swift_verified: false
    });
    try {
        const collection = await db.collection("Transactions");
        const result = await collection.insertOne(transaction);
        console.log("transaction created", json(result));
        res.status(201);
    } catch (error) {
        console.error("Error inserting transaction:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

function encrypt(text){
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export default router;
