const db =require('../db.js');

//create new category

exports.createCategory = async (req, res) =>{
    try{
        const {name, description} =req.body
        const [results] = await db.query("select * from categories where name =?", [name])
        if(results.length > 0){
            return res.status(409).json({error: "Category already exist"})
        }
        const [sql] = await db.query("insert into categories (name, description) values (?, ?)", [name, description])
        return res.status(201).json({ success: true, categoryId: sql.insertId });
    }catch(err){
        return res.status(500).json({error: err.message});
    }
}

//delete category

exports.deleteCategory = async (req, res) =>{
    try{
        const {id}= req.params
        const [results] = await db.query("select * from categories where name =?", [id])
         if(results.length === 0){
            return res.status(404).json({error: "Category doesn't exist"})
        }
        const [sql] = await db.query("delete from categories where name =? ", [name])
        return res.status(200).json({success: true, message: "Category Deleted Successfully" })
    }catch(err){
         return res.status(500).json({error: err.message});
    }
}

//update category

exports.updateCategory = async (req, res) =>{
    try{
        const {id}  = req.params
        const {name, description} = req.body
         const [results] = await db.query("select * from categories where id =?", [id])
         if(results.length === 0){
            return res.status(404).json({error: "Category doesn't exist"})
        }
        const [sql] = await db.query("UPDATE categories SET name = ?, description = ? WHERE id = ?", [name, description, id] )
         return res.status(200).json({success: true, message: "Category Updated Successfully" })

    }catch(err){
        return res.status(500).json({error: err.message});
    }
}
//view all

exports.viewAllCategory = async(req,res) =>{
    try{
        const [ results] = await db.query ("select * from categories")
        return res.status(200).json({success: true, categories: results})
    }catch(err){
         return res.status(500).json({error: err.message});
    }
}

//view one
exports.viewOneCategory = async(req,res) =>{
    try{
        const {id} = req.params
        const [ results] = await db.query ("select * from categories where id = ?", [id])
        if( results.length === 0){
             return res.status(404).json({error: "Category doesn't exist"})
        }
        return res.status(200).json({success: true, categories: results[0]})
    }catch(err){
         return res.status(500).json({error: err.message});
    }
}
