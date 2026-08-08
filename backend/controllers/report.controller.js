const db = require ('../db.js');

//sales reports

exports.salesReport = async(req, res) =>{
    try{
        const {startDate, endDate} = req.query
        const [results] = await db.query("select count(*) as totalSales sum(total_amount) as totalRevenue from sales where created_at >= ? and created_at <= ?", [startDate, endDate])
        return res.status(200).json({success: true, report: results[0]})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

////low stock
exports.lowStock = async (req, res) =>{
    try{
        const {quantity} = req.query
         const threshold = quantity || 10;
        const [results] = await db.query("select * from products where quantity <= ?",[threshold] )
        return res.status(200).json({success: true, report: results})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//topSellingProducts
exports.topSellingProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const resultLimit = limit || 10; // top 10 by default

        const [results] = await db.query(
            `SELECT 
                products.id, 
                products.name, 
                SUM(sale_items.quantity) AS totalSold
             FROM sale_items
             JOIN products ON sale_items.product_id = products.id
             GROUP BY products.id, products.name
             ORDER BY totalSold DESC
             LIMIT ?`,
            [resultLimit]
        );

        return res.status(200).json({ success: true, report: results });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

//revenue vs expenses
exports.incomeVsExpenseReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const [results] = await db.query(
            `SELECT type, SUM(amount) AS total
             FROM transactions
             WHERE created_at >= ? AND created_at <= ?
             GROUP BY type`,
            [startDate, endDate]
        );

        return res.status(200).json({ success: true, report: results });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
