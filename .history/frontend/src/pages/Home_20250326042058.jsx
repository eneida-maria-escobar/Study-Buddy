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
      <h1>Study Time!</h1>
      <button
        className="home-button"
        onClick={() => navigate("/flashcards")}
      >
        Flashcards Fun!
      </button>
      <button
        className="home-button logout"
        onClick={() => navigate("/logout")}
      >
        See Ya!
      </button>
    </div>
  );
}

export default Home;