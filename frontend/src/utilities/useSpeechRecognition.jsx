import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = (onCommandRecognized) => {
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Speech Recognition not supported");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true; // 💡 make it continuous for faster reactivation

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("")
                .trim()
                .toLowerCase();

            const isFinal = event.results[event.results.length - 1].isFinal;

            if (transcript && isFinal) {
                console.log("🎤 Final recognized:", transcript);

                if (
                    transcript.includes("what's the schedule") ||
                    transcript.includes("current schedule") ||
                    transcript.includes("schedule now")
                ) {
                    onCommandRecognized("schedule");
                }
            } else {
                console.log("📝 Interim:", transcript);
            }
        };

        recognition.onerror = (e) => {
            console.error("Speech error", e);
            if (e.error === "not-allowed" || e.error === "service-not-allowed") {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                console.log("Speech ended, restarting...");
                recognition.start(); // 🔁 Auto-restart
            }
        };

        recognitionRef.current = recognition;
    }, [onCommandRecognized, isListening]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return { startListening, stopListening, isListening };
};

export default useSpeechRecognition;
