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
  const [studyView, setStudyView] = useState("title");
  const [formCard, setFormCard] = useState({ id: null, title: "", back: "", type: "", author: null });
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
  const [activeMode, setActiveMode] = useState("study");
  const [manageViewMode, setManageViewMode] = useState("list");

  useEffect(() => {
    document.body.classList.add('flashcards-body');
    fetchFlashcards();
    return () => {
      document.body.classList.remove('flashcards-body');
    };
  }, []);

  const fetchFlashcards = (callback) => {
    setLoading(true);
    setError("");
    api.get(`/api/note/?view=title+back`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFlashcards(data);
        if (callback) callback();
      })
      .catch((err) => {
        console.error("Error fetching flashcards:", err);
        setError(`Failed to fetch flashcards. ${err.response?.data?.detail || err.message}`);
        setFlashcards([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
    // Only reset index if it's out of bounds for the new deck
    if(currentCardIndex >= ordered.length) {
        setCurrentCardIndex(0);
    }
    if (activeMode === 'study') {
        setQuestionsAnswered(0);
        setAccuracy(0);
    }
    setIsCardAnimating(false);

  }, [flashcards, selectedModule, cardOrder]); // Removed currentCardIndex dependency if it was there

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormCard(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNew = () => {
      setFormCard({ id: null, title: "", back: "", type: selectedModule !== 'All' ? selectedModule : "", author: null });
      setManageViewMode("form");
      setError("");
  };

   const handleEditClick = (card) => {
       setFormCard({ ...card, type: card.type || 'general' });
       setManageViewMode("form");
       setError("");
   };

   const handleCancelForm = () => {
       setFormCard({ id: null, title: "", back: "", type: "", author: null });
       setManageViewMode("list");
       setError("");
   };

   const handleSaveFlashcard = (e) => {
       e.preventDefault();
       setError("");
       setLoading(true);

        if (!formCard.title?.trim() || !formCard.back?.trim()) {
            setError("Both Title and Back fields are required.");
            setLoading(false);
            return;
        }

       const method = formCard.id ? 'put' : 'post';
       const url = formCard.id ? `/api/note/${formCard.id}/` : '/api/note/';
       const payload = {
           title: formCard.title,
           back: formCard.back,
           type: formCard.type || 'general'
       };

       api[method](url, payload)
           .then(() => {
               setManageViewMode("list"); // Set view mode first
               fetchFlashcards();       // Then fetch updated data
           })
           .catch(err => {
               console.error(`Error ${method === 'put' ? 'updating' : 'creating'} flashcard:`, err);
               setError(`Failed to save flashcard. ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
           })
           .finally(() => {
               setLoading(false);
           });
   };

    const handleDeleteClick = (cardId) => {
        if (!cardId) {
            console.error("Delete failed: Card ID is missing.");
            setError("Cannot delete card without a valid ID.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this flashcard?")) {
            console.log("Attempting to delete card with ID:", cardId); // Log the ID
            setError("");
            setLoading(true);
            api.delete(`/api/note/${cardId}/`)
                .then(() => {
                    console.log("Delete successful for ID:", cardId);
                    // Ensure list view is set BEFORE fetching may reset displayed cards
                    setManageViewMode("list");
                    // Refetch data to update the list
                    fetchFlashcards();
                })
                .catch(err => {
                    console.error("Error deleting flashcard:", err.response || err);
                    setError(`Failed to delete flashcard. Status: ${err.response?.status || 'N/A'}. ${err.response?.data?.detail || err.message}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
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
          setStudyView("title"); // Reset to title view on card change
          setIsCardAnimating(false);
      }, 300);
  };


  const handlePrevious = () => { navigateCard(prev => (prev > 0 ? prev - 1 : displayedFlashcards.length - 1)); };
  const handleNext = () => { navigateCard(prev => (prev < displayedFlashcards.length - 1 ? prev + 1 : 0)); };

  const handleMarkHard = () => { const card = displayedFlashcards[currentCardIndex]; if (!card) return; alert("Mark as Hard - Not fully implemented."); };
  const handleMarkEasy = () => { const card = displayedFlashcards[currentCardIndex]; if (!card) return; alert("Mark as Easy - Not fully implemented."); };
  const handleModuleChange = (e) => { setSelectedModule(e.target.value); };
  const handleOrderChange = (e) => { setCardOrder(e.target.value); };
  const handleReviewAll = () => alert("Review All - Not implemented.");
  const handleToggleSidebar = () => alert("Toggle Sidebar - Not implemented.");
  const handleResetProgress = () => { setIsCardAnimating(true); setTimeout(() => { setCurrentCardIndex(0); setQuestionsAnswered(0); setAccuracy(0); if (cardOrder === "Random") { setDisplayedFlashcards(shuffleArray([...displayedFlashcards])); } setStudyView('title'); setIsCardAnimating(false); alert("Progress Reset (basic)."); }, 300); };
  const handleExportStats = () => alert("Export Stats - Not implemented.");


  const currentCard = displayedFlashcards[currentCardIndex];
  const totalCards = displayedFlashcards.length;
  const cardModules = useMemo(() => ["All", ...new Set(flashcards.map(c => c.type || 'general'))], [flashcards]);

  const renderCurrentCardContent = () => {
    if (!currentCard) return <p className="no-flashcards-message">No card to display.</p>;
    const showTitle = studyView.includes('title');
    const showBack = studyView.includes('back');
    return (
      <div className="current-card-content">
        {showTitle && <span className="card-title">{currentCard.title}</span>}
        {showBack && <span className="card-back">{currentCard.back}</span>}
      </div>
    );
  };

   const renderListView = () => (
    <div className="flashcard-list-view">
        <div className="list-controls">
             <div className="module-filter">
                <label htmlFor="moduleFilterList">Module:</label>
                <select id="moduleFilterList" value={selectedModule} onChange={handleModuleChange}>
                    {cardModules.map(mod => <option key={mod} value={mod}>{mod === 'general' && flashcards.some(c => !c.type || c.type === 'general') ? 'General' : mod}</option>)}
                </select>
            </div>
            <button className="fc-button fc-button-success" onClick={handleCreateNew}> Add Flashcard </button>
        </div>

        {loading && <p className="loading-indicator">Loading...</p>}
        {error && !loading && <p className="error-message">{error}</p>}

        {!loading && displayedFlashcards.length > 0 ? (
            <table className="flashcard-list-table">
                <thead><tr><th>Title</th><th>Module/Type</th><th>Actions</th></tr></thead>
                <tbody>
                {displayedFlashcards.map((card) => (
                    <tr key={card.id}>
                        <td>{card.title}</td><td>{card.type || 'general'}</td>
                        <td className="flashcard-actions">
                             <button className="fc-button-link" onClick={() => handleEditClick(card)}>Edit</button>
                             <button className="fc-button-link danger" onClick={() => handleDeleteClick(card.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : ( !loading && !error && <p className="text-center mt-20 no-flashcards-message">No flashcards available for this module.</p> )}
    </div>
  );

   const renderFormView = () => (
       <div className="flashcard-form-view">
           <h2>{formCard.id ? 'Change Flashcard' : 'Add Flashcard'}</h2>
            {error && <p className="error-message">{error}</p>}
           <form onSubmit={handleSaveFlashcard}>
                <div className="form-row">
                    <label htmlFor="formTitleInput">Title:</label>
                    <div className="form-input-container">
                        <input type="text" className="form-input" id="formTitleInput" name="title" value={formCard.title} onChange={handleFormInputChange} required />
                    </div>
                </div>
                 <div className="form-row">
                    <label htmlFor="formBackInput">Back:</label>
                     <div className="form-input-container">
                        <textarea className="form-textarea" id="formBackInput" name="back" value={formCard.back} onChange={handleFormInputChange} required rows="4" />
                     </div>
                </div>
                 <div className="form-row">
                    <label htmlFor="formTypeInput">Type:</label>
                    <div className="form-input-container">
                        <input type="text" className="form-input" id="formTypeInput" name="type" value={formCard.type} onChange={handleFormInputChange} placeholder="Module Name (optional)" />
                    </div>
                 </div>
                 {formCard.id && formCard.author && (
                    <div className="form-row">
                        <label>Author:</label>
                        <div className="form-input-container" style={{ paddingTop: '10px', color: '#6c757d' }}>
                             {formCard.author}
                        </div>
                    </div>
                 )}

                <div className="form-footer">
                     <div className="left-actions">
                        {formCard.id && (
                             <button type="button" className="fc-button fc-button-danger" onClick={() => handleDeleteClick(formCard.id)} disabled={loading}> Delete </button>
                        )}
                     </div>
                     <div className="right-actions">
                         <button type="button" className="fc-button fc-button-secondary" onClick={handleCancelForm} disabled={loading}> Cancel </button>
                         <button type="submit" className="fc-button fc-button-primary" disabled={loading}> Save </button>
                     </div>
                </div>
           </form>
       </div>
   );

    const renderStudyMode = () => (
        <div className="flashcard-study-mode">
             <div className="flashcard-top-controls">
                <select value={selectedModule} onChange={handleModuleChange}>
                    {cardModules.map(mod => <option key={mod} value={mod}>{mod === 'general' && flashcards.some(c => !c.type || c.type === 'general') ? 'General' : mod}</option>)}
                </select>
                <select value={cardOrder} onChange={handleOrderChange}>
                    <option value="Random">Random</option>
                    <option value="Sequential">Sequential</option>
                </select>
                <button className="fc-button fc-button-prev-next" onClick={handlePrevious} disabled={totalCards === 0 || isCardAnimating}>Previous</button>
                <button className="fc-button fc-button-prev-next" onClick={handleNext} disabled={totalCards === 0 || isCardAnimating}>Next</button>
                <button className="fc-button fc-button-mark-hard" onClick={handleMarkHard} disabled={totalCards === 0}>Mark Hard</button>
                <button className="fc-button fc-button-mark-easy" onClick={handleMarkEasy} disabled={totalCards === 0}>Mark Easy</button>
                <button className="fc-button fc-button-grey" onClick={handleReviewAll}>Review All</button>
                <button className="fc-button fc-button-grey" onClick={handleResetProgress}>Reset</button>
            </div>

            <div className="flashcard-stats-bar">
                Answered: {questionsAnswered} | Card {totalCards > 0 ? currentCardIndex + 1 : 0} of {totalCards}
            </div>

             {loading && <p className="loading-indicator">Loading...</p>}
             {error && !loading && <p className="error-message">{error}</p>}

            <div className="flashcard-display-area">
                <div className={`card-content-wrapper ${isCardAnimating ? 'fade-out' : 'fade-in'}`}>
                    {!loading && totalCards === 0 && !error && (
                        <p className="no-flashcards-message">Select a module with cards or add some!</p>
                    )}
                    {!loading && currentCard && renderCurrentCardContent()}
                </div>
            </div>

            <div className="flashcard-view-controls">
                <button className={`fc-button fc-button-primary ${studyView === 'title' ? 'active' : ''}`} onClick={() => setStudyView("title")} disabled={totalCards === 0} > View Title </button>
                <button className={`fc-button fc-button-success ${studyView === 'back' ? 'active' : ''}`} onClick={() => setStudyView("back")} disabled={totalCards === 0} > View Back </button>
                <button className={`fc-button fc-button-info ${studyView === 'title+back' ? 'active' : ''}`} style={{backgroundColor: '#17a2b8'}} onClick={() => setStudyView("title+back")} disabled={totalCards === 0} > View Both </button>
            </div>
        </div>
    );

    const renderManageMode = () => (
        <div className="flashcard-manage-mode">
            {manageViewMode === 'list' ? renderListView() : renderFormView()}
        </div>
    );

  return (
    <div className="flashcards-page-container">
        <div className="page-header">
            <h1>Flashcards</h1>
            <div className="view-mode-toggle">
                 <button className={`fc-button ${activeMode === 'study' ? 'fc-button-primary active' : 'fc-button-secondary'}`} onClick={() => setActiveMode('study')}> Study Mode </button>
                 <button className={`fc-button ${activeMode === 'manage' ? 'fc-button-primary active' : 'fc-button-secondary'}`} onClick={() => { setActiveMode('manage'); setManageViewMode('list'); }}> Manage Cards </button>
                 <button className="fc-button fc-button-secondary" onClick={() => navigate("/")}> Home </button>
            </div>
        </div>

        <div className={`content-section ${activeMode === 'study' ? '' : 'hidden'}`}>
            {renderStudyMode()}
        </div>
         <div className={`content-section ${activeMode === 'manage' ? '' : 'hidden'}`}>
             {renderManageMode()}
        </div>

    </div>
  );
}

export default Flashcards;