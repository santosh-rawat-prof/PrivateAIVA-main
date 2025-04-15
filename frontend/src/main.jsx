import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login.jsx";
import Admin from "./routes/Admin.jsx";
import Signup from "./routes/Signup.jsx";
import TermsAndConditions from "./routes/TermsAndConditions.jsx";
import Assignments from "./routes/Assignments.jsx";
import PrivateRoutes from "./utilities/PrivateRoutes.jsx";
import PostLoginSideBar from "./components/PostLoginSideBar.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import Home from "./routes/Home.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/users" element={<Admin />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/side" element={<PostLoginSideBar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
