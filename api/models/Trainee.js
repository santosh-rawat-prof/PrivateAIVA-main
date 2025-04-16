const mongoose = require("mongoose");

const traineeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    empId: { type: Number, required: true, unique: true },
    batch: { type: String, required: true },
    subBatch: { type: String, required: true },
    role: { type: String, default: "trainee" },
    faceDescriptors: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Trainee", traineeSchema);
