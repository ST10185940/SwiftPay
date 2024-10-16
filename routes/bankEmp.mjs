import express from "express";
import db from "../db/conn.mjs";

import argon2 from "argon2";
import jwt from "jsonwebtoken";

import ExpressBrute from "express-brute";
import {body , matchedData} from "express-validator";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

import checkauth from "../checkAuth.mjs";

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

// Verify and Forward Transaction

router.post("verifyNforward", bruteforce.prevent, checkauth ,[
    body('transactionId').trim().escape()
] , async (req,res) => {

    const sanitizedInput = matchedData(req);

    transactionId = sanitizedInput.transactionId;

    try{
        const transactionCollection = await db.collection("Transactions");
        const transaction = await transactionCollection.findOne({ _id: new ObjectId(transactionId) });

        if(!transaction){
            return res.status(404).send({message: "Transaction not found"});
        }

        await transactionCollection.updateOne({ _id: new ObjectId(transactionId) }, { $set: { swift_verified: true, status: "Processed and forwarded to SWIFT" } });
        return res.status(200).json({message: "Transaction verified and forwarded successfully"});

    }catch(e){
        console.log("Transaction verification and forwarding error:", e);
        res.status(500).json({message: "Transaction verification and forwarding failed"});
    }
});

export default router;