const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" }
});

module.exports = mongoose.model("Admin", adminSchema);