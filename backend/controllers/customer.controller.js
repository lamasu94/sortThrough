const db = require ('../db.js');

//create new customer
exports.createCustomer = async (req, res) => {
    try{
        const { fullName, phone, email, address} = req.body
        const [results] =  await db.query("select * from customers where phone =?", [phone])
        if( results.length > 0 ){
            return res.status(409).json({error: "Customer already exist"})
        }
        const [sql] = await db.query("insert into customers (full_name, phone, email, address) values (?, ?, ?, ?)",
             [fullName, phone, email, address])
        return res.status(201).json({success: true, message: "Customer  created successfully"})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//delete customer
exports.deleteCustomer = async (req, res) =>{
    try{
    const { id } = req.params
    const [results] =  await db.query("select * from customers where id =?", [id])
        if( results.length === 0 ){
            return res.status(404).json({error: "Customer Not Found"})
        }
        const [sql] = await db.query ("delete from customers where id = ?", [id])
        return res.status(200).json({ success: true, message: "Customer  deleted successfully"})

    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//update customer 
exports.updateCustomer = async (req, res) => {
    try{
        const { id } = req.params
        const { fullName, phone, email, address} = req.body
        const [results] =  await db.query("select * from customers where id =?", [id])
        if( results.length === 0 ){
            return res.status(404).json({error: "Customer Not Found"})
        }
        const [sql] = await db.query("update customers set full_name =?, phone=?, email=?, address=? where id =? ", [ fullName, phone, email, address, id])
         return res.status(200).json({ success: true, message: "Customer Updated successfully"})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//view all customers or searched customers
exports.viewAllCustomers = async (req, res) => {
    try {
        const { search } = req.query;

        let sql = "SELECT * FROM customers";
        let params = [];

        if (search) {
            sql += " WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ?";
            params = [`%${search}%`, `%${search}%`, `%${search}%`];
        }

        const [results] = await db.query(sql, params);
        return res.status(200).json({ success: true, customers: results });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

//view cuatomer bu id
exports.viewOneCustomer = async (req, res) => {
    try{
        const {id} = req.params
        const [results] =  await db.query("select * from customers where id =?", [id])
        if( results.length === 0 ){
            return res.status(404).json({error: "Customer Not Found"})
        }
        return res.status(200).json({success: true, customers: results[0]})

    }catch(err) {
 return res.status(500).json({error: err.message})
    }
}

