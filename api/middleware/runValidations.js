const { validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Hit from run validations");
        
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};