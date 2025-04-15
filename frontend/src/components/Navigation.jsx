import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div className="bg-gray-800 w-full text-gray-50 flex p-4 shadow-xl sticky">
      <Link to={"/"}>
        <span className="text-purple-500 font-semibold text-2xl">Home</span>
      </Link>
      <span className="flex-1 text-center text-3xl text-purple-500 font-black tracking-tight opacity-100">
        AIVA.
      </span>
    </div>
  );
}

export default Navigation;
