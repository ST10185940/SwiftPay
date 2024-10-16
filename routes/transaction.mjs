import express from "express";
import checkauth from "../checkAuth.mjs";
import { body, validationResult , matchedData } from "express-validator";

import crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // 128-bit I
const router = express.Router();

router.post("/pay", checkauth, [
    body('amount').isNumeric(),
    body('currency').trim().escape(),
    body('provider').trim().escape(),
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
    const provider = sanitizedInput.provider;
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
        provider,
        accountNumber: encryptedAccountNumber,
        swiftCode: encryptedSwiftCode
    });
    try {
        const collection = await db.collection("Transactions");
        const result = await collection.insertOne(transaction);
        res.status(201).send(result);
    } catch (error) {
        console.error("Error inserting transaction:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

function encrypt(text){
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData:encrypted};
}

export default router;
