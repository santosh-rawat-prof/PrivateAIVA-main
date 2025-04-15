const XLSX = require('xlsx');
const moment = require('moment-timezone');

function findOngoingSession(filePath, todayDate, batch, loginTime, requestedDay) {
    console.log("findOngoingSession called with:", { filePath, todayDate, batch, loginTime, requestedDay });
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = 'Sheet1';
        const worksheet = workbook.Sheets[sheetName];
        console.log("Worksheet:", worksheet ? "found" : "not found")
        
        if (!worksheet) {
            return { error: 'Sheet "Sheet1" not found in the Excel file.' };
        }

        const loginMoment = moment(loginTime, 'HH:mm A');
        const todayMoment = moment(todayDate);
        const dayOfWeek = requestedDay.toLowerCase();
        console.log("Parsed loginMoment:", loginMoment.format('HH:mm:ss'));
        console.log("Requested day of week:", dayOfWeek);

        const dayColumnMap = {
            monday: 'B',
            tuesday: 'C',
            wednesday: 'D',
            thursday: 'E',
            friday: 'F',
            saturday: 'G',
            sunday: 'H',
        };

        const dayColumn = dayColumnMap[dayOfWeek];
        console.log("Corresponding Excel column for activity:", dayColumn);
        const locationColumn = dayColumn ? String.fromCharCode(dayColumn.charCodeAt(0) + 1) : null;
        console.log("Corresponding Excel column for location:", locationColumn);

        if (!dayColumn || !locationColumn) {
            return { message: `No schedule columns found for ${dayOfWeek}.` };
        }

        let foundSession = null;
        let targetRow = -1;

        for (let row = 2; row <= 200; row++) { // Check up to 200 rows (adjust as needed)
            const batchCell = worksheet[`A${row}`];
            const currentBatch = batchCell && batchCell.v ? batchCell.v.toString().trim().toUpperCase() : null;
            console.log(`Checking row ${row}, Batch: ${currentBatch}`);
            if (currentBatch === batch.toString().trim().toUpperCase()) {
                targetRow = row;
                console.log(`Batch "${batch}" found in row ${targetRow}`);
                break; // Stop when the batch is found
            }
            if (row > 10 && targetRow === -1 && !currentBatch) {
                console.log("Stopping batch search after 10 empty batch rows.");
                break; // Stop if we haven't found the batch after a few empty rows
            }
            if (!worksheet[`A${row}`] && targetRow === -1 && row > 5) {
                console.log("Stopping batch search after encountering empty A column after row 5.");
                break;
            }
        }

        if (targetRow !== -1) {
            const activityColumn = dayColumnMap[dayOfWeek];
            const locationColumn = activityColumn ? String.fromCharCode(activityColumn.charCodeAt(0) + 1) : null;

            if (activityColumn && locationColumn) {
                const activityCell_batchRow = worksheet[`${activityColumn}${targetRow}`];
                const locationCell_batchRow = worksheet[`${locationColumn}${targetRow}`];
                console.log(`  Activity Cell at Batch Row (${activityColumn}${targetRow}) Value:`, activityCell_batchRow ? activityCell_batchRow.v : null);
                console.log(`  Location Cell at Batch Row (${locationColumn}${targetRow}) Value:`, locationCell_batchRow ? locationCell_batchRow.v : null);

                for (let i = 0; i < 15; i += 2) {
                    const timeSlotColumn = String.fromCharCode('B'.charCodeAt(0) + i);
                    const timeCell = worksheet[`${timeSlotColumn}1`];
                    const activityCell = worksheet[`${activityColumn}${targetRow}`];
                    const locationCell = worksheet[`${locationColumn}${targetRow}`];

                    console.log(`  Checking time slot column: ${timeSlotColumn}`);
                    console.log(`    Time Cell (${timeSlotColumn}1) Value:`, timeCell ? timeCell.v : null);
                    console.log(`    Activity Cell (${activityColumn}${targetRow}) Value:`, activityCell ? activityCell.v : null);
                    console.log(`    Location Cell (${locationColumn}${targetRow}) Value:`, locationCell ? locationCell.v : null);

                    if (timeCell && timeCell.v && activityCell && activityCell.v !== undefined && locationCell && locationCell.v !== undefined) {
                        const timeRangeRaw = timeCell.v;
                        console.log("    Raw Time Range from Excel:", timeRangeRaw);

                        const timeRange = timeRangeRaw.toString().split(' - ');
                        if (timeRange.length === 2) {
                            const startTime = moment(timeRange[0], 'h:mm A');
                            const endTime = moment(timeRange[1], 'h:mm A');
                            console.log("    Parsed startTime:", startTime.format('HH:mm:ss'));
                            console.log("    Parsed endTime:", endTime.format('HH:mm:ss'));

                            const todayMomentForComparison = moment(todayDate);
                            const todayStartTime = todayMomentForComparison.clone().set({
                                hour: startTime.hour(),
                                minute: startTime.minute(),
                                second: 0,
                                millisecond: 0,
                            });
                            const todayEndTime = todayMomentForComparison.clone().set({
                                hour: endTime.hour(),
                                minute: endTime.minute(),
                                second: 0,
                                millisecond: 0,
                            });

                            console.log("    Comparison Time:", todayStartTime.format('HH:mm:ss'), "-", todayEndTime.format('HH:mm:ss'));
                            console.log("    Login Time for Comparison:", loginMoment.format('HH:mm:ss'));
                            console.log("    Activity:", activityCell.v);
                            console.log("    Location:", locationCell.v);

                            if (loginMoment.isSameOrAfter(todayStartTime) && loginMoment.isBefore(todayEndTime)) {
                                foundSession = {
                                    status: 'ongoing',
                                    activity: activityCell.v.toString().trim(),
                                    location: locationCell.v.toString().trim(),
                                    type: locationCell.v.toString().trim() === '3233' ? 'session' : 'lab_hour',
                                    startTime: startTime.format('hh:mm A'),
                                    endTime: endTime.format('hh:mm A'),
                                };
                                console.log("    Found ongoing session:", foundSession);
                                return foundSession;
                            } else {
                                console.log("    Login time not within this slot.");
                            }
                        } else {
                            console.log("    Time range format is incorrect:", timeRangeRaw);
                        }
                    }
                }
            }
        } else {
            console.log(`Batch "${batch}" not found.`);
            return { message: `Batch "${batch}" not found.` };
        }

        if (!foundSession) {
            console.log("No ongoing session found.");
            return { message: 'No ongoing session or lab hour found for the given time and batch on the specified day.' };
        }

        return foundSession;

    } catch (error) {
        console.error('Error processing Excel file:', error);
        return { error: 'Failed to process the Excel file.' };
    }
}

module.exports = findOngoingSession;