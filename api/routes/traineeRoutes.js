const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { traineeRegister, traineeFaceLogin } = require("../controllers/traineeController");
const { validateTraineeRegistration, validateTraineeLogin } = require("../utils/validators");

const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post("/register", validateTraineeRegistration, runValidation, traineeRegister);
router.post("/login", validateTraineeLogin, runValidation, traineeFaceLogin);
// router.post("/login",  traineeFaceLogin);

module.exports = router;