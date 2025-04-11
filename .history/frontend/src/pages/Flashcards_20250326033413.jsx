import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Flashcards.css";

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [view, setView] = useState("title");
  const [newFlashcard, setNewFlashcard] = useState({ title: "", back: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [displayedFlashcards, setDisplayedFlashcards] = useState([]);
  const [selectedModule, setSelectedModule] = useState("All");
  const [cardOrder, setCardOrder] = useState("Random");
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const cardContentRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('flashcards-body');
    return () => {
      document.body.classList.remove('flashcards-body');
    };
  }, []);

  const fetchFlashcards = () => {
    setLoading(true);
    setError("");
    api.get(`/api/note/?view=title+back`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFlashcards(data);
      })
      .catch((err) => {
        console.error("Error fetching flashcards:", err.response || err.message);
        setError(`Failed to fetch flashcards. ${err.response?.data?.detail || "Please check connection."}`);
        setFlashcards([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  useEffect(() => {
    let filtered = flashcards;
    if (selectedModule !== "All") {
      filtered = flashcards.filter(card => (card.type || 'general') === selectedModule);
    }

    let ordered = [...filtered];
    if (cardOrder === "Random") {
      ordered = shuffleArray(ordered);
    }
    setDisplayedFlashcards(ordered);
    setCurrentCardIndex(0);
    setQuestionsAnswered(0);
    setAccuracy(0);
    setIsCardAnimating(false);

  }, [flashcards, selectedModule, cardOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlashcard({ ...newFlashcard, [name]: value });
  };

  const handleCreateFlashcard = (e) => {
    e.preventDefault();
    setError("");
    if (!newFlashcard.title.trim() || !newFlashcard.back.trim()) {
      setError("Both Title and Back fields are required.");
      return;
    }
    const validFlashcard = {
      title: newFlashcard.title,
      back: newFlashcard.back,
      type: newFlashcard.type || 'general',
    };
    api.post("/api/note/", validFlashcard)
      .then(() => {
        setNewFlashcard({ title: "", back: "", type: "" });
        fetchFlashcards();
      })
      .catch((err) => {
        console.error("Error creating flashcard:", err.response || err.message);
        setError(`Failed to create flashcard. ${err.response?.data ? JSON.stringify(err.response.data) : "Try again."}`);
      });
  };

  const navigateCard = (newIndexCallback) => {
      if (isCardAnimating || displayedFlashcards.length === 0) return;

      setIsCardAnimating(true);

      setTimeout(() => {
          const nextIndex = newIndexCallback(currentCardIndex);
          setCurrentCardIndex(nextIndex);

          if (nextIndex > currentCardIndex || (currentCardIndex === displayedFlashcards.length -1 && nextIndex === 0 ) ){
               setQuestionsAnswered(prev => prev + 1);
          }

          setIsCardAnimating(false);
      }, 250);
  };


  const handlePrevious = () => {
     navigateCard(prev => (prev > 0 ? prev - 1 : displayedFlashcards.length - 1));
  };

  const handleNext = () => {
     navigateCard(prev => (prev < displayedFlashcards.length - 1 ? prev + 1 : 0));
  };


  const handleMarkHard = () => {
    const card = displayedFlashcards[currentCardIndex];
    if (!card) return;
    console.log("Marking card as hard (not implemented):", card.id);
    alert("Mark as Hard - Not fully implemented.");
  };

  const handleMarkEasy = () => {
     const card = displayedFlashcards[currentCardIndex];
     if (!card) return;
    console.log("Marking card as easy (not implemented):", card.id);
     alert("Mark as Easy - Not fully implemented.");
  };

   const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleOrderChange = (e) => {
    setCardOrder(e.target.value);
  };

  const handleReviewAll = () => alert("Review All - Not implemented.");
  const handleToggleSidebar = () => alert("Toggle Sidebar - Not implemented.");
  const handleResetProgress = () => {
    setIsCardAnimating(true);
    setTimeout(() => {
        setCurrentCardIndex(0);
        setQuestionsAnswered(0);
        setAccuracy(0);
        if (cardOrder === "Random") {
            setDisplayedFlashcards(shuffleArray([...displayedFlashcards]));
        }
        setIsCardAnimating(false);
        alert("Progress Reset (basic).");
    }, 250);
  };
  const handleExportStats = () => alert("Export Stats - Not implemented.");


  const currentCard = displayedFlashcards[currentCardIndex];
  const totalCards = displayedFlashcards.length;
  const cardModules = useMemo(() => ["All", ...new Set(flashcards.map(c => c.type || 'general'))], [flashcards]);

  const renderCurrentCardContent = () => {
    if (!currentCard) return <p className="no-flashcards-message">No card to display.</p>;

    const showTitle = view.includes('title');
    const showBack = view.includes('back');

    return (
      <div className="current-card-content">
        {showTitle && <span className="card-title">{currentCard.title}</span>}
        {showBack && <span className="card-back">{currentCard.back}</span>}
      </div>
    );
  };


  return (
    <div className="flashcards-main-card">
      <h1>Flashcards</h1>

      <div className="flashcard-top-controls">
         <select value={selectedModule} onChange={handleModuleChange}>
             {cardModules.map(mod => <option key={mod} value={mod}>{mod === 'general' && flashcards.some(c => !c.type || c.type === 'general') ? 'General (Default)' : mod}</option>)}
         </select>
         <select value={cardOrder} onChange={handleOrderChange}>
             <option value="Random">Random</option>
             <option value="Sequential">Sequential</option>
         </select>
         <button className="btn-functional btn-prev-next" onClick={handlePrevious} disabled={totalCards === 0 || isCardAnimating}>Previous</button>
         <button className="btn-functional btn-prev-next" onClick={handleNext} disabled={totalCards === 0 || isCardAnimating}>Next</button>
         <button className="btn-functional btn-mark-hard" onClick={handleMarkHard} disabled={totalCards === 0}>Mark as Hard</button>
         <button className="btn-functional btn-mark-easy" onClick={handleMarkEasy} disabled={totalCards === 0}>Mark as Easy</button>
         <button className="btn-placeholder btn-grey" onClick={handleReviewAll}>Review All</button>
         <button className="btn-placeholder btn-grey" onClick={handleToggleSidebar}>Toggle Sidebar</button>
         <button className="btn-placeholder btn-grey" onClick={handleResetProgress}>Reset Progress</button>
         <button className="btn-placeholder btn-grey" onClick={handleExportStats}>Export Stats</button>
      </div>

      <div className="flashcard-stats-bar">
          Questions Answered: {questionsAnswered} | Accuracy: {accuracy}% | Card {totalCards > 0 ? currentCardIndex + 1 : 0} of {totalCards}
      </div>

      <div className="flashcard-view-controls">
        <button className={`btn btn-view-title ${view === 'title' ? 'active' : ''}`} onClick={() => setView("title")} disabled={totalCards === 0} > View Title </button>
        <button className={`btn btn-view-back ${view === 'back' ? 'active' : ''}`} onClick={() => setView("back")} disabled={totalCards === 0} > View Back </button>
        <button className={`btn btn-view-both ${view === 'title+back' ? 'active' : ''}`} onClick={() => setView("title+back")} disabled={totalCards === 0} > View Title + Back </button>
        <button className="btn btn-back-home" onClick={() => navigate("/")}> Back to Home </button>
      </div>

      {loading && <p className="loading-indicator">Loading flashcards...</p>}
      {error && !loading && <p className="error-message">{error}</p>}

      <div className="flashcard-display-area">
         <div ref={cardContentRef} className={`card-content-wrapper ${isCardAnimating ? 'fade-out' : 'fade-in'}`}>
            {!loading && totalCards === 0 && !error && (
                <p className="no-flashcards-message">No flashcards available for this module. Create one below!</p>
            )}
            {!loading && currentCard && renderCurrentCardContent()}
         </div>
      </div>


      <div className="create-flashcard-form-area">
        <h3>Create a New Flashcard</h3>
        <form onSubmit={handleCreateFlashcard}>
          <div className="form-group">
            <label htmlFor="titleInput">Title</label>
            <input type="text" className="form-control" id="titleInput" name="title" value={newFlashcard.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="backInput">Back</label>
            <textarea className="form-control" id="backInput" name="back" value={newFlashcard.back} onChange={handleInputChange} required rows="3" />
          </div>
          <div className="form-group">
            <label htmlFor="typeInput">Type (Module)</label>
            {/* --- UPDATED PLACEHOLDER --- */}
            <input
                type="text"
                className="form-control"
                id="typeInput"
                name="type"
                value={newFlashcard.type}
                onChange={handleInputChange}
                placeholder="Module Name (optional)"
            />
          </div>
          <button type="submit" className="btn-create-card">Create Flashcard</button>
        </form>
      </div>

    </div>
  );
}

export default Flashcards;