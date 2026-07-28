const db =require('../db.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//login
exports.login = async (req,res) =>{
    try{
        const {email, password} = req.body;
        const [results] = await db.query("select * from users where email =?", [email])
        if( results.length === 0){
            return res.status(401).json({msg: "User not found"})
        }
        const passwordCompare = await bcrypt.compare(password, results[0].password)
        if(!passwordCompare){
            return res.status(401).json({msg: "Invalid Credentials"})
        }
        const token = jwt.sign({id:results[0].id, email: results[0].email, role:results[0].role},
            process.env.JWT_SECRET, {expiresIn: '1h'}
        )
        return res.status(200).json({msg: "Login Successful", success:true, token})

    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//register
exports.register = async (req,res)=>{
    try{
        const {name, email, password, role} = req.body;
        const image = req.file ? req.file.filename : null;
        const [results] = await db.query("select * from users where email =?", [email])
        if(results.length > 0){
            return res.status(409).json({err: "User Already Exist"})
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const [sql] = await db.query("insert into users(name, email, password, role) values (?, ?, ?, ?)",
             [name, email,hashPassword, role])
        return res.status(201).json({ success: true, userId: sql.insertId });
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}