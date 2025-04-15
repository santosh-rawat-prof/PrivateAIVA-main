import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function Clock({ children }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString();
    const formattedDate = time.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const isDayTime = time.getHours() >= 6 && time.getHours() < 18;
    const icon = isDayTime ? faSun : faMoon;

    return (
        <div className="bg-gray-900 p-4 rounded-lg text-white text-lg">
            <div className="flex items-center gap-2">
                <FontAwesomeIcon
                    icon={icon}
                    className="text-yellow-400 text-4xl"
                />
                <span>{formattedTime}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">Realtime Insight</div>
            <div className="mt-2">Today: {formattedDate}</div>
            {children}
        </div>
    );
}
