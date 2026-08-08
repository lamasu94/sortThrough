const db =require('../db.js');

//updateEmployee
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const [currentUser] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (currentUser.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        const [emailCheck] = await db.query(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [email, id]
        );
        if (emailCheck.length > 0) {
            return res.status(409).json({ error: "This email is already in use" });
        }
        const image = req.file ? req.file.filename : currentUser[0].avatar;
        await db.query(
            "UPDATE users SET name = ?, email = ?, role = ?, avatar = ? WHERE id = ?",
            [name, email, role, image, id]
        );
        return res.status(200).json({ success: true, message: "Employee updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

//deleteEmployee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        if (Number(id) === req.user.id) {
            return res.status(403).json({ error: "You cannot delete your own account" });
        }
        const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        await db.query("DELETE FROM users WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

//view one
exports.viewOneEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query(
            "SELECT id, name, email, role, avatar, created_at, updated_at FROM users WHERE id = ?",
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        return res.status(200).json({ success: true, user: results[0] });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

 //view all
exports.viewAllEmployees = async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT id, name, email, role, avatar, created_at, updated_at FROM users"
        );
        return res.status(200).json({ success: true, users: results });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};