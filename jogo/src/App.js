import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import SingleCard from './components/SingleCard';

const API_KEY = 'cxZvWv3AQ7To3fSN9y5wQDBksKkkUZsMumEMzNNef1n4GI7t9MNW1HqN';

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://api.pexels.com/v1/search?query=magic&per_page=6', {
        headers: {
          'Authorization': API_KEY
        }
      });

      const fetchedCards = response.data.photos.map((photo, index) => ({
        src: photo.src.medium,
        matched: false,
        id: index
      }));

      const shuffledCards = [...fetchedCards, ...fetchedCards]
        .sort(() => Math.random() - 0.5)
        .map(card => ({ ...card, id: Math.random() }));

      setCards(shuffledCards);
      setTurns(0);
      setChoiceOne(null);
      setChoiceTwo(null);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleChoice = (card) => {
    if (!disabled && !card.matched) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(c => {
            if (c.src === choiceOne.src) {
              return { ...c, matched: true };
            } else {
              return c;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Jogo da Memória</h1>
      <button onClick={fetchImages}>Começar</button>
      <div className="card-grid">
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled || card.matched}
          />
        ))}
      </div>
      <p>Jogadas: {turns} </p>
    </div>
  );
}

export default App;
