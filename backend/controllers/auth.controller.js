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
            process.env.JWT_SECRET, {expiresIn: "1h"}
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
        const [sql] = await db.query("insert into users(name, email, password, role, avatar) values (?, ?, ?, ?,?)",
             [name, email,hashPassword, role, avatar])
        return res.status(201).json({ success: true, userId: sql.insertId });
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}
//get porfile
exports.getProfile = async( req, res) =>{
    try{
        const [results] =await db.query("select email, name, role, avatar from users where id = ?", [req.user.id])
        if( results.length === 0 ){
            return res.status(404).json({error: "employee Not Found"})
        }
        return res.status(200).json({ success: true, user:results[0]})
    }catch(err){
         return res.status(500).json({error: err.message})
    }
}
//update profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const [currentUser] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
        if (currentUser.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const image = req.file ? req.file.filename : currentUser[0].avatar;
        const [emailCheck] = await db.query(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [email, req.user.id]
        );
        if (emailCheck.length > 0) {
            return res.status(409).json({ error: "This email is already in use" });
        }
        await db.query(
            "UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?",
            [name, email, image, req.user.id]
        );
        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//changePasword
exports.changePassword = async (req,res) =>{
    try{
        const {currentPassword, hashedPassword} = req.body
        const {id} = req.user.id
        const [results] = await db.query("select * from users where id =?", [id])
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, req.user.id]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}