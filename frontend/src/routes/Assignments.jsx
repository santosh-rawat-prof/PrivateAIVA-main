import React from "react";
import Navigation from "../components/Navigation";
import assignments from "../db/Assignments.json";
import Cards from "../components/Cards";

function Assignments() {
  return (
    <div className="bg-gray-800 text-gray-50 min-h-screen">
      <Navigation />
      <div className="p-4 pt-8">
        <h1 className="text-4xl font-semibold">This weeks Assignments..</h1>
        <p className="text-gray-500 font-medium text-lg mt-2">
          List of all assignments at one place
        </p>

        <hr className="bg-gray-50 mt-12 mb-12" />
        <Cards assignments={assignments} />
      </div>
    </div>
  );
}

export default Assignments;
