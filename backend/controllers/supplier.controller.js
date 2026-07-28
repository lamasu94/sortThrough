const db = require ('../db.js');

//create a supplier
exports.createSupplier = async (req, res) => {
    try{
    const { companyName, contactPerson, email, phone, address} = req.body
    const [results] = await db.query ( "select * from suppliers where phone =?", [phone])
    if(results.length > 0){
        return res.status(409).json({error : "Supplier already exist"})
    }
    const [sql] = await db.query("insert into suppliers (company_name, contact_person, email, phone, address) values(?, ?, ?, ?, ?)", [companyName, contactPerson, email, phone, address])
    return res.status(201).json({ success: true, meassage: "Supplier Created Suuccessfully"})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//delete a supplier 
exports.deleteSupplier = async (req, res) => {
    try{
        const {id} = req.params
        const [results] = await db.query("select * from suppliers where id =?", [id])
        if( results.length === 0 ){
            return res.status(404).json({error: "Supplier Not Found"})
        }
        const[sql] = await db.query( "delete from suppliers where id= ?", [id])
        return res.status(200).json({success: true, message: "Supplier Deleted Successfully"})
    } catch(err){
        return res.status(500).json({error: err.message})
    }
}

//update a supplier
exports.updateSupplier = async (req, res) => {
    try{
        const {id} = req.params
        const { companyName, contactPerson, email, phone, address} = req.body
        const [results] = await db.query ( "select * from suppliers where id =?", [id])
        if(results.length === 0){
            return res.status(404).json({error : "Supplier NOt Found"})
        }
        const [sql] = await db.query ("update suppliers set company_name = ?, contact_person = ?, email = ?, phone = ?, address = ? where id =?", [companyName, contactPerson, email, phone, address, id])
        return res.status(200).json({success: true, message: "Supplier updated successfully"})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

//view All Supplier
exports.viewAllSuppliers = async(req, res ) => {
    try{
        const {search} = req.query
        let sql = "select * from suppliers "
        let params = []
        if(search){
            sql +=  "where company_name like ? or contact_person like ? or email like ? or phone like ? "
            params = [`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%` ]
        }
        const [results] = await db.query(sql,params)
        return res.status(200).json({ success: true, suppliers: results})

    }catch(err){
         return res.status(500).json({error: err.message})
    }
}

//view one supplier
exports.viewOneSupplier = async (req, res) => {
    try{
        const {id} = req.params
         const [results] =  await db.query("select * from suppliers where id =?", [id])
        if( results.length === 0 ){
            return res.status(404).json({error: "supplier Not Found"})
        }
        return res.status(200).json({success: true, suppliers: results[0]})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}