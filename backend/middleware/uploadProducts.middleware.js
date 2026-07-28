const multer = require("multer");
const path = require("path");

//  Where + how files get saved 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/products/"); // folder the file gets saved into
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); 
        cb(null, uniqueSuffix + ext);
    },
});

// Only allow image files 
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .png, and .webp image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;