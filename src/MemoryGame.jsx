import React, { useState, useEffect } from "react";
import imagesData from "./data/images.json";
import "./index.css";


const imageMap = import.meta.glob('/src/assets/*.svg', { eager: true, query: '?url', import: 'default' });

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [disableClick, setDisableClick] = useState(false);

  useEffect(() => {

    const preparedCards = imagesData.map((item) => ({
      ...item,
      imageUrl: imageMap[item.url]  
    }));


    const shuffledCards = shuffleArray([...preparedCards, ...preparedCards]);
    setCards(shuffledCards.map((card, index) => ({ ...card, id: index })));
  }, []);

  const handleCardClick = (card) => {
    if (disableClick || flippedCards.find((c) => c.id === card.id) || matchedCards.includes(card.id)) return;

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);
    setClickCount((prev) => prev + 1);

    if (newFlipped.length === 2) {
      setDisableClick(true);
      if (newFlipped[0].imageUrl === newFlipped[1].imageUrl) {
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, newFlipped[0].id, newFlipped[1].id]);
          setFlippedCards([]);
          setDisableClick(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setDisableClick(false);
        }, 1000);
      }
    }
  };

  return (
    <div>
      <h1>Joc de Memorie</h1>
      <p>Număr de click-uri: {clickCount}</p>
      <div className="grid">
        {cards.map((card) => {
          const isFlipped = flippedCards.find((c) => c.id === card.id) || matchedCards.includes(card.id);
          const isMatched = matchedCards.includes(card.id);
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
              onClick={() => handleCardClick(card)}
            >
              <img
                src={
                  isFlipped ? card.imageUrl : "/src/assets/question.svg"
                }
                alt={card.name}
              />
            </div>
          );
        })}
      </div>
      {matchedCards.length === cards.length && <p>Uraaaa! Ai casticag ! Bravo...:\</p>}
    </div>
  );
};

export default MemoryGame;
