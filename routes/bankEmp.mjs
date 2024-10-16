import express from "express";
import db from "../db/conn.mjs";

import argon2 from "argon2";
import jwt from "jsonwebtoken";

import ExpressBrute from "express-brute";
import {body , matchedData} from "express-validator";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);


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