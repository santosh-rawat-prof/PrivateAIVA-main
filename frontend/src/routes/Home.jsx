import React, { useEffect, useState } from "react";
import WebcamCapture from "../utilities/WebcamCapture";
import { Button } from "../components/MovingBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCheckCircle,
  faTimesCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import ZoneAllocator from "../utilities/ZoneAllocator";

function Home() {
  const [userData, setUserData] = useState({
    name: "",
    checkInTime: null,
    alreadyMarked: false,
    mode: "checkin",
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedCurrentTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 🔊 Text-to-Speech only when user is detected (non-empty name)
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    if (!userData.name) return; // Don’t speak if no name

    const synth = window.speechSynthesis;

    // Stop any ongoing speech immediately
    synth.cancel();

    const message = `Welcome ${userData.name}, to the Design for GenAI program.`;

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.15; // Fast, natural speech
      utterance.pitch = 1;
      synth.speak(utterance);
    }, 0);
  }, [userData.name]);

  const handleUserDetected = (data) => {
    if (data) {
      console.log(data);
      setUserData({
        name: data.name,
        checkInTime: data.checkInTime || new Date().toLocaleTimeString(),
        alreadyMarked: data.alreadyMarked || false,
        mode: data.mode,
      });
    } else {
      setUserData({
        name: "",
        checkInTime: null,
        alreadyMarked: false,
        mode: "checkin",
      });
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center justify-center w-full min-h-[100vh] p-10 bg-gray-950 text-white font-roboto">
        <h1 className="text-center font-bold text-2xl mb-10">
          Ask Ignite AIVA
        </h1>

        <div className="flex justify-center items-center w-full">
          <div className="relative w-1/3 flex justify-center">
            <WebcamCapture onUserDetected={handleUserDetected} />
          </div>
          {/* <ZoneAllocator /> */}
          <div className="bg-gray-900 text-slate-200 p-6 rounded-xl w-80 shadow-lg grid">
            <h2 className="text-white text-xl font-semibold mb-4">
              User Details
            </h2>

            <div className="flex items-center mb-3">
              <FontAwesomeIcon icon={faUser} className="text-[#008FFB] mr-2" />
              <span>Name: {userData.name || "—"}</span>
            </div>

            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={
                  userData.name
                    ? userData.alreadyMarked
                      ? faCheckCircle
                      : faClock
                    : faTimesCircle
                }
                className={`mr-2 ${userData.alreadyMarked
                  ? "text-green-400"
                  : userData.name
                    ? "text-yellow-400"
                    : "text-red-400"
                  }`}
              />
              <span>
                Attendance:{" "}
                {userData.name === ""
                  ? "—"
                  : userData.alreadyMarked
                    ? "Already Marked"
                    : "Marked"}
              </span>
            </div>

            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faClock}
                className="text-yellow-400 mr-2"
              />
              <span>
                {userData.mode === "checkin" ? "Check-in:" : "Check-out:"}{" "}
                {userData.checkInTime || "—"}
              </span>
            </div>

            {/* Optional: Show current time */}
            {/* <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-blue-400 mr-2" />
              <span>Current: {formattedCurrentTime}</span>
            </div> */}
          </div>
        </div>

        <Button
          duration={3000}
          borderRadius="1.75rem"
          className="flex-1 text-gray-50 border-neutral-200 dark:border-slate-800"
        >
          <h2 className="text-2xl font-bold">
            Welcome{" "}
            <span className="bg-gradient-to-r from-[#008FFB] to-blue-600 bg-clip-text text-transparent">
              {userData.name || "User"},
            </span>
          </h2>
          <h2 className="text-2xl font-bold mt-3">
            {userData.name
              ? "to the Design for GenAI program."
              : "Please mark your attendance here!"}
          </h2>
        </Button>
      </div>
    </div>
  );
}

export default Home;
