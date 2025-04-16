const mongoose = require("mongoose");
const Trainee = require("./models/Trainee");
const { dataEmpIDName } = require("./dataEmpIDName");

const MONGO_URI="mongodb://0.0.0.0:27017/AIVA__CONFERENCE__DB";
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (err) {
        console.error("MongoDB error :- ", err.message);
    }
};

const importPeople = async (dataEmpIDName) => {
    const defaultBatch = "DEFAULT_BATCH";
    const defaultSubBatch = "DEFAULT_SUBBATCH";

    const trainees = dataEmpIDName?.Sheet1 || [];
    if (trainees.length === 0) {
        console.warn("No trainees found in the data.");
        return;
    }

    const promises = trainees.map(async (entry) => {
        const empId = entry["EMP ID"];
        const name = entry["EMP NAME"];

        if (!empId || !name) {
            console.warn(`Skipping invalid entry:`, entry);
            return;
        }

        const exists = await Trainee.findOne({ empId });
        if (exists) {
            console.log(`EMP ID ${empId} already exists. Skipping.`);
            return;
        }

        try {
            const trainee = new Trainee({
                name,
                empId,
                batch: defaultBatch,
                subBatch: defaultSubBatch
            });

            await trainee.save();
            console.log(`Inserted trainee: ${name} (${empId})`);
        } catch (err) {
            console.error(`Error inserting trainee ${empId}:`, err.message);
        }
    });

    await Promise.all(promises);
}

const run = async () => {
    try {
        await connectDB();
        await importPeople(dataEmpIDName);
        console.log("Import completed");
    } catch (err) {
        console.error("Error during import :- ", err.message);
    }
    finally {
        await mongoose.disconnect();
    }
};

run();