const jwt = require("jsonwebtoken");
const moment = require("moment");

const { euclideanDistance } = require("../utils/distanceUtil");
const { addToBlacklist } = require("../utils/tokenBlackList");
const { encryptDescriptor, decryptDescriptor } = require("../utils/cryptoUtil");

const Attendance = require("../models/Attendance");
const AttendanceConfig = require("../models/AttendanceConfig");
const Trainee = require("../models/Trainee");

const BoothAssignment = require("../models/BoothAssignment");
const { booths } = require("../booths");

const FACE_MATCH_THRESHOLD = 0.475;
const MAX_FIRST_PART_ASSIGNMENTS = 2;

exports.updateTraineeFaceDescriptors = async (req, res, next) => {
    try {
        const { empId, faceDescriptors } = req.body;

        if (!empId || !Array.isArray(faceDescriptors) || faceDescriptors.length === 0) {
            return res.status(400).json({ msg: "empId and faceDescriptors are required" });
        }

        const trainee = await Trainee.findOne({ empId });
        if (!trainee) {
            return res.status(404).json({ msg: "Trainee not found" });
        }

        const encryptedDescriptors = faceDescriptors.map(desc => encryptDescriptor(desc));
        trainee.faceDescriptors = encryptedDescriptors;

        await trainee.save();
        return res.status(200).json({ msg: "Face descriptors updated successfully" });
    } catch (err) {
        next(err);
    }
};





exports.traineeRegister = async (req, res, next) => {
    try {
        const { name, empId, batch, subBatch, faceDescriptors } = req.body;

        const trainee = await Trainee.findOne({ empId });
        if (trainee) {
            return res.status(400).json({ msg: "Trainee already exists" });
        }
        const encryptedDescriptors = faceDescriptors.map(desc => encryptDescriptor(desc));

        const student = new Trainee({
            name,
            empId,
            batch,
            subBatch,
            faceDescriptors: encryptedDescriptors
        });

        await student.save();
        return res.status(201).json({ msg: "Trainee registered successfully" });
    } catch (err) {
        next(err);
    }
};

exports.traineeFaceLogin = async (req, res, next) => {
    try {
        const { faceDescriptors } = req.body;
        if (
            !faceDescriptors ||
            !Array.isArray(faceDescriptors) ||
            faceDescriptors.length !== 1 ||
            !Array.isArray(faceDescriptors[0]) ||
            faceDescriptors[0].length !== 128
        ) {
            return res.status(400).json({ msg: "Invalid descriptor data" });
        }

        const descriptorToMatch = faceDescriptors[0];
        const trainees = await Trainee.find({});
        let matchedTrainee = null;
        let distance;

        for (const trainee of trainees) {
            for (const encrypted of trainee.faceDescriptors) {
                if (typeof encrypted !== "string") continue;
                let storedDescriptor;
                try {
                    storedDescriptor = decryptDescriptor(encrypted);
                    if (!Array.isArray(storedDescriptor) || storedDescriptor.length !== 128) continue;
                } catch (err) {
                    console.error("Decryption failed :- ", err.message);
                    continue;
                }
                distance = euclideanDistance(storedDescriptor, descriptorToMatch);
                if (distance < FACE_MATCH_THRESHOLD) {
                    matchedTrainee = trainee;
                    break;
                }
            }
            if (matchedTrainee) break;
        }

        if (!matchedTrainee) {
            return res.status(401).json({
                msg: "Face not recognized",
                values: { FACE_MATCH_THRESHOLD, distance }
            });
        }

        const user = {
            id: matchedTrainee._id,
            name: matchedTrainee.name,
            empId: matchedTrainee.empId,
            batch: matchedTrainee.batch,
            subBatch: matchedTrainee.subBatch,
            role: "trainee"
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

        const config = await AttendanceConfig.findOne({
            createdAt: { $lte: new Date() }
        }).sort({ createdAt: -1 });

        if (!config) {
            return res.status(500).json({ msg: "Attendance configuration not found" });
        }

        const today = moment().startOf("day").toDate();
        const existingAttendance = await Attendance.findOne({
            trainee: matchedTrainee._id,
            date: today
        });

        const now = new Date();
        const cutoffDateTime = moment(today).set({
            hour: parseInt(config.cutoffTime.split(":")[0], 10),
            minute: parseInt(config.cutoffTime.split(":")[1], 10)
        }).toDate();

        const status = now > cutoffDateTime ? "Late" : "Present";

        if (existingAttendance) {
            if (config.mode === "checkout" && !existingAttendance.checkOutTime) {
                existingAttendance.checkOutTime = now;
                await existingAttendance.save();
            }
        } else {
            const newAttendance = new Attendance({
                trainee: matchedTrainee._id,
                date: today,
                status
            });

            if (config.mode === "checkin") {
                newAttendance.checkInTime = now;
            } else {
                newAttendance.checkOutTime = now;
            }

            await newAttendance.save();
        }

        let boothAssignment = await BoothAssignment.findOne({ trainee: matchedTrainee._id });
        let boothDetails = null;

        if (!boothAssignment) {
            const totalAssignments = await BoothAssignment.countDocuments();
            const currentPart = totalAssignments < MAX_FIRST_PART_ASSIGNMENTS ? 1 : 2;

            const boothsForPart = booths.filter(b => b.part === currentPart);

            let assigned = false;

            for (const booth of boothsForPart) {
                const assignmentsForBooth = await BoothAssignment.countDocuments({ boothName: booth.name });
                if (assignmentsForBooth < booth.capacity) {
                    boothAssignment = new BoothAssignment({
                        trainee: matchedTrainee._id,
                        boothName: booth.name,
                        sessionPart: currentPart
                    });
                    await boothAssignment.save();
                    boothDetails = {
                        name: booth.name,
                        project: booth.project,
                        location: booth.location
                    };
                    assigned = true;
                    break;
                }
            }

            if (!assigned) {
                const booth8 = booths.find(b => b.name === "Booth 8");
                if (booth8) {
                    boothAssignment = new BoothAssignment({
                        trainee: matchedTrainee._id,
                        boothName: booth8.name,
                    });
                    await boothAssignment.save();
                    boothDetails = {
                        name: booth8.name,
                        project: booth8.project,
                        location: booth8.location
                    };
                }
            }
        } else {
            const booth = booths.find(b => b.name === boothAssignment.boothName);
            if (booth) {
                boothDetails = {
                    name: booth.name,
                    project: booth.project,
                    location: booth.location
                };
            }
        }

        return res.status(200).json({
            msg: `Login successful. ${config.mode === "checkin" ? "Check-in" : "Check-out"} marked.`,
            mode: config.mode,
            token,
            user,
            alreadyMarked: existingAttendance !== null,
            booth: boothDetails
        });

    } catch (err) {
        next(err);
    }
};







exports.traineeLogout = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ msg: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        addToBlacklist(token);

        return res.status(200).json({ msg: "Logout successful" });
    } catch (err) {
        next(err);
    }
};











exports.getAllUsers = async (req, res, next) => {
    try {
        const trainees = await Trainee.find({});
        const decryptedTrainees = [];

        for (const trainee of trainees) {
            const decryptedDescriptors = [];

            for (const encrypted of trainee.faceDescriptors) {
                if (typeof encrypted !== "string") continue;

                try {
                    const decrypted = decryptDescriptor(encrypted);
                    decryptedDescriptors.push(decrypted);
                } catch (err) {
                    console.error(`Failed to decrypt descriptor for ${trainee.name}:`, err.message);
                }
            }

            decryptedTrainees.push({
                id: trainee._id,
                name: trainee.name,
                empId: trainee.empId,
                batch: trainee.batch,
                subBatch: trainee.subBatch,
                faceDescriptors: decryptedDescriptors
            });
        }

        return res.status(200).json({ users: decryptedTrainees });
    } catch (err) {
        console.error("Error in getAllUsers:", err.message);
        next(err);
    }
};
