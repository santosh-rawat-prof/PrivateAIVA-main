const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" }
});

const Admin = mongoose.model("Admin", adminSchema);

const DB_URI = "mongodb://0.0.0.0:27017/AIVA__CONFERENCE__DB";

async function seedAdmin() {
    console.log("Starting admin seeding...");
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB.");

        const existing = await Admin.findOne({ name: "admin" });
        if (existing) {
            console.log("Admin already exists. Skipping seeding.");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin", 12);

        const newAdmin = new Admin({
            name: "admin",
            password: hashedPassword,
        });

        await newAdmin.save();
        console.log("Admin seeded successfully.\n");
    } catch (err) {
        console.error("Failed to seed admin. Error:", err.message);
        throw err;
    }
}

async function getToken() {
    console.log("Requesting token from /api/admin/login...");
    try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": "admin",
                "password": "admin"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Login failed:", data.message || "Unknown error");
            throw new Error("Login failed.");
        }

        if (!data.token) {
            console.error("No token received from server.");
            throw new Error("Token missing in response.");
        }

        console.log("Token received successfully.\n");
        return data.token;
    } catch (error) {
        console.error("Error getting token:", error.message);
        throw error;
    }
}

async function configAttendance(token) {
    console.log("Configuring attendance settings...\n");
    try {
        const response = await fetch('http://localhost:5000/api/admin/configAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mode: "checkin",
                startTime: "07:30",
                endTime: "18:00",
                cutoffTime: "11:00"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to configure attendance:", data.message || "Unknown error");
            throw new Error("Attendance config failed.");
        }

        console.log("Attendance configured successfully:", data, "\n");
    } catch (error) {
        console.error("Error configuring attendance:", error.message);
        throw error;
    }
}

async function setup() {
    console.log("Setup started...\n");
    try {
        await seedAdmin();
        const token = await getToken();
        await configAttendance(token);
        console.log("\nSetup completed successfully!");
    } catch (err) {
        console.error("\nSetup encountered an error:", err.message);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
        process.exit();
    }
}

setup();