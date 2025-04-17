import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const WebcamCapture = ({ onUserDetected }) => {
  const webcamRef = useRef(null);
  const resetTimeoutRef = useRef(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [facePresent, setFacePresent] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const missCountRef = useRef(0); // 👈 New: track how many times face wasn't found

  // Load models
  // useEffect(() => {
  //     const loadModels = async () => {
  //         const MODEL_URL = "/models";
  //         await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  //         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  //         await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  //     };
  //     loadModels();
  // }, []);

  // Face detection loop
  useEffect(() => {
    const detectFaceLoop = async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) return;

      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        missCountRef.current = 0; // Reset miss count
        if (!facePresent) {
          setFacePresent(true);
          setStatus("Face detected. Scanning...");
          scanFace(detection); // only once per session
        }
      } else {
        missCountRef.current += 1;

        if (missCountRef.current >= 0.5) {
          if (facePresent) {
            setFacePresent(false);
            setStatus("Face left. Waiting...");
            setCurrentUser(null);
            onUserDetected(null);
          }
        }
      }
    };

    const intervalId = setInterval(detectFaceLoop, 800); // smoother detection
    return () => clearInterval(intervalId);
  }, [facePresent]);

  const scanFace = async (detection) => {
    setLoading(true);
    const descriptor = Array.from(detection.descriptor);

    try {
      const res = await fetch("http://localhost:5000/api/trainee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceDescriptors: [descriptor] }),
      });

      const data = await res.json();

      console.log(data);

      if (res.status === 200 && data?.user?.name) {
        setCurrentUser(data.user.name);
        setStatus(`✅ Welcome, ${data.user.name}!`);
        onUserDetected({
          name: data.user.name,
          checkInTime: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          alreadyMarked: data.alreadyMarked,
          mode: data.mode,
          booth: data.booth,
        });
      } else {
        setStatus(data.error || "❌ Face not recognized.");
        setFacePresent(false); // allow retry
        onUserDetected(null);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Server error.");
      setFacePresent(false); // allow retry
      onUserDetected(null);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-auto h-auto border-2 border-gray-300 rounded-lg overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className=""
        />
      </div>

      {/* <p className="text-sm text-gray-500 mt-1">
                {loading ? "Scanning..." : status}
            </p> */}
    </div>
  );
};

export default WebcamCapture;
