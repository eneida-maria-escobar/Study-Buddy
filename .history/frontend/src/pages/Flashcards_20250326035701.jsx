import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Flashcards.css";

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [currentFlashcard, setCurrentFlashcard] = useState({ id: null, title: "", back: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('flashcards-body');
    fetchFlashcards();
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
        console.error("Error fetching flashcards:", err);
        setError(`Failed to fetch flashcards. ${err.response?.data?.detail || err.message}`);
        setFlashcards([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFlashcard(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNew = () => {
      setCurrentFlashcard({ id: null, title: "", back: "", type: "" });
      setViewMode("create");
  };

   const handleEditClick = (card) => {
       setCurrentFlashcard({ ...card, type: card.type || 'general' });
       setViewMode("edit");
   };

   const handleCancelEdit = () => {
       setCurrentFlashcard({ id: null, title: "", back: "", type: "" });
       setViewMode("list");
       setError("");
   };

   const handleSaveFlashcard = (e) => {
       e.preventDefault();
       setError("");
       setLoading(true);

        if (!currentFlashcard.title?.trim() || !currentFlashcard.back?.trim()) {
            setError("Both Title and Back fields are required.");
            setLoading(false);
            return;
        }

       const method = currentFlashcard.id ? 'put' : 'post';
       const url = currentFlashcard.id ? `/api/note/${currentFlashcard.id}/` : '/api/note/';
       const payload = {
           title: currentFlashcard.title,
           back: currentFlashcard.back,
           type: currentFlashcard.type || 'general'
       };

       api[method](url, payload)
           .then(() => {
               fetchFlashcards();
               setViewMode("list");
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
        if (window.confirm("Are you sure you want to delete this flashcard?")) {
            setError("");
            setLoading(true);
            api.delete(`/api/note/${cardId}/`)
                .then(() => {
                    fetchFlashcards();
                    setViewMode("list");
                })
                .catch(err => {
                    console.error("Error deleting flashcard:", err);
                    setError(`Failed to delete flashcard. ${err.response?.data?.detail || err.message}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };


  const filteredFlashcards = useMemo(() => {
    if (selectedModule === "All") return flashcards;
    return flashcards.filter(card => (card.type || 'general') === selectedModule);
  }, [flashcards, selectedModule]);

  const cardModules = useMemo(() => ["All", ...new Set(flashcards.map(c => c.type || 'general'))], [flashcards]);

   const renderListView = () => (
    <div className="flashcard-list-view">
        <div className="list-controls">
             <div className="module-filter">
                <label htmlFor="moduleFilter" style={{ marginRight: '10px' }}>Module:</label>
                <select id="moduleFilter" value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                    {cardModules.map(mod => <option key={mod} value={mod}>{mod === 'general' && flashcards.some(c => !c.type || c.type === 'general') ? 'General (Default)' : mod}</option>)}
                </select>
            </div>
            <div>
                <button className="fc-button fc-button-success" onClick={handleCreateNew}> Add Flashcard </button>
                <button className="fc-button fc-button-secondary" onClick={() => navigate("/")}> Back to Home </button>
            </div>
        </div>

        {loading && <p className="loading-indicator">Loading...</p>}
        {error && !loading && <p className="error-message">{error}</p>}

        {!loading && filteredFlashcards.length > 0 ? (
            <table className="flashcard-list-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Module/Type</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredFlashcards.map((card) => (
                    <tr key={card.id}>
                        <td>{card.title}</td>
                        <td>{card.type || 'general'}</td>
                        <td className="flashcard-actions">
                             <button className="fc-button-link" onClick={() => handleEditClick(card)}>Edit</button>
                             <button className="fc-button-link" style={{ color: '#dc3545' }} onClick={() => handleDeleteClick(card.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : (
           !loading && !error && <p className="text-center mt-20">No flashcards available for this module.</p>
        )}
    </div>
  );

   const renderFormView = () => (
       <div className="flashcard-form-view">
           <h2>{viewMode === 'create' ? 'Add Flashcard' : `Change Flashcard`}</h2>
            {error && <p className="error-message">{error}</p>}
           <form onSubmit={handleSaveFlashcard}>
                <div className="form-row">
                    <label htmlFor="titleInput">Title:</label>
                    <div className="form-input-container">
                        <input type="text" className="form-input" id="titleInput" name="title" value={currentFlashcard.title} onChange={handleInputChange} required />
                    </div>
                </div>
                 <div className="form-row">
                    <label htmlFor="backInput">Back:</label>
                     <div className="form-input-container">
                        <textarea className="form-textarea" id="backInput" name="back" value={currentFlashcard.back} onChange={handleInputChange} required rows="4" />
                     </div>
                </div>
                 <div className="form-row">
                    <label htmlFor="typeInput">Type:</label>
                    <div className="form-input-container">
                        <input type="text" className="form-input" id="typeInput" name="type" value={currentFlashcard.type} onChange={handleInputChange} placeholder="Module Name (optional)" />
                    </div>
                </div>
                 <div className="form-row">
                    <label>Author:</label>
                    <div className="form-input-container" style={{ paddingTop: '10px', color: '#6c757d' }}>
                         {currentFlashcard.author || 'Auto-assigned'}
                    </div>
                 </div>

                <div className="form-footer">
                     <div className="left-actions">
                        {currentFlashcard.id && (
                             <button type="button" className="fc-button fc-button-danger" onClick={() => handleDeleteClick(currentFlashcard.id)} disabled={loading}> Delete </button>
                        )}
                     </div>
                     <div className="right-actions">
                         <button type="button" className="fc-button fc-button-secondary" onClick={handleCancelEdit} disabled={loading}> Cancel </button>
                         <button type="submit" className="fc-button fc-button-primary" disabled={loading}> Save </button>
                     </div>
                </div>
           </form>
       </div>
   );

  return (
    <div className="flashcards-page-container">
      <h1>Create, Read, Update, and Delete Flashcards</h1>

      {viewMode === 'list' ? renderListView() : renderFormView()}

    </div>
  );
}

export default Flashcards;