
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" }
});

const Admin = mongoose.model("Admin", adminSchema);

const seedAdmin = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/AIVA__TEST__DB");

        const hashedPassword = await bcrypt.hash("admin", 12);

        const newAdmin = new Admin({
            name: "admin",
            password: hashedPassword,
        });

        await newAdmin.save();
        console.log("✅ Admin seeded successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to seed admin:", err);
        process.exit(1);
    }
};

seedAdmin();
