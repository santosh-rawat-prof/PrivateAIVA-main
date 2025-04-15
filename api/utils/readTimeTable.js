const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const uploadsDir = path.join(__dirname, "..", "uploads");

function getLatestFile() {
  const files = fs.readdirSync(uploadsDir);
  const sorted = files
    .map((f) => ({ name: f, time: fs.statSync(path.join(uploadsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  return sorted.length ? path.join(uploadsDir, sorted[0].name) : null;
}

function readLatestTimetable() {
  const filePath = getLatestFile();
  if (!filePath) return [];

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

module.exports = readLatestTimetable;
