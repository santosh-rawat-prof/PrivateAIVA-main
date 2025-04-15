const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const { validateAdminLogin, validateAttendanceConfig, validateTraineeId } = require("../utils/validators");
const { runValidation } = require("../middleware/runValidations");

const { adminLogin, getTrainees, getAttendanceStatusOfTrainees, exportAttendanceToExcel, configAttendance, deleteTrainee, sendAnnouncement } = require("../controllers/adminController");

router.post("/login", validateAdminLogin, runValidation, adminLogin);
router.post("/configAttendance", auth, isAdmin, validateAttendanceConfig, runValidation, configAttendance);
router.get("/getTraineeAttendanceStatus", auth, isAdmin, getAttendanceStatusOfTrainees);
router.get("/exportAttendance", auth, isAdmin, exportAttendanceToExcel);
router.get("/getTrainees", auth, isAdmin, getTrainees);
router.delete("/deleteTrainee/:id", auth, isAdmin, validateTraineeId, runValidation, deleteTrainee);
router.post("/announcement", auth, isAdmin, sendAnnouncement);

module.exports = router;