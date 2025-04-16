import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
// import { useKNN } from "../contexts/KNNContext";
function Signup() {
    const webcamRef = useRef(null);
    const [descriptor, setDescriptor] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [status, setStatus] = useState("");

    // const { loadKNNModel } = useKNN(); // Access loadKNNModel from context

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models"; // Place models inside public/models
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        };
        loadModels();
    }, []);
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

        const form = new FormData(e.target);
        const data = {
            name: form.get("name"),
            empId: form.get("employee_id"),
            batch: form.get("batch"),
            subBatch: form.get("subbatch"),
            faceDescriptors: [Object.values(descriptor)],
        };
        try {
            const res = await fetch(
                "http://localhost:5000/api/trainee/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            const result = await res.json();
            console.log(result);

            if (result.msg === "Trainee registered successfully") {
                // await loadKNNModel(); // Load the KNN model after registration
                setStatus("✅ User registered successfully.");
            } else {
                setStatus("❌ " + result.error);
            }
        } catch (err) {
            console.error(err);
            setStatus("⚠️ Server error.");
        }
    };

    return (
        <div className="bg-gray-950 text-gray-600 min-h-screen w-full">
            <div className="p-10">
                <h1 className="mb-8 font-extrabold text-4xl text-white">
                    Register
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label
                                className="block font-semibold text-white mb-2"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                className="outline-none block w-full rounded-md border border-gray-400 py-2 px-3 text-sm text-gray-50 bg-gray-900"
                                id="name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Employee ID */}
                        <div className="mt-4">
                            <label
                                className="block font-semibold text-white mb-2"
                                htmlFor="employee_id"
                            >
                                Employee ID
                            </label>
                            <input
                                className="outline-none block w-full rounded-md border border-gray-400 py-2 px-3 text-sm text-gray-50 bg-gray-900"
                                id="employee_id"
                                type="number"
                                name="employee_id"
                                required
                            />
                        </div>

                        {/* Batch */}
                        <div className="mt-4">
                            <label
                                className="block font-semibold text-white mb-2"
                                htmlFor="batch"
                            >
                                Batch
                            </label>
                            <select
                                className="block w-full rounded-md border border-gray-400 py-2 px-3 text-sm text-gray-50 bg-gray-900"
                                id="batch"
                                name="batch"
                                required
                            >
                                <option value="">Select Batch</option>
                                <option value="Batch 42">Batch 42</option>
                                <option value="Batch 43">Batch 43</option>
                            </select>
                        </div>

                        {/* Sub Batch */}
                        <div className="mt-4">
                            <label
                                className="block font-semibold text-white mb-2"
                                htmlFor="subbatch"
                            >
                                Sub Batch
                            </label>
                            <select
                                className="block w-full rounded-md border border-gray-400 py-2 px-3 text-sm text-gray-50 bg-gray-900"
                                id="subbatch"
                                name="subbatch"
                                required
                            >
                                <option value="">Select Sub Batch</option>
                                {["A", "B", "C", "D"].flatMap((batch) =>
                                    [1, 2, 3, 4, 5].map((num) => (
                                        <option
                                            key={`${batch}${num}`}
                                            value={`${batch}${num}`}
                                        >
                                            {batch}
                                            {num}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Capture Button */}
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={captureFace}
                                className="text-sm text-[#008FFB] hover:underline"
                            >
                                Capture Face Descriptor
                            </button>
                            {previewImage && (
                                <div className="mt-4">
                                    <img
                                        src={previewImage}
                                        alt="Captured Face"
                                        className="w-32 h-32 rounded border mt-2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between mt-8">
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-md text-white bg-[#008FFB] hover:bg-[#0075fb] text-base font-medium"
                            >
                                Start Scanning
                            </button>
                        </div>

                        <p className="mt-4 text-sm text-white">{status}</p>
                    </form>

                    {/* Webcam & Instructions */}
                    <aside className="space-y-4">
                        <div className="bg-gray-900 p-4 rounded text-gray-50">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "user" }}
                                className="rounded w-full"
                            />
                        </div>

                        <div className="bg-gray-900 p-8 rounded text-gray-50">
                            <h2 className="font-bold text-2xl">Instructions</h2>
                            <ul className="list-disc mt-4 list-inside text-sm space-y-2">
                                <li>
                                    Ensure your face is clearly visible in the
                                    camera.
                                </li>
                                <li>
                                    Click "Capture Face Descriptor" before
                                    submitting.
                                </li>
                                <li>
                                    Do not register without capturing your face.
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default Signup;
