body.home-body, html {
  height: 100%;
  margin: 0;
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  background-attachment: fixed;
  font-family: 'Roboto', sans-serif;
}

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 40px 20px;
  color: white;
  box-sizing: border-box;
}

.home-container h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
}

.home-button {
  padding: 15px 30px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  text-decoration: none;
  margin-top: 20px;
  min-width: 200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.home-button:hover {
  background-color: #218838;
}

.home-button:active {
  transform: scale(0.97);
}

.home-button.logout {
  background-color: #dc3545;
}

.home-button.logout:hover {
  background-color: #c82333;
}