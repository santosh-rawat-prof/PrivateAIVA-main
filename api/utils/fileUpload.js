const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const timestamp = Date.now();
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${timestamp}${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = [".xlsx"];
	const ext = path.extname(file.originalname).toLowerCase();

	if (!allowedTypes.includes(ext)) {
		return cb(new Error("Only .xlsx files are allowed"));
	}

	cb(null, true);
};

const upload = multer({
	storage,
	limits: {
		fileSize: 20 * 1024 * 1024,
	},
	fileFilter,
});

module.exports = upload;
