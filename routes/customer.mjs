import express from "express";
import db from "../db/conn.mjs";

import { ObjectId } from "mongodb";

import argon2 from "argon2";

import crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // 128-bit IV

import jwt from "jsonwebtoken";

import ExpressBrute from "express-brute";
import {body , validationResult, matchedData} from "express-validator";

import IBAN from "iban";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

//register

const nameRegex = /^[a-zA-Z '-]+$/;
const idRegex = /^[0-9]{8,17}$/;
const accNumRegex = /^[A-Z]{0,2}(?![0-9]{0,3}$)([A-Z0-9 -]{5,34})$/;



router.post("/register", [
    body('fullname').trim().escape(),
    body('id_number').trim().escape(),
    body('account_number').trim().escape(),
    body('username').trim().escape().matches(/^[a-zA-Z0-9._-]{3,20}$/),
    body('password').trim().escape().isStrongPassword()
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const sanitizedInput = matchedData(req);

    let fullname = sanitizedInput.fullname;
    let id_number = sanitizedInput.id_num;
    let account_number = sanitizedInput.account_number;
    let password = sanitizedInput.password;

    let validationErrors = [];

    if (!nameRegex.test(fullname)) {
        validationErrors.push("Invalid Full Name. Only letters, spaces, hyphens, and apostrophes are allowed.");
    }

    if (!idRegex.test(id_number)) {
        validationErrors.push("Invalid ID Number. ID number should be between 8 - 17 digits.");
    }

    if (!accNumRegex.test(account_number) || !IBAN.isValid(account_number)) {
        validationErrors.push("Invalid Account Number. Account number should be between 5 - 34 characters and in a valid IBAN format.");
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }else{
        fullname = await argon2.hash(fullname);
        password = await argon2.hash(password);
        id_number = encrypt(id_number);
        account_number = encrypt(account_number);

        let newCustomer = {
            fullname:fullname,
            id_number: id_number,
            account_number: account_number,
            username: username,
            password: password
        };
        let collection = await db.collection("Customers");
        let result = await collection.insertOne(newCustomer);
        res.send(result).status(201);
    }
});

function encrypt(text){
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData:encrypted};
}

// Decrypt function to be used in get request for customer data
// function decrypt(encryptedText, iv) {
//     const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
//     let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
//   }

//Login

const jwtSecret = process.env.JWT_SECRET || "";

router.post("login", bruteforce.prevent,[
    body('username').trim().escape(),
    body('password').trim().escape()
] , async (req,res) => {

    const sanitizedInput = matchedData(req);

    username = sanitizedInput.username;
    password = sanitizedInput.password;

    try{
        const collection =  await db.collection("Customers");
        const customer = await collection.findOne({username});

        if(!customer){
            return res.status(401).send({message: "Authentication Failed"});
        }

        const passwordMatch = await argon2.verify(customer.password , password)
        if(!passwordMatch){
            return res.status(401).send({message: "Authentication Failed"});
        }else{
            const token = jwt.sign({
                username: username
            }, jwtSecret, {expiresIn: "15m"});
            return res.status(200).json({message: "Authentication Successful" , token})
        }
    }catch(e){
        console.log("Loging error:", e);
        res.status(500),json({message: "Login Failed"});
    }
});

export default router;