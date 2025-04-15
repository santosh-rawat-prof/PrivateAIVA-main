import React from "react";
import Chart from "react-apexcharts";

function LineChart({ attendanceData }) {
    // Get today's date in UTC (or local if preferred)
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "2025-04-14"

    // Grouping: e.g., every 5 minutes
    const slotIntervalMinutes = 5;
    const timeSlotMap = {};
    console.log(attendanceData);

    attendanceData.forEach(({ checkInTime }) => {
        const checkDate = new Date(checkInTime);
        const dateStr = checkDate.toISOString().split("T")[0];

        if (dateStr === todayStr) {
            const hours = checkDate.getUTCHours();
            const minutes =
                Math.floor(checkDate.getUTCMinutes() / slotIntervalMinutes) *
                slotIntervalMinutes;
            const label = `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}`;

            if (!timeSlotMap[label]) {
                timeSlotMap[label] = 0;
            }
            timeSlotMap[label]++;
        }
    });

    // Sort time slots
    const sortedSlots = Object.keys(timeSlotMap).sort();
    const values = sortedSlots.map((slot) => timeSlotMap[slot]);

    const series = [
        {
            name: "Check-ins",
            data: values,
        },
    ];

    const options = {
        chart: {
            id: "today-checkins",
            foreColor: "#ffffff",
            toolbar: { show: false },
        },
        grid: { show: false },
        tooltip: { theme: "dark" },
        xaxis: {
            categories: sortedSlots,
            title: {
                text: "Time (HH:MM)",
                style: { color: "#ffffff" },
            },
            labels: {
                rotate: -45,
                style: {
                    colors: "#ffffff",
                },
            },
        },
        yaxis: {
            title: {
                text: "No. of Check-ins",
                style: { color: "#ffffff" },
            },
            labels: {
                style: {
                    colors: "#ffffff",
                },
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: "smooth",
        },
    };

    return (
        <div className="max-w-full w-full rounded-lg shadow-sm bg-gray-900 p-4 md:p-6">
            <div className="flex justify-between">
                <div>
                    <h5 className="text-3xl font-bold text-white pb-2">
                        {values.reduce((a, b) => a + b, 0)}
                    </h5>
                    <p className="text-base font-normal text-gray-400">
                        Check-ins Today
                    </p>
                </div>
            </div>
            <Chart options={options} series={series} type="area" height={250} />
        </div>
    );
}

export default LineChart;
