import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import WebcamCapture from "../utilities/WebcamCapture";
import { Button } from "../components/MovingBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCheckCircle, faTimesCircle, faClock } from "@fortawesome/free-solid-svg-icons";

function ConferenceHome() {
    const webcamRef = useRef(null);
    const [descriptor, setDescriptor] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [status, setStatus] = useState("");
    const [userData, setUserData] = useState({
        name: "",
        checkInTime: null,
        alreadyMarked: false,
        mode: "checkin",
    });

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (!("speechSynthesis" in window) || !userData.name) return;

        const synth = window.speechSynthesis;
        synth.cancel();

        const message = `Welcome ${userData.name}, to the Design for GenAI program.`;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.15;
        utterance.pitch = 1;
        synth.speak(utterance);
    }, [userData.name]);

    const captureFace = async () => {
        setStatus("Scanning face...");
        const video = webcamRef.current?.video;
        if (!video) {
            setStatus("Webcam not ready.");
            return;
        }

        const detection = await faceapi
            .detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            setStatus("❌ No face detected. Please try again.");
            return;
        }

        const faceDesc = Array.from(detection.descriptor);
        setDescriptor(faceDesc);
        setPreviewImage(webcamRef.current.getScreenshot());
        setStatus("✅ Face captured successfully.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (descriptor.length === 0) {
            setStatus("⚠️ Please capture your face before submitting.");
            return;
        }

        const empId = new FormData(e.target).get("employee_id");
        const data = {
            empId,
            name: "Naveen",
            batch: "B1",
            subBatch: "SB1",
            faceDescriptors: [Object.values(descriptor)],
        };

        try {
            const res = await fetch("http://localhost:5000/api/trainee/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.msg === "Trainee registered successfully") {
                setStatus("✅ User registered successfully.");
            } else {
                setStatus("❌ " + result.error);
            }
        } catch (err) {
            console.error(err);
            setStatus("⚠️ Server error.");
        }
    };

    const handleUserDetected = (data) => {
        if (data) {
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
        <div className="bg-gray-950 text-white w-full min-h-screen overflow-auto p-6">
            <h1 className="text-4xl font-extrabold mb-10 text-center">IGNITE AIVA</h1>

            <div className="flex flex-col lg:flex-row gap-10 w-full">
                {/* Registration */}
                <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Face Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Employee ID</label>
                            <input
                                type="number"
                                name="employee_id"
                                required
                                className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 outline-none"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={captureFace}
                            className="text-md bg-[#008FFB] font-bold text-gray-50 p-3 rounded-md block"
                        >
                            Capture Face Descriptor
                        </button>

                        {previewImage && (
                            <div className="mt-4">
                                <img src={previewImage} alt="Captured Face" className="w-32 h-32 rounded border" />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="mt-6 bg-[#008FFB] hover:bg-[#0075fb] px-6 py-2 rounded-md text-white font-semibold"
                        >
                            Register Face
                        </button>

                        <p className="mt-4 text-sm">{status}</p>
                    </form>

                    <div className="mt-6">
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            className="rounded-md"
                        />
                        <div className="text-sm mt-2 text-gray-400">
                            Ensure your face is centered before capturing.
                        </div>
                    </div>
                </div>

                {/* Attendance */}
                <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Face Recognition / Attendance</h2>
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="w-full lg:w-1/2">
                            <WebcamCapture onUserDetected={handleUserDetected} />
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-200 w-full lg:w-1/2">
                            <h3 className="text-lg font-semibold mb-3">User Details</h3>

                            <div className="mb-2 flex items-center">
                                <FontAwesomeIcon icon={faUser} className="text-[#008FFB] mr-2" />
                                Name: {userData.name || "—"}
                            </div>

                            <div className="mb-2 flex items-center">
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
                                Attendance:{" "}
                                {userData.name
                                    ? userData.alreadyMarked
                                        ? "Already Marked"
                                        : "Marked"
                                    : "—"}
                            </div>

                            <div className="mb-2 flex items-center">
                                <FontAwesomeIcon icon={faClock} className="text-yellow-400 mr-2" />
                                {userData.mode === "checkin" ? "Check-in" : "Check-out"} Time:{" "}
                                {userData.checkInTime || "—"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            duration={3000}
                            borderRadius="1.75rem"
                            className="w-full text-center text-white"
                        >
                            <h2 className="text-2xl font-bold">
                                Welcome{" "}
                                <span className="bg-gradient-to-r from-[#008FFB] to-blue-600 bg-clip-text text-transparent">
                                    {userData.name || "User"}{","}
                                </span>
                            </h2>
                            <h2 className="text-xl mt-2">
                                {userData.name
                                    ? "to the Design for GenAI program."
                                    : "Please scan your face."}
                            </h2>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConferenceHome;
