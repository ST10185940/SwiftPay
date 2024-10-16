import jwt from "jsonwebtoken";

const checkauth = (req,res,next) =>
{
    try{
        const token = req.headers.authorization.split(" ")[1];
        if (!token){
            return res.status(403).send({auth: false , message: "No token provided"})
        }
        jwt.verify(token, process.env.JWT_SECRET || "")
        next();
    }catch(error){
        res.status(401).json({message: "token invalid" });
    }
};

export default checkauth;