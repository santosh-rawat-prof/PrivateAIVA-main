import React from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const DownloadAttendanceReport = () => {
  const { token } = useAuth();
  const handleDownload = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!token) {
      alert("You must be logged in to download the report.");
      return;
    }
    try {
      const response = await axios.get(
        `http://172.20.202.27:5000/api/admin/exportAttendance?date=${today}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_report_${today}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download report. Make sure you are authorized.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-[#008FFB] text-white rounded cursor-pointer"
    >
      Download Today's Attendance Report
    </button>
  );
};

export default DownloadAttendanceReport;
