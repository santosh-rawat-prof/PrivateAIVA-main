import React, { useState } from "react";
import { Link } from "react-router-dom";
import Signup from "./Signup";

function TermsAndConditions() {
  const [checked, setChecked] = useState(false);
  const [disable, setDisable] = useState(true);

  const handleChange = () => {
    setChecked(!checked);
    setDisable(!disable);
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 min-h-screen">
      <div className="w-[50%] text-gray-50 bg-gray-900 rounded-lg p-4">
        <h1 className="text-3xl text-blue-600 mb-5 font-bold">Instructions</h1>

        <ol className="flex flex-col gap-5">
          <li>
            1. First read the instructions and click the check box before you
            proceed.
          </li>
          <li>
            2. Make sure you are in a well-lit environment. Avoid harsh shadows
            or bright light directly behind you.
          </li>
          <li>3. Center your face into the frame, Keep your head straight.</li>
          <li>
            4. Take off hats, sunglasses, or masks. Ensure your face is clearly
            visible.
          </li>
          <li>
            5. Keep your face relaxed, Avoid extreme expression like smiling or
            frowning.
          </li>
          <li>
            6. After clicking start scanning, enter your Name, Employee ID,
            Batch Name.
          </li>
          <li>
            7. Once everything is filled out, press Register button to complete
            your registration.
          </li>
        </ol>

        <div className="border-1 border-gray-50 p-4 rounded-lg mt-5 mb-5 font-semibold">
          By accepting these instructions, you consent to the collection and
          storage of your personal information, including face data, name, and
          other details. Additionally, you agree to our Data Privacy Policy,
          which outlines how we protect and use your data.
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="check"
            className="hidden"
            onChange={handleChange}
            checked={checked}
          />
          <label
            htmlFor="check"
            className={`flex items-center cursor-pointer text-lg ${
              checked ? "text-blue-600" : "text-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 border-2 rounded-md mr-2 flex items-center justify-center ${
                checked
                  ? "bg-blue-600 border-blue-600"
                  : "bg-gray-600 border-gray-300"
              }`}
            >
              {checked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            I have read the instructions.
          </label>
        </div>

        <Link to={"/signup"}>
          <button
            disabled={disable}
            className={`border-none outline-none bg-blue-600 p-2 rounded-md mt-4 ${
              disable ? "opacity-40" : "cursor-pointer"
            } `}
          >
            Continue to Registration Page
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TermsAndConditions;
