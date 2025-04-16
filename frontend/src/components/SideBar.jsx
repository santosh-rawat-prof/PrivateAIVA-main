import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../ui/FontAwesome";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <aside className="relative h-auto w-20 bg-gray-900 flex flex-col items-center py-4 space-y-6 text-white">
      <button className="hover:text-blue-400">
        <FontAwesomeIcon icon="bell" />
      </button>
      {/* <button className="hover:text-blue-400">
        <FontAwesomeIcon icon="columns" />
      </button> */}
      <Link to={"/dashboard"}>
        <button className="hover:text-blue-400">
          <FontAwesomeIcon icon="chart-line" />
        </button>
      </Link>
      <Link to={"/"}>
        <button className="text-blue-500">
          <FontAwesomeIcon icon="user" />
        </button>
      </Link>
      {/* <button className="hover:text-blue-400">
        <FontAwesomeIcon icon="project-diagram" />
      </button> */}
      <Link to={"/signup"}>
        <button className="hover:text-blue-400">
          <FontAwesomeIcon icon="plus" />
        </button>
      </Link>
      <button className="hover:text-blue-400">
        <FontAwesomeIcon icon="calendar-alt" />
      </button>
      <div className="mt-auto flex flex-col items-center space-y-4">
        <button className="hover:text-blue-400">
          <FontAwesomeIcon icon="cog" />
        </button>
        <button className="hover:text-blue-400">
          <FontAwesomeIcon icon="shield-alt" />
        </button>
      </div>
    </aside>
  );
}
