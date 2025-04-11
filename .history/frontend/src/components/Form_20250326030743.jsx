import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  useEffect(() => {
    document.body.classList.add('auth-body');
    return () => {
      document.body.classList.remove('auth-body');
    };
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error.response) {
        console.error("Error Response:", error.response);
        if (typeof error.response.data === 'object' && error.response.data !== null) {
            errorMessage = Object.entries(error.response.data)
                                 .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
                                 .join('\n');
        } else if (error.response.data?.detail) {
             errorMessage = error.response.data.detail;
        }
         else {
            errorMessage = `Request failed with status ${error.response.status}. Please try again later.`;
        }

      } else if (error.request) {
        console.error("Error Request:", error.request);
        errorMessage = "No response from server. Check network or server status.";
      } else {
        console.error("Error Message:", error.message);
        errorMessage = `Error setting up request: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        aria-label="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        aria-label="Password"
      />
      {loading && <p className="loading-indicator">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <button className="form-button" type="submit" disabled={loading}>
        {name}
      </button>

      {method === "login" && (
        <button
          className="form-button secondary"
          type="button"
          onClick={() => navigate("/register")}
          disabled={loading}
        >
          Create Account
        </button>
      )}
      {method === "register" && (
        <button
          className="form-button secondary"
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Back to Login
        </button>
      )}
    </form>
  );
}

export default Form;