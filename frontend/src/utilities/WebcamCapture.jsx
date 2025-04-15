import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const WebcamCapture = ({ onUserDetected }) => {
    const webcamRef = useRef(null);
    const resetTimeoutRef = useRef(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [facePresent, setFacePresent] = useState(false);

    // Load face-api.js models
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        };
        loadModels();
    }, []);

    // Face detection loop
    useEffect(() => {
        let timeoutId;

        const detectFaceLoop = async () => {
            const video = webcamRef.current?.video;
            if (!video || video.readyState !== 4) return;

            const detection = await faceapi
                .detectSingleFace(video)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                if (!facePresent) {
                    setFacePresent(true);
                    scanFace(detection);
                }

                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            } else {
                if (facePresent) {
                    setFacePresent(false);
                    setStatus("Face removed. Waiting...");
                    onUserDetected(null); // immediately reset
                }

                if (!timeoutId) {
                    timeoutId = setTimeout(() => {
                        setStatus("No face detected.");
                        onUserDetected(null); // after delay
                    }, 1000); // only 1 second now
                }
            }
        };

        const intervalId = setInterval(detectFaceLoop, 1000);

        return () => {
            clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [facePresent]);

    // Scan face and fetch user from backend
    const scanFace = async (detection) => {
        // Clear any existing reset timer
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }

        setLoading(true);
        setStatus("Scanning...");

        const descriptor = Array.from(detection.descriptor);

        try {
            const res = await fetch("http://172.20.202.27:5000/api/trainee/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    faceDescriptors: [Object.values(descriptor)],
                }),
            });

            const data = await res.json();

            if (res.status === 200 && data?.user?.name) {
                console.log(data);

                setStatus(`✅ Welcome, ${data.user.name}!`);
                onUserDetected({
                    name: data.user.name,
                    checkInTime: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    mode: data.mode,
                    alreadyMarked: data.alreadyMarked,
                });
            } else {
                setStatus(data.error || "❌ Face not recognized.");
                onUserDetected(null);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setStatus("⚠️ Server error.");
            onUserDetected(null);
        }

        // Set reset timer again if face is lost
        resetTimeoutRef.current = setTimeout(() => {
            setStatus("No face detected.");
            onUserDetected(null);
        }, 5000);

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-80 h-60 border-2 border-gray-300 rounded-lg overflow-hidden">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-full"
                />
            </div>

            {/* <p className="mt-2 text-sm text-gray-700">
        {loading ? "Scanning..." : status}
      </p> */}
        </div>
    );
};

export default WebcamCapture;
