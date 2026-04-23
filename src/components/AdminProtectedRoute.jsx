import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Not logged in at all,  go to signin
  if (!user) return <Navigate to="/Signin" replace />;

  // Logged in but not admin,  go back to home
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminProtectedRoute;
