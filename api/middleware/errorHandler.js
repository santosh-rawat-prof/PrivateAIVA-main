module.exports = (err, req, res, next) => {
	if (err.message === "Only .xlsx files are allowed") {
		return res.status(400).json({ msg: err.message });
	}
	if (err.code === "LIMIT_FILE_SIZE") {
		return res.status(400).json({ msg: "File too large. Max size is 20MB." });
	}

	console.error("from Error Handler -->"+ err);
	return res.status(500).json({ msg: "Server error", error: err.message });
};
