import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('home-body');
    return () => {
      document.body.classList.remove('home-body');
    };
  }, []);

  return (
    <div className="home-container">
      <h1>Home</h1>
      <button
        className="home-button"
        onClick={() => navigate("/flashcards")}
      >
        Go to Flashcards
      </button>
      <button
        className="home-button logout"
        onClick={() => navigate("/logout")}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;