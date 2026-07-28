const db = require ('../db.js');

//create a transaction ( an expense )
exports.createTransaction = async (req, res) => {
    try{
        const { amount, category, description } = req.body
        if (!amount || amount <= 0){
            return res.status(400).json({error: "Amount must be greater than zero"})
        }
        const [results] = await db.query("insert into transactions (type, amount, category, description, created_by) values (?, ?, ?, ?, ?)", ["expenses", amount, category, description, req.user.id])
        return res.status(201).json({success: true, message: " Transaction Created Successfully"})
    }catch(err) {
        return res.status(500).json({error: err.message})
    }
}

//delete a transaction
exports.deleteTransaction = async (req, res) =>{
    try{
        const {id} = req.params
        const [results] = await db.query ("select * from transactions where id =?", [id])
        if( results.length === 0){
            return res.status(404).json({error: "Transaction Not Found"})
        }
        const [sql] = await db.query("delete from transactions where id =?", [id])
        return res.status(200).json({success: true, message : "Transaction Deleted Successfully"})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//update a transaction
exports.updateTransaction = async (req,res) =>{
    try{
        const {id} = req.params
        const {amount, category, description } = req.body
        const [results] = await db.query ("select * from transactions where id =?", [id])
        if( results.length === 0){
            return res.status(404).json({error: "Transaction Not Found"})
        }
        const [sql] = await db.query ("update transactions set amount =?, category =?, description=? where id =?", [amount, category, description, id])
        return res.status(200).json ({ success: true, message : "Transaction Updated successfully"})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}
//view all transactions
exports.viewAllTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        let sql = "SELECT * FROM transactions WHERE 1=1";
        const params = [];

        if (type) {
            sql += " AND type = ?";
            params.push(type);
        }

        if (startDate) {
            sql += " AND created_at >= ?";   
            params.push(startDate);
        }

        if (endDate) {
            sql += " AND created_at <= ?";  
            params.push(endDate);
        }

        sql += " ORDER BY created_at DESC";

        const [results] = await db.query(sql, params);
        return res.status(200).json({ success: true, transactions: results });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
//view one transaction
exports.viewOneTransaction = async (req, res) =>{
    try{
        const {id} = req.params
        const [results] = await db.query("select * from transactions where id =?", [id])
        if( results.length === 0){
            return res.status(404).json({error: "Transaction Not Found"})
        }
        return res.status(200).json({success: true, transactions : results[0]})
    }catch(err) {
        return res.status(500).json({error: err.message})
    }
}
