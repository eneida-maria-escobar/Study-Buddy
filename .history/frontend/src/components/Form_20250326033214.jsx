import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pet, setPet] = useState("");
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

    let userData = { username, password };

    if (method === "register") {
        if (!pet) {
            setError("Please select a pet.");
            setLoading(false);
            return;
        }
        userData = { ...userData, pet };
    }


    try {
      const res = await api.post(route, userData);
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
             const messages = Object.entries(error.response.data)
                                 .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`);
             errorMessage = messages.join('\n') || `Request failed: ${error.response.status}`;

        } else if (typeof error.response.data === 'string') {
             errorMessage = error.response.data;
        }
         else {
            errorMessage = `Request failed with status ${error.response.status}. Please check details.`;
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
    <div className="form-wrapper">
        <div className="background-animals">
            <div className="animal-shape type1"></div>
            <div className="animal-shape type2"></div>
            <div className="animal-shape type3"></div>
            <div className="animal-shape type4"></div>
            <div className="animal-shape type5"></div>
            <div className="animal-shape type6"></div>
        </div>
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

        {method === "register" && (
            <select
            className="form-select"
            value={pet}
            onChange={(e) => setPet(e.target.value)}
            aria-label="Select Pet"
            required
            >
            <option value="" disabled>-- Select Pet --</option>
            <option value="Cat">Cat</option>
            <option value="Fish">Fish</option>
            <option value="Turtle">Turtle</option>
            <option value="Dog">Dog</option>
            <option value="Bunny">Bunny</option>
            <option value="Hamster">Hamster</option>
            <option value="Reptile">Reptile</option>
            </select>
        )}

        {loading && <p className="loading-indicator">Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        <button className="form-button" type="submit" disabled={loading}>
            {name}
        </button>

        {method === "login" && (
            <button
            className="form-button"
            type="button"
            onClick={() => navigate("/register")}
            disabled={loading}
            >
            Create Account
            </button>
        )}
        {method === "register" && (
            <button
            className="form-button"
            type="button"
            onClick={() => navigate("/login")}
            disabled={loading}
            >
            Back to Login
            </button>
        )}
        </form>
    </div>
  );
}

export default Form;