export default function ProjectCard({ title, progress, status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-500";
      case "Pending":
        return "bg-red-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>{title}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
