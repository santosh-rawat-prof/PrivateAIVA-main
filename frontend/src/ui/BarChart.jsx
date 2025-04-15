import React from "react";
import Chart from "react-apexcharts";

export default function BarChart({ attendanceData }) {
  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayMap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };

  // Count check-ins per weekday
  const counts = [0, 0, 0, 0, 0];

  attendanceData.forEach(({ checkInTime }) => {
    if (checkInTime) {
      const date = new Date(checkInTime);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      if (dayMap[weekday] !== undefined) {
        counts[dayMap[weekday]]++;
      }
    }
  });

  // Convert to percentages if you want max to be 100
  const maxAttendance = Math.max(...counts, 1); // Prevent divide-by-zero
  const percentages = counts.map((c) => Math.round((c / maxAttendance) * 100));

  const currentDayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  const apexIndex =
    currentDayIndex >= 1 && currentDayIndex <= 5 ? currentDayIndex - 1 : -1;

  const barColors = categories.map((_, idx) =>
    idx === apexIndex ? "#008FFB" : "#4b5563"
  );

  const series = [
    {
      name: "Attendance",
      data: percentages,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: "#ffffff",
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val) => `${val}%`,
        style: {
          colors: "#ffffff",
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        colors: ["#ffffff"],
      },
    },
    colors: barColors,
    tooltip: {
      theme: "dark",
    },
  };

  const averageAttendance =
    Math.round(
      (percentages.reduce((acc, num) => acc + num, 0) / percentages.length) * 10
    ) / 10;

  return (
    <div className="max-w-full w-full rounded-lg shadow-sm bg-gray-900 p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="text-3xl font-bold text-white pb-2">
            {averageAttendance}%
          </h5>
          <p className="text-base font-normal text-gray-400">
            Weekly Attendance
          </p>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={250} />
    </div>
  );
}
