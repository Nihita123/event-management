import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setUserFromToken(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, setUserFromToken]);

  return <p className="text-center mt-10">Logging in with Google...</p>;
};

export default OAuthSuccess;
