const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainee",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        default: "Absent"
    }
}, { timestamps: true });

// Ensure date is always stored at start of the day
attendanceSchema.pre('save', function (next) {
    if (this.date) {
        this.date = new Date(new Date(this.date).setHours(0, 0, 0, 0));
    }
    next();
});

attendanceSchema.index({ trainee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
