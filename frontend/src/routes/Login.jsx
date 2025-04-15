import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // adjust the path as needed
import { useNavigate } from "react-router-dom";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://172.20.202.27:5000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                login(data); // update AuthContext
                navigate("/terms"); // redirect on success
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Server error");
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen w-screen items-center justify-center text-gray-600 bg-gray-950">
            <div className="relative">
                <div className="hidden sm:block h-56 w-56 text-blue-300 absolute a-z-10 -left-20 -top-20">
                    <svg
                        id="patternId"
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="a"
                                patternUnits="userSpaceOnUse"
                                width="40"
                                height="40"
                                patternTransform="scale(0.6) rotate(0)"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="none"
                                />
                                <path
                                    d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                                    stroke-width="1"
                                    stroke="none"
                                    fill="currentColor"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width="800%"
                            height="800%"
                            transform="translate(0,0)"
                            fill="url(#a)"
                        />
                    </svg>
                </div>
                <div className="hidden sm:block h-28 w-28 text-blue-300 absolute a-z-10 -right-20 -bottom-20">
                    <svg
                        id="patternId"
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="b"
                                patternUnits="userSpaceOnUse"
                                width="40"
                                height="40"
                                patternTransform="scale(0.5) rotate(0)"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="none"
                                />
                                <path
                                    d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                                    stroke-width="1"
                                    stroke="none"
                                    fill="currentColor"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width="800%"
                            height="800%"
                            transform="translate(0,0)"
                            fill="url(#b)"
                        />
                    </svg>
                </div>
                <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-700 border-1 bg-gray-900 shadow-lg px-4">
                    <div className="flex-auto p-6">
                        <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                            <a
                                href="#"
                                className="flex cursor-pointer items-center gap-2 text-blue-500 no-underline hover:text-blue-500"
                            >
                                <span className="flex-shrink-0 text-3xl font-black tracking-tight opacity-100">
                                    AIVA.
                                </span>
                            </a>
                        </div>
                        <h4 className="mb-2 font-medium text-gray-50 xl:text-xl">
                            Welcome to AIVA!
                        </h4>
                        <p className="mb-6 text-gray-50">
                            Please sign-in to access your account
                        </p>

                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="mb-2 inline-block text-xs font-medium uppercase text-gray-100"
                                >
                                    Email or Username
                                </label>
                                <input
                                    type="text"
                                    className="outline-none block w-full rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm text-gray-50 focus:border-blue-500 focus:bg-white focus:text-gray-600"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your email or username"
                                />
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <label
                                        className="mb-2 inline-block text-xs font-medium uppercase text-gray-100"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    className="outline-none block w-full rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm text-gray-50 focus:border-blue-500 focus:bg-white focus:text-gray-600"
                                    name="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="············"
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm mb-2">
                                    {error}
                                </p>
                            )}
                            <button
                                type="submit"
                                className="w-full rounded-md border border-blue-500 bg-blue-500 py-2 px-5 text-sm text-white hover:bg-blue-600"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
