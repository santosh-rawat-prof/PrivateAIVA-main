import React from "react";

const Cards = ({ assignments }) => {
  const handleRedirect = (language) => {
    let url;
    switch (language) {
      case "Java":
        url = "https://www.java.com";
        break;
      case "AI/ML":
        url = "https://www.ai.ml";
        break;
      case "Python":
        url = "https://www.python.org";
        break;
      default:
        url = "https://www.nodex.com";
    }
    window.location.href = url;
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {assignments &&
        assignments.map((assignment) => (
          <div
            key={assignment.assignmentName}
            className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-700 p-6 m-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-purple-500">
                {assignment.language}
              </span>
              <span className="text-sm text-gray-100">
                Deadline: {assignment.deadline}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-50 mt-4">
              Assignment Name: {assignment.assignmentName}
            </h2>

            <p className="text-sm text-gray-100 mt-2">
              Added By: {assignment.addedBy}
            </p>

            <div className="mt-4">
              <button
                className="cursor-pointer w-full py-2 px-4 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
                onClick={() => handleRedirect(assignment.language)}
              >
                View Assignment
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Cards;
