const { check } = require("express-validator");

exports.validateTraineeRegistration = [
    check("name")
        .trim()
        .notEmpty()
        .withMessage("name is required"),
    check("empId")
        .trim()
        .notEmpty().isNumeric()
        .withMessage("empId is required"),
    check("batch")
        .trim()
        .notEmpty()
        .withMessage("batch is required"),
    check("subBatch")
        .trim()
        .notEmpty()
        .withMessage("subBatch is required"),
    check("faceDescriptors")
        .isArray({ min: 1 })
        .withMessage("At least one face descriptor is required"),
    check("faceDescriptors.*")
        .isArray({ min: 128, max: 128 })
        .withMessage("Each face descriptor must be an array of 128 numbers")
];

exports.validateTraineeLogin = [
    check("faceDescriptors")
        .isArray({ min: 1 })
        .withMessage("At least one face descriptor is required"),
    check("faceDescriptors.*")
        .isArray({ min: 128, max: 128 })
        .withMessage("Each face descriptor must be an array of 128 numbers")
];


exports.validateAdminLogin = [
    check("name").notEmpty().withMessage("name is required"),
    check("password").notEmpty().withMessage("password is required")
    // console.log("Hit from validators");
    

];

exports.validateAttendanceConfig = [
    check("mode")
        .notEmpty().withMessage("Mode is required")
        .isIn(["checkin", "checkout"]).withMessage("Mode must be 'checkin' or 'checkout'"),

    check("cutoffTime")
        .notEmpty().withMessage("cutoffTime is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("cutoffTime must be in HH:mm format"),

    check("startTime")
        .notEmpty().withMessage("startTime is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("startTime must be in HH:mm format"),

    check("endTime")
        .notEmpty().withMessage("endTime is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("endTime must be in HH:mm format")
];

exports.validateTraineeId = [
    check('id')
        .isMongoId()
        .withMessage('Invalid id format'),
];