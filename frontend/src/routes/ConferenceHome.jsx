import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam"; // Import Webcam directly
import WebcamCapture from "../utilities/WebcamCapture";
import * as faceapi from "face-api.js"; // Import face-api here for automatic capture
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCheckCircle,
  faTimesCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../components/MovingBorder";

function ConferenceHome() {
  const webcamRegisterRef = useRef(null); // Separate ref for register webcam
  const [mode, setMode] = useState("register"); // 'register' or 'login'
  const [previewImage, setPreviewImage] = useState("");
  const [status, setStatus] = useState("");
  const [descriptor, setDescriptor] = useState([]);
  const [capturingForRegister, setCapturingForRegister] = useState(false); // To control capture once per mode activation
  const [registrationStarted, setRegistrationStarted] = useState(false); // New flag
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for T&C
  const [userData, setUserData] = useState({
    name: "",
    checkInTime: null,
    alreadyMarked: false,
    mode: "checkin",
    booth: "",
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedCurrentTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    if (!userData.name) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const message = `Welcome ${userData.name}, you are allocated to ${userData.booth.name} at ${userData.booth.location}.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.15;
    utterance.pitch = 1;
    synth.speak(utterance);
  }, [userData.name]);

  const handleUserDetected = (data) => {
    if (data) {
      console.log("Detected: ", data);
      setUserData({ ...data });
    } else {
      setUserData({
        name: "",
        checkInTime: null,
        alreadyMarked: false,
        mode: "checkin",
        booth: "",
      });
    }
  };

  const captureFaceForRegister = async () => {
    if (
      !webcamRegisterRef.current ||
      capturingForRegister ||
      registrationStarted ||
      !termsAccepted
    )
      return; // Prevent capture if not terms accepted
    const video = webcamRegisterRef.current?.video;
    if (!video) {
      setStatus("Webcam not ready.");
      return;
    }
    try {
      setStatus("Scanning face for registration...");
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection) {
        const faceDesc = Array.from(detection.descriptor);
        setDescriptor(faceDesc);
        setPreviewImage(webcamRegisterRef.current.getScreenshot());
        setStatus("Face captured successfully.");
        setCapturingForRegister(true); // Stop further automatic captures until mode changes
      } else {
        setStatus("No face detected for registration.");
      }
    } catch (error) {
      console.error("Error capturing face:", error);
      setStatus("Error capturing face.");
    }
  };

  useEffect(() => {
    let captureInterval;
    if (mode === "register" && !registrationStarted && termsAccepted) {
      // Only start interval if registration not started and terms accepted
      // Reset capturingForRegister and the preview/descriptor when switching to register mode
      setCapturingForRegister(false);
      setPreviewImage("");
      setDescriptor([]);
      // Start automatic capture attempts
      captureInterval = setInterval(captureFaceForRegister, 1500); // Attempt capture every 1.5 seconds
    }
    // Cleanup function to clear the interval
    return () => clearInterval(captureInterval);
  }, [mode, registrationStarted, termsAccepted]); // Depend on termsAccepted

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (descriptor.length === 0 || !termsAccepted) {
      return setStatus(
        `⚠️ Please ensure your face is captured ${
          !termsAccepted ? "and you have accepted the instructions" : ""
        } before registering.`
      );
    }

    setRegistrationStarted(true); // Set flag when registration starts

    const empId = new FormData(e.target).get("employee_id");

    const data = {
      empId,
      faceDescriptors: [descriptor],
    };

    try {
      const res = await fetch("http://localhost:5000/api/trainee/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setStatus(
        result.msg === "Trainee registered successfully"
          ? "Registered successfully!"
          : "" + result.error
      );
      if (result.msg === "Trainee registered successfully") {
        setPreviewImage("");
        setDescriptor([]);
        setCapturingForRegister(false);
        setRegistrationStarted(false); // Reset flag after successful registration
      } else {
        setRegistrationStarted(false); // Reset flag if registration fails
      }
    } catch (err) {
      setStatus("Server error during registration.");
      setRegistrationStarted(false); // Reset flag if there's an error
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen px-4 py-6 w-full">
      <h1 className="text-4xl font-bold text-center mb-8">IGNITE AIVA</h1>

      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-l-full cursor-pointer ${
            mode === "register" ? "bg-blue-600" : "bg-gray-700"
          } font-semibold`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
        <button
          className={`px-6 py-2 rounded-r-full cursor-pointer ${
            mode === "login" ? "bg-blue-600" : "bg-gray-700"
          } font-semibold`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          {mode === "register" ? (
            <div className="flex flex-col items-center">
              <div className="relative w-auto h-auto border-2 border-gray-300 rounded-lg overflow-hidden">
                <Webcam
                  audio={false}
                  ref={webcamRegisterRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className=""
                />
              </div>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Captured Preview"
                  className="w-24 h-24 rounded mt-2"
                />
              )}
              <p className="text-sm text-center">{status}</p>
            </div>
          ) : (
            <WebcamCapture
              mode={mode}
              onUserDetected={handleUserDetected}
              setStatus={setStatus}
            />
          )}
        </div>

        <div>
          {mode === "register" ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-300">Employee ID</span>
                <input
                  type="number"
                  name="employee_id"
                  required
                  className="w-full bg-gray-800 mt-1 px-4 py-2 rounded outline-none"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
                disabled={
                  descriptor.length === 0 ||
                  registrationStarted ||
                  !termsAccepted
                }
              >
                Register Face
              </button>
              <div className="mt-4 p-4 rounded-lg bg-gray-800 text-sm">
                <h2 className="font-semibold mb-2 text-blue-400">
                  Registration Instructions & Data Handling
                </h2>
                <ol className="list-decimal pl-5 mb-2">
                  <li>Be in a well-lit environment.</li>
                  <li>
                    Center your face in the frame. Keep your head straight.
                  </li>
                  <li>Remove hats, sunglasses, and masks.</li>
                  <li>Keep a relaxed facial expression.</li>
                  <li>Enter your Employee ID above after scanning.</li>
                </ol>
                <p className="text-gray-400 text-xs mb-2">
                  By accepting below, you consent to the collection and storage
                  of your personal information, including face data and your
                  Employee ID, for attendance tracking within the Design for
                  GenAI program. Your data will be handled according to our Data
                  Privacy Policy.
                </p>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                    />
                    <span className="ml-2 text-gray-300 text-xs">
                      I have read and agree to the instructions and consent to
                      the data handling as described.
                    </span>
                  </label>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded text-sm">
                <p className="mb-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-blue-400 mr-2"
                  />
                  Name: {userData.name || "—"}
                </p>
                <p className="mb-2">
                  <FontAwesomeIcon
                    icon={
                      userData.name
                        ? userData.alreadyMarked
                          ? faCheckCircle
                          : faClock
                        : faTimesCircle
                    }
                    className={`mr-2 ${
                      userData.name
                        ? userData.alreadyMarked
                          ? "text-green-400"
                          : "text-yellow-400"
                        : "text-red-400"
                    }`}
                  />
                  Status:{" "}
                  {userData.name
                    ? userData.alreadyMarked
                      ? "Already Marked"
                      : "Marked"
                    : "Not Recognized"}
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-yellow-400 mr-2"
                  />
                  {userData.mode === "checkin" ? "Check-in" : "Check-out"}:{" "}
                  {userData.checkInTime || "—"}
                </p>
              </div>
              <Button
                duration={3000}
                borderRadius="1.75rem"
                className="flex-1 text-gray-50 border-neutral-200 dark:border-slate-800" // Added mt-4 for spacing
              >
                <h2 className="text-xl font-bold">
                  Welcome{" "}
                  <span className="bg-gradient-to-r from-[#008FFB] to-blue-600 bg-clip-text text-transparent">
                    {userData.name || "User"},
                  </span>
                </h2>
                <h2 className="text-xl font-bold mt-3">
                  {userData.name
                    ? `${userData.name}, you are allocated to ${userData.booth.name} at ${userData.booth.location}.`
                    : "Please mark your attendance here!"}
                </h2>
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Current Time: {formattedCurrentTime}
      </p>
    </div>
  );
}

export default ConferenceHome;
