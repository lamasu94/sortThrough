const db = require('../db.js');

// ─ Create a sale 
// Expected request body shape:
// {
//   customerId: 12,              // optional — nullable in schema
//   items: [
//     { productId: 4, quantity: 2 },
//     { productId: 9, quantity: 1 }
//   ]
// }
exports.createSale = async (req, res) => {
    const { customerId, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "A sale must include at least one item" });
    }

    // must run on this same connection for BEGIN/COMMIT/ROLLBACK to work together
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        let totalAmount = 0;
        const saleItemRows = []; // collected here, inserted after we know the sale's id

        // ── Step 1: validate stock + calculate totals BEFORE writing anything ──
        for (const item of items) {
            const [productResults] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [item.productId]
            );

            if (productResults.length === 0) {
                throw new Error(`Product with id ${item.productId} not found`);
            }

            const product = productResults[0];

            if (product.quantity < item.quantity) {
                throw new Error(`Not enough stock for "${product.name}" (only ${product.quantity} left)`);
            }

            const subtotal = product.selling_price * item.quantity;
            totalAmount += subtotal;

            saleItemRows.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.selling_price,
                subtotal,
            });
        }

        // ── Step 2: insert the sale itself ──
        const [saleResult] = await connection.query(
            "INSERT INTO sales (customer_id, created_by, total_amount) VALUES (?, ?, ?)",
            [customerId || null, req.user.id, totalAmount]
        );
        const saleId = saleResult.insertId;

        // ── Step 3: insert each sale_item + reduce stock ──
        for (const row of saleItemRows) {
            await connection.query(
                "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)",
                [saleId, row.productId, row.quantity, row.unitPrice, row.subtotal]
            );

            await connection.query(
                "UPDATE products SET quantity = quantity - ? WHERE id = ?",
                [row.quantity, row.productId]
            );
        }

        // ── Step 4: auto-create the matching revenue transaction ──
        await connection.query(
            "INSERT INTO transactions (type, amount, description, sale_id, created_by) VALUES (?, ?, ?, ?, ?)",
            ["revenue", totalAmount, `Revenue from sale #${saleId}`, saleId, req.user.id]
        );

        // all 4 steps succeeded — make it permanent
        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Sale created successfully",
            sale: { id: saleId, totalAmount },
        });
    } catch (err) {
        // something failed — undo everything since BEGIN
        await connection.rollback();
        return res.status(400).json({ error: err.message });
    } finally {
        // always give the connection back to the pool, success or failure
        connection.release();
    }
};

// ── View all sales (sales history) ─────────────────────
exports.viewAllSales = async (req, res) => {
    try {
        const { startDate, endDate, customerId } = req.query;
        let sql = `
            SELECT sales.*, customers.full_name AS customer_name, users.name AS sold_by
            FROM sales
            LEFT JOIN customers ON sales.customer_id = customers.id
            LEFT JOIN users ON sales.created_by = users.id
            WHERE 1=1
        `;
        const params = [];

        if (startDate) {
            sql += " AND sales.created_at >= ?";
            params.push(startDate);
        }
        if (endDate) {
            sql += " AND sales.created_at <= ?";
            params.push(endDate);
        }
        if (customerId) {
            sql += " AND sales.customer_id = ?";
            params.push(customerId);
        }

        sql += " ORDER BY sales.created_at DESC";

        const [results] = await db.query(sql, params);
        return res.status(200).json({ success: true, sales: results });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ── View one sale, including its line items ─────────────
exports.viewOneSale = async (req, res) => {
    try {
        const { id } = req.params;

        const [saleResults] = await db.query(
            `SELECT sales.*, customers.full_name AS customer_name, users.name AS sold_by
             FROM sales
             LEFT JOIN customers ON sales.customer_id = customers.id
             LEFT JOIN users ON sales.created_by = users.id
             WHERE sales.id = ?`,
            [id]
        );

        if (saleResults.length === 0) {
            return res.status(404).json({ error: "Sale not found" });
        }

        const [itemResults] = await db.query(
            `SELECT sale_items.*, products.name AS product_name
             FROM sale_items
             JOIN products ON sale_items.product_id = products.id
             WHERE sale_items.sale_id = ?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            sale: { ...saleResults[0], items: itemResults },
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};