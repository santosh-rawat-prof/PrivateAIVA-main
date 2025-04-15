// import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoutes = () => {
  let {loggedIn} = useAuth();
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
