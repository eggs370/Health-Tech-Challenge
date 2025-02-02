import React, { useState, useEffect } from 'react';
import './App.css'; // Add this to link your styles (or use inline styles)
import './RhythmGame.css'; // Create a CSS file for font import

const RhythmGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Timing and note data
  const notes = [
    { time: 1, note: 'C4' },
    { time: 2, note: 'D4' },
    { time: 3, note: 'E4' },
  ];

  // Update the current time every 100ms
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now() / 1000); // Get current time in seconds
    }, 100);
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const startGame = () => {
    setIsPlaying(true);
  };

  const handleHit = () => {
    // Check if the current time is close enough to the note's time
    if (Math.abs(currentTime - notes[score].time) < 0.1) {
      setScore(score + 1); // Increase score on a successful hit
    } else {
      setIsPlaying(false); // End the game if missed
    }
  };

  return (
    <div className="game-container">
      <h1>Rhythm Game</h1>
      <p>Score: {score}</p>
      <button onClick={startGame} disabled={isPlaying}>
        {isPlaying ? 'Game in Progress' : 'Start Game'}
      </button>

      <div className="game-area">
        {/* Visual for the hit circle */}
        <div className="hit-circle" />
      </div>

      {/* Clickable area to simulate hitting a note */}
      <div className="hit-zone" onClick={handleHit}>
        Click here to hit the note at the right time!
      </div>
    </div>
  );
};

export default RhythmGame;
