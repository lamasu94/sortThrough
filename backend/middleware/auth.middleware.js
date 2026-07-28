const jwt= require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//to verify token

const verifyToken = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
           return res.status(401).json({error:"Access Denied "})
        }
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        return res.status(401).json({error: "Invalid token or token expired"})
    }
}

//middle for RBAC
const checkRole = (...roles) =>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({error: "Access denied"})
        }
        next();
    }
}

module.exports = {verifyToken, checkRole};

