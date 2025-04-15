const path = require("path");
const moment = require("moment-timezone");
const findOngoingSession = require("../utils/excelReader");

const app = require("express")();

app.get('/schedule', (req, res) => {
    const { day, time, batch } = req.query;
    console.log("Received request with:", { day, time, batch });
    const filePath = '../uploads/Batch43_Week3_Updated.xlsx'; // Replace with the actual path to your Excel file
    const todayDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD'); // Get today's date

    if (!day || !time || !batch) {
        return res.status(400).json({ error: 'Missing parameters: day, time, or batch are required.' });
    }

    // Validate day
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid day. Must be one of: ' + validDays.join(', ') });
    }

    // Validate time (basic check)
    if (!moment(time, 'hh:mm A', true).isValid()) {
        return res.status(400).json({ error: 'Invalid time format.  Use HH:MM AM/PM (e.g., 10:30 AM)' });
    }

    // Pass the 'day' from the query for filtering, and the actual 'todayDate' for moment operations
    const sessionInfo = findOngoingSession(filePath, todayDate, batch, time, day);

    if (sessionInfo.error) {
        return res.status(500).json({ error: sessionInfo.error });
    }

    res.json(sessionInfo);
});

app.listen(9000, () => (console.log("On port 9000")));