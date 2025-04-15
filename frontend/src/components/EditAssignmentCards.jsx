import React from "react";

function EditAssignmentCards({assignments}) {
  const handleEdit = (assignmentId) => {
    console.log("Edit assignment with ID:", assignmentId);
    // Implement edit logic here
  };

  const handleDelete = (assignmentId) => {
    console.log("Delete assignment with ID:", assignmentId);
    // Implement delete logic here
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

            <div className="mt-4 flex justify-between space-x-2">
              <button
                onClick={() => handleEdit(assignment.assignmentName)}
                className="py-2 px-4 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(assignment.assignmentName)}
                className="py-2 px-4 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default EditAssignmentCards;
