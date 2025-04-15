const mongoose = require("mongoose");

const traineeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    empId: { type: String, required: true, unique: true },
    batch: { type: String, required: true },
    subBatch: { type: String, required: true },
    faceDescriptors: {
        type: [String],
        required: true,
        validate: [array => array.length > 0, "At least one face descriptor is required"]
    },

    role: { type: String, required: true, default: "trainee" }
}, { timestamps: true });


module.exports = mongoose.model("Trainee", traineeSchema);