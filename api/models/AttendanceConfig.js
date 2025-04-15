const mongoose = require("mongoose");

const attendanceConfigSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ["checkin", "checkout"],
        required: true
    },
    cutoffTime: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    validTo: {
        type: Date,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("AttendanceConfig", attendanceConfigSchema);