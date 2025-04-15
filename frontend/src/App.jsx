// import react from "react";
import "./App.css";
import SideBar from "./components/SideBar";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="flex bg-gray-800">
        <SideBar />
        <Outlet />
      </div>
    </>
  );
}

export default App;
