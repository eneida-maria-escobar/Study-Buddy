import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [pet, setPet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";
  const formTitle = method === "login" ? "Login" : "Register User";

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

    if (method === "register" && password !== passwordConfirm) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

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
        } else {
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
            <h1>{formTitle}</h1>

            {method === "register" && (
                <p className="input-hint" style={{ width: '100%', marginBottom: '15px', color: '#5a6268' }}>
                    First, enter a username and password.
                </p>
            )}

            <div className="form-field">
                <label htmlFor="usernameInput">Username:</label>
                <input
                    id="usernameInput"
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    aria-label="Username"
                />
                {method === "register" && (
                    <p className="input-hint">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</p>
                )}
            </div>

            <div className="form-field">
                 <label htmlFor="passwordInput">Password:</label>
                <input
                    id="passwordInput"
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    aria-label="Password"
                />
                 {method === "register" && (
                    <>
                        <p className="input-hint">Your password must contain at least 8 characters.</p>
                    </>
                )}
            </div>

            {method === "register" && (
                <div className="form-field">
                    <label htmlFor="passwordConfirmInput">Confirm Password:</label>
                    <input
                        id="passwordConfirmInput"
                        className="form-input"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Enter password again"
                        required
                        aria-label="Password confirmation"
                    />
                     <p className="input-hint">Enter the same password as before, for verification.</p>
                </div>
            )}

            {method === "register" && (
                <div className="form-field">
                    <label htmlFor="petSelect">Favorite Pet:</label>
                    <select
                        id="petSelect"
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
                </div>
            )}

            {loading && <p className="loading-indicator">Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="form-button-container">
                {method === "login" && (
                    <>
                        <button className="form-button" type="submit" disabled={loading}> Login </button>
                        <button className="form-button" type="button" onClick={() => navigate("/register")} disabled={loading} style={{backgroundColor: '#6c757d'}}> Register </button>
                    </>
                )}
                {method === "register" && (
                    <>
                         <button className="form-button" type="button" onClick={() => navigate("/login")} disabled={loading} style={{backgroundColor: '#6c757d'}}> Back to Login </button>
                        <button className="form-button" type="submit" disabled={loading}> Register </button>
                    </>
                )}
            </div>
        </form>
    </div>
  );
}

export default Form;