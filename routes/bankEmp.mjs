import express from "express";
import db from "../db/conn.mjs";

import dotenv from "dotenv";
dotenv.config();

import argon2 from "argon2";
import jwt from "jsonwebtoken";

import ExpressBrute from "express-brute";
import {body , matchedData, Result} from "express-validator";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

import checkauth from "../checkAuth.mjs";

import crypto from "crypto";
const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY || ""; // 256-bit key
const iv = process.env.ENCRYPTION_IV || ""; // 128-bit I

//Login

const jwtSecret = process.env.JWT_SECRET || "";

router.post("/login", bruteforce.prevent,[
    body('username').trim().escape(),
    body('password').trim().escape()
] , async (req,res) => {

    const sanitizedInput = matchedData(req);

    username = sanitizedInput.username;
    password = sanitizedInput.password;

    try{
        const collection =  await db.collection("bankEmp");
        const emp = await collection.findOne({username});

        if(!emp){
            return res.status(401).send({message: "Authentication Failed"});
        }

        const passwordMatch = await argon2.verify(emp.password , password)
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


//get pending trnasactions

router.post("/transactions", checkauth , async (req,res) =>{
   try{

        const collection = await db.collection("Transactions");
        const transactions = await collection.find({}).toArray();

        if (!transactions.length) {
            return res.status(200).send({ data: [], message: 'No transactions found' });
        }

        const decryptedTransactions = await decryptTransactions(transactions);

        res.status(200).send({data: decryptedTransactions});
   }catch(error){
        console.log('Fecthing error:' ,error);
        res.status(500).send({error: 'failed to get pending transactions'})
   }
})

async function decryptTransactions(transactions) {
    try{

        return transactions.map(transaction => ({
            ...transaction,
            accountNumber: decrypt(transaction.accountNumber),
            swiftCode: decrypt(transaction.swiftCode)
        }));

    }catch(error){
        console.log('Decryption error',error);
        return transaction;
    }
}

function decrypt(encryptedText) {
   try{

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    
   }catch(error){
        console.log('Decryption error:' , error);
        return null;
   }

}

// Verify and Forward Transaction

router.post("/verify", checkauth ,[
    body('transactionId').trim().escape().isNumeric()
] , async (req,res) => {

    const sanitizedInput = matchedData(req);

    transactionId = sanitizedInput.transactionId;

    try{
        const transactionCollection = await db.collection("Transactions");
        const transaction = await transactionCollection.findOne({ _id: new ObjectId(transactionId) });

        if(!transaction){
            return res.status(404).send({message: "Transaction not found"});
        }

        await transactionCollection.updateOne({ _id: new ObjectId(transactionId) }, { $set: { swift_verified: true} });
        return res.status(200).json({message: "Transaction SWIFT code verified"});

    }catch(e){
        console.log("Transaction verification error:", e);
        res.status(500).json({message: "Transaction verification failure"});
    }
});

router.post("/submit", checkauth , async (req,res) => {
   try{
    const transactions = await db.collection("Transactions");

    if(!transactions) res.status(404).send({message: 'No verified transactions found'})
    
    const result =  await transactions.updateMany( 
        {swift_verified: true }, 
        {$set:{status: "Processed & forwarded to SWIFT"}});

    res.status(200).send({message: "Verified transactions forwarded to SWIFT"});
    console.log(`Updated ${result.modifiedCount} documents`);

   }catch(error){
     console.log('Forwarding error:', error);
   }

});

export default router;