body.flashcards-body, html {
    height: 100%;
    margin: 0;
    background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
    background-attachment: fixed;
    font-family: 'Roboto', sans-serif;
    color: #333;
    padding-top: 20px;
    padding-bottom: 40px;
}

.flashcards-container {
    max-width: 900px;
    margin: 20px auto;
    padding: 25px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.flashcards-container h1 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
    font-weight: 600;
}

.flashcard-controls, .flashcard-view-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.flashcard-controls .btn, .flashcard-view-controls .btn {
    padding: 10px 18px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s, transform 0.1s;
    font-size: 0.95rem;
}

.flashcard-controls .btn:active, .flashcard-view-controls .btn:active {
    transform: scale(0.96);
}

.btn-back-home { background-color: #6c757d; color: white; }
.btn-back-home:hover { background-color: #5a6268; }

.btn-view-title { background-color: #007bff; color: white; }
.btn-view-title:hover { background-color: #0056b3; }

.btn-view-back { background-color: #17a2b8; color: white; }
.btn-view-back:hover { background-color: #138496; }

.btn-view-both { background-color: #28a745; color: white; }
.btn-view-both:hover { background-color: #218838; }

.btn-create { background-color: #28a745; color: white; }
.btn-create:hover { background-color: #218838; }

.flashcard-list {
    margin-bottom: 30px;
}

.flashcard-list table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

.flashcard-list th, .flashcard-list td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
}

.flashcard-list th {
    background-color: #f8f9fa;
    font-weight: 600;
}

.flashcard-list tr:nth-child(even) {
    background-color: #f2f2f2;
}

.flashcard-list tr:hover {
    background-color: #e9ecef;
}

.no-flashcards-message {
    text-align: center;
    color: #555;
    padding: 20px;
    font-style: italic;
}

.create-flashcard-form {
    background-color: #f8f9fa;
    padding: 25px;
    border-radius: 8px;
    margin-top: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.create-flashcard-form h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
    font-weight: 600;
}

.create-flashcard-form .form-group {
    margin-bottom: 15px;
}

.create-flashcard-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #495057;
}

.create-flashcard-form .form-control {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.create-flashcard-form .form-control:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.create-flashcard-form .btn-create {
    display: block;
    width: 100%;
    margin-top: 20px;
    padding: 12px 18px;
}

@media (max-width: 768px) {
    .flashcards-container {
        margin: 10px;
        padding: 15px;
    }

    .flashcard-controls, .flashcard-view-controls {
        justify-content: space-around;
    }

    .flashcard-controls .btn, .flashcard-view-controls .btn {
        padding: 8px 14px;
        font-size: 0.9rem;
    }

    .flashcard-list th, .flashcard-list td {
        padding: 8px 10px;
    }

    .create-flashcard-form {
        padding: 20px;
    }
}

.loading-indicator {
    text-align: center;
    padding: 20px;
    color: #555;
    font-style: italic;
}

.error-message {
    text-align: center;
    padding: 15px;
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-bottom: 20px;
}