import SideBar from "../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "../components/Card";
import ProjectCard from "../components/ProjectCard";
import LineChart from "../ui/LineChart";
import BarChart from "../ui/BarChart";
import { useEffect, useState } from "react";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
import DownloadAttendanceReport from "../ui/DownloadUI";
import Clock from "../ui/Clock";

export default function Dashboard() {
    const [time, setTime] = useState(new Date());
    const [value, setValue] = useState(0);
    const [onTime, setOnTime] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [lateArrival, setlateArrival] = useState(0);
    // const [earlyDep, setEarlyDep] = useState(2);
    const [timeOff, setTimeOff] = useState(3);
    const [attendanceData, setAttandanceData] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getTrainees = async () => {
            const res = await fetch(
                "http://localhost:5000/api/admin/getTrainees",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res);
            const data = await res.json();
            console.log(data);
            setAttandanceData(data.trainees);
            setValue(data.trainees.length);
            let count = 0;
            let count1 = 0;
            let count2 = 0;

            for (let i = 0; i < data.trainees.length; i++) {
                if (data.trainees[i].status === "Present") {
                    count++;
                } else if (data.trainees[i].status === "Late") {
                    count1++;
                } else if (data.trainees[i].status === "Absent") {
                    count2++;
                }
            }
            setOnTime(count);
            setlateArrival(count1);
            setAbsent(count2);
        };
        getTrainees();
    }, [onTime, lateArrival, absent, token]);

    const formattedTime = time.toLocaleTimeString();
    const formattedDate = time.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const isDayTime = time.getHours() >= 6 && time.getHours() < 18;
    const icon = isDayTime ? faSun : faMoon;
    return (
        <div className="flex h-screen w-full bg-gray-950 text-white">
            <main className="flex-1 p-6 overflow-y-auto">
                <header className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-bold">Dashboard</div>
                    <div className="flex items-center space-x-4">
                        <input
                            className="bg-gray-800 px-4 py-2 rounded-md text-sm"
                            placeholder="Quick Search..."
                        />
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Admin</span>
                            {/* <img
                                className="w-8 h-8 rounded-full"
                                src="https://i.pravatar.cc/40"
                                alt="Admin Avatar"
                            /> */}
                        </div>
                    </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Clock><DownloadAttendanceReport /></Clock>

                    </div>

                    <Card
                        title="Total Users"
                        value={value}
                        subtitle="2 new users added!"
                        icon="users"
                    />
                    <Card
                        title="On Time"
                        value={onTime}
                        subtitle="-10% Less than yesterday"
                        icon="clock"
                    />
                    <Card
                        title="Absent"
                        value={absent}
                        subtitle="+3% Increase than yesterday"
                        icon="cloud"
                    />
                    <Card
                        title="Late Arrival"
                        value={lateArrival}
                        subtitle="+3% Increase than yesterday"
                        icon="search"
                    />
                    {/* <Card
                        title="Early Departures"
                        value={earlyDep}
                        subtitle="-10% Less than yesterday"
                        icon="moon"
                    /> */}
                    <Card
                        title="Time-off"
                        value={timeOff}
                        subtitle="2% Increase than yesterday"
                        icon="calendar-check"
                    />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <div className="text-sm font-semibold mb-2">
                            Attendance Comparison Chart
                        </div>
                        <div className="h-auto bg-gray-900 rounded-md flex items-center justify-center">
                            <LineChart attendanceData={attendanceData} />
                        </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <div className="text-sm font-semibold mb-2">
                            Weekly Attendance
                        </div>
                        <div className="h-auto bg-gray-900 rounded-md flex items-center justify-center">
                            <BarChart attendanceData={attendanceData} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
