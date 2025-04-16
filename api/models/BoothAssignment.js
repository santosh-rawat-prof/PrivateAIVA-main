const mongoose = require("mongoose");

const boothAssignmentSchema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: "Trainee", required: true, unique: true },
    boothName: { type: String, required: true },
    sessionPart: { type: Number, required: true }
});

module.exports = mongoose.model("BoothAssignment", boothAssignmentSchema);