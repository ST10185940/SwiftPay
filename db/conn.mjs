import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString  = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try{
    conn = await client.connect();
    console.log('MongoDB Connected')
}catch(e){
    console.log(e);
}
let db = client.db('SwiftPay');

export default db;
