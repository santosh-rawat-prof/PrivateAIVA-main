const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const ExcelJS = require("exceljs");

const AttendanceConfig = require("../models/AttendanceConfig");
const Attendance = require("../models/Attendance");
const Admin = require("../models/Admin");
const Trainee = require("../models/Trainee");

exports.adminLogin = async (req, res, next) => {
    try {
        const { name, password } = req.body;

        const admin = await Admin.findOne({ name });
        if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const payload = {
            id: admin._id,
            name: admin.name,
            role: admin.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });

        return res.status(200).json({ msg: "Login successful", user: payload, token });
    } catch (err) {
        next(err);
    }
};

exports.configAttendance = async (req, res, next) => {
    try {
        const { mode, cutoffTime, startTime, endTime } = req.body;

        if (!["checkin", "checkout"].includes(mode)) {
            return res.status(400).json({ msg: "Invalid mode. Use 'checkin' or 'checkout'" });
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (![cutoffTime, startTime, endTime].every(t => timeRegex.test(t))) {
            return res.status(400).json({ msg: "Time format must be HH:mm" });
        }

        const todayStart = moment().startOf("day").toDate();

        // Expire existing config
        const latestConfig = await AttendanceConfig.findOne({ validTo: null }).sort({ validFrom: -1 });
        if (latestConfig) {
            latestConfig.validTo = moment(todayStart).subtract(1, "day").endOf("day").toDate();
            await latestConfig.save();
        }

        // Save new config
        const newConfig = new AttendanceConfig({
            mode,
            cutoffTime,
            startTime,
            endTime,
            validFrom: todayStart
        });

        await newConfig.save();
        return res.status(201).json({ msg: "Attendance config created", config: newConfig });

    } catch (err) {
        next(err);
    }
};

exports.getAttendanceStatusOfTrainees = async (req, res, next) => {
    try {
        const { date } = req.query;
        if (!moment(date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({ msg: "Invalid date format. Please use YYYY-MM-DD." });
        }

        const exactDate = moment(date).startOf("day").toDate();

        const attendanceConfig = await AttendanceConfig.findOne({
            validFrom: { $lte: exactDate },
            $or: [
                { validTo: null },
                { validTo: { $gte: exactDate } }
            ]
        }).sort({ validFrom: -1 });

        if (!attendanceConfig) {
            return res.status(404).json({ msg: "Attendance configuration not found for this date." });
        }

        const trainees = await Trainee.find();
        const attendanceRecords = await Attendance.find({ date: exactDate })
            .populate("trainee", "name empId");

        const attendanceMap = new Map();
        for (const record of attendanceRecords) {
            if (record.trainee) {
                attendanceMap.set(record.trainee._id.toString(), record);
            }
        }

        const attendanceStatus = trainees.map(trainee => {
            const record = attendanceMap.get(trainee._id.toString());
            return {
                traineeName: trainee.name,
                empId: trainee.empId,
                status: record ? record.status : "Absent",
                checkInTime: record?.checkInTime || null,
                checkOutTime: record?.checkOutTime || null
            };
        });

        return res.status(200).json({
            msg: "Trainee attendance status for the given date",
            attendanceStatus,
            config: attendanceConfig
        });
    } catch (err) {
        next(err);
    }
};



exports.exportAttendanceToExcel = async (req, res, next) => {
    try {
        const { date } = req.query;
        if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({ msg: "Invalid date format. Please use YYYY-MM-DD." });
        }

        const exactDate = moment(date).startOf("day").toDate();

        const trainees = await Trainee.find({});
        const attendanceRecords = await Attendance.find({ date: exactDate }).populate("trainee", "name empId");

        const attendanceMap = new Map();
        attendanceRecords.forEach(record => {
            if (record.trainee) {
                attendanceMap.set(record.trainee._id.toString(), record);
            }
        });

        const dataToExport = trainees.map(trainee => {
            const attendance = attendanceMap.get(trainee._id.toString());

            return {
                traineeName: trainee.name,
                empId: trainee.empId,
                status: attendance ? attendance.status : "Absent", // Default to "Absent" if no record
                checkInTime: attendance && attendance.checkInTime
                    ? moment(attendance.checkInTime).format("YYYY-MM-DD HH:mm:ss")
                    : null,
                checkOutTime: attendance && attendance.checkOutTime
                    ? moment(attendance.checkOutTime).format("YYYY-MM-DD HH:mm:ss")
                    : null
            };
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attendance Report");

        worksheet.columns = [
            { header: "Trainee Name", key: "traineeName", width: 30 },
            { header: "Emp ID", key: "empId", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Check-in Time", key: "checkInTime", width: 25 },
            { header: "Check-out Time", key: "checkOutTime", width: 25 }
        ];

        worksheet.addRows(dataToExport);
        res.setHeader("Content-Disposition", "attachment; filename=attendance_report.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        await workbook.xlsx.write(res);
        return res.status(200).end();

    } catch (err) {
        next(err);
    }
};




exports.getTrainees = async (req, res, next) => {
    try {
        const inputDate = req.query.date;
        const targetDate = inputDate
            ? moment(inputDate, "YYYY-MM-DD").startOf("day").toDate()
            : moment().startOf("day").toDate();

        const trainees = await Trainee.find();

        const attendanceRecords = await Attendance.find({ date: targetDate }).populate("trainee", "empId name");

        const attendanceMap = new Map();
        for (const record of attendanceRecords) {
            if (record.trainee) {
                attendanceMap.set(record.trainee._id.toString(), record);
            }
        }

        const data = trainees.map(trainee => {
            const attendance = attendanceMap.get(trainee._id.toString());
            return {
                _id: trainee._id,
                name: trainee.name,
                empId: trainee.empId,
                batch: trainee.batch,
                subBatch: trainee.subBatch,
                status: attendance ? attendance.status : "Absent",
                checkInTime: attendance?.checkInTime || null,
                checkOutTime: attendance?.checkOutTime || null
            };
        });

        return res.status(200).json({
            date: moment(targetDate).format("YYYY-MM-DD"),
            trainees: data
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteTrainee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Trainee.findByIdAndDelete(id);
        if (result) return res.json({ msg: "Trainee deleted successfully" });
        return res.status(404).json({ msg: `No Trainee found with id ${id}` });
    } catch (err) {
        next(err);
    }
}

exports.sendAnnouncement = async (req, res, next) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({ msg: "Title and message are required" });
        }

        const io = req.app.get("io");
        io.emit("announcement", { title, message, time: new Date() });

        return res.status(200).json({ msg: "Announcement sent successfully" });
    } catch (err) {
        next(err);
    }
};