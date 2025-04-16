// import react from "react";
import "./App.css";
import SideBar from "./components/SideBar";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import { Outlet } from "react-router-dom";
import { loadModels } from "./utilities/loadModels";
import { useEffect, useState } from "react";

function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  useEffect(() => {
    const preload = async () => {
      await loadModels();
      setModelsLoaded(true);
    };
    preload();
  }, []);

  if (!modelsLoaded)
    return <div className="text-center flex items-center justify-center bg-gray-950 h-screen w-screen text-gray-50">🔄 Loading models...</div>;

  return (
    <>
      <div className="flex bg-gray-800">
        {/* <SideBar /> */}
        <Outlet />
      </div>
    </>
  );
}

export default App;
