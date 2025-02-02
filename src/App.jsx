import React, { useState, useEffect, useCallback } from 'react';
import './RhythmGame.css';

const styles = {
  musicIcon: {
    position: 'fixed',
    top: '45px',
    right: '615px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '200px',
    height: '50px',
    backgroundColor: '#111827',
    borderRadius: '100px',
    padding: '5px',
    boxShadow: '0 0px 10px rgba(240, 200, 200, 0.1)',
  },
  musicBar: {
    width: '7px',
    backgroundColor: '#3B82F6',
    margin: '0 5px',
    transition: 'height 0.3s ease-in-out',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#111827',
    padding: '0',
    margin: '0',
    overflow: 'hidden',
  },
  score: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    fontFamily: 'Arial, comic-sans-serif',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.6)'
    
  },
  backButton: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '0.5rem 1rem',
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  gameWindow: {
    position: 'relative',
    width: '100vw',
    height: '60vh',
    backgroundColor: '#1F2937',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  target: {
    position: 'absolute',
    border: '4px solid #10B981',
    borderRadius: '50%',
    boxSizing: 'border-box',
    transition: 'box-shadow 0.3s ease-in-out',
  },
  perfectZone: {
    position: 'absolute',
    backgroundColor: '#10B981',
    borderRadius: '50%',
    opacity: 0.3,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  ball: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
  },
  button: {
    position: 'absolute',
    padding: '0.5rem 1rem',
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    top: '140px',
    left: '1321px',
  },
  greatText: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -150%)',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#10B981',
    fontFamily: '"Luckiest Guy", cursive',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    pointerEvents: 'none',
    textShadow: '0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.8)',
  },
  goodText: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -150%)',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'gray',
    fontFamily: '"Luckiest Guy", cursive',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    pointerEvents: 'none',
    textShadow: '0 0 10px rgba(128, 128, 128, 0.8), 0 0 20px rgba(128, 128, 128, 0.8)',
  },
  debris: {
    position: 'absolute',
    backgroundColor: '#3B82F6', // Dark grey color
    borderRadius: '50%',
    width: '6px', // Smaller size
    height: '5px',
    opacity: 1,
    transition: 'opacity 0.1s ease-out', // Faster fade-out
  },
  waveMenu: {
    position: 'fixed', // Changed to fixed positioning
    top: '20px',
    right: '20px',
    border: '4px solid #545FE5',
    borderRadius: '40px', // Reduced border radius
    width: '100px', // Reduced width
    height: '30px', // Reduced height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    transition: 'ease 0.2s',
    background: '#fff',
    zIndex: 1000,
  },
  waveBar: {
    listStyle: 'none',
    height: '150px', // Reduced height
    width: '2px', // Reduced width
    borderRadius: '5px',
    backgroundColor: '#545FE5',
    margin: '0 2px', // Reduced margin
    padding: 0,
  },
};
const MusicIcon = () => {
  const [barHeights, setBarHeights] = useState([10, 20, 15, 25, 18, 10, 30, 15, 20, 10]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(barHeights.map(() => Math.random() * 20 + 10));
    }, 300);

    return () => clearInterval(interval);
  }, [barHeights]);

  return (
    <div style={styles.musicIcon}>
      {barHeights.map((height, index) => (
        <div
          key={index}
          style={{
            ...styles.musicBar,
            height: `${height}px`,
          }}
        />
      ))}
    </div>
  );
};




const RhythmGame = () => {
  const [gameWindowSize, setGameWindowSize] = useState({
    width: window.innerWidth * 1,
    height: window.innerHeight * 0.6,
  });

  const GAME_WIDTH = gameWindowSize.width;
  const GAME_HEIGHT = gameWindowSize.height;
  const BALL_SIZE = 60;
  const SLOT_SIZE = 100;
  const SLOT_POSITION = GAME_WIDTH - SLOT_SIZE - 260;
  const INITIAL_BOUNCE_VELOCITY = -12.38;
  const PERFECT_HIT_RANGE = 30;
  const GRAVITY = 0.32;
  const HORIZONTAL_SPEED = 3;
  const START_HEIGHT = GAME_HEIGHT / 2 + 20;

  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [audio] = useState(new Audio('/elvis presley-cant help falling in love (slowedreverb).mp3'));
  const [lastHitTime, setLastHitTime] = useState(0);
  const [lightUp, setLightUp] = useState(false);
  const [showGreatText, setShowGreatText] = useState(false);
  const [showGoodText, setShowGoodText] = useState(false);
  const [debrisParticles, setDebrisParticles] = useState([]); // State for debris particles

  // Function to create debris particles
  const createDebris = (x, y) => {
    const particles = Array.from({ length: 5 }, () => ({
      // Fewer particles (5 instead of 10)
      id: Date.now() + Math.random(),
      x: x + Math.random() * 10 - 5, // Closer to the ball's position
      y: y + Math.random() * 5+40, // Closer to the ground
      velocity: {
        x: (Math.random() - 0.5) * 2, // Slower horizontal velocity
        y: (Math.random() - 0.5) * 2, // Slower vertical velocity
      },
      opacity: 1,
    }));
    setDebrisParticles((prev) => [...prev, ...particles]);
  };
  useEffect(() => {
    const playAudio = () => {
      audio.loop = true; // Ensure it loops
      audio.play().catch((error) => console.error('Autoplay blocked:', error));
    };

    // Attempt to autoplay on mount
    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset when component unmounts
    };
  }, []);
  useEffect(() => {
    if (gameActive) {
      audio.play().catch((error) => console.error('Autoplay failed:', error));
    } else {
      audio.pause();
    }
  }, [gameActive]);
  useEffect(() => {
  if (!gameActive) return;

  // Delay the first ball spawn by 1 second
  const firstBallTimeout = setTimeout(() => {
    spawnBall();
    // Start the regular interval after the first ball
    const intervalId = setInterval(spawnBall, 4000);
    return () => clearInterval(intervalId);
  }, 1000);

  return () => clearTimeout(firstBallTimeout);
}, [gameActive]);




  // Update debris particles
  useEffect(() => {
    if (!gameActive) return;

    const debrisInterval = setInterval(() => {
      setDebrisParticles((prev) =>
        prev
          .map((debris) => {
            const newX = debris.x + debris.velocity.x;
            const newY = debris.y + debris.velocity.y;
            const newVelocityY = debris.velocity.y + GRAVITY * 0.1;
            const newOpacity = debris.opacity - 0.05; // Faster fade-out

            return {
              ...debris,
              x: newX,
              y: newY,
              velocity: { x: debris.velocity.x, y: newVelocityY },
              opacity: newOpacity,
            };
          })
          .filter((debris) => debris.opacity > 0)
      );
    }, 16);

    return () => clearInterval(debrisInterval);
  }, [gameActive]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.code === 'Space' && gameActive) {
        const currentTime = Date.now();
        if (currentTime - lastHitTime < 200) return;
        setLastHitTime(currentTime);

        let hit = false;
        let goodHit = false;

        balls.forEach((ball) => {
          const distanceFromSlot = Math.hypot(
            ball.x - (SLOT_POSITION + SLOT_SIZE / 2),
            ball.y - ((GAME_HEIGHT - SLOT_SIZE) / 2 - 30 + SLOT_SIZE / 2)
          );

          if (distanceFromSlot < SLOT_SIZE / 2) {
            setScore((prev) => prev + 100);
            setLightUp(true);
            setShowGreatText(true);
            setTimeout(() => setLightUp(false), 300);
            setTimeout(() => setShowGreatText(false), 1000);
            hit = true;
          } else if (distanceFromSlot < SLOT_SIZE / 1.5) {
            goodHit = true;
          }
        });

        if (!hit && goodHit) {
          setShowGoodText(true);
          setTimeout(() => setShowGoodText(false), 1000);
        }
      }
    },
    [balls, gameActive, lastHitTime]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  

  useEffect(() => {
    const handleResize = () => {
      setGameWindowSize({
        width: window.innerWidth * 1,
        height: window.innerHeight * 0.6,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!gameActive) return;

    const ballInitialY = START_HEIGHT;
    const ballInitialX = -BALL_SIZE;
    const velocityX = HORIZONTAL_SPEED;
    const velocityY = 0;

    setBalls((prevBalls) => [
      ...prevBalls,
      {
        id: Date.now(),
        x: ballInitialX,
        y: ballInitialY,
        velocity: { x: velocityX, y: velocityY },
      },
    ]);
    

    const intervalId = setInterval(() => {
      setBalls((prevBalls) => [
        ...prevBalls,
        {
          id: Date.now(),
          x: ballInitialX,
          y: ballInitialY,
          velocity: { x: velocityX, y: velocityY },
        },
      ]);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const gameLoop = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls
          .map((ball) => {
            const newX = ball.x + ball.velocity.x;
            const newY = ball.y + ball.velocity.y;

            if (newX > GAME_WIDTH) {
              return null;
            }

            // Create debris when the ball bounces
            if (newY >= GAME_HEIGHT - BALL_SIZE) {
              createDebris(ball.x + BALL_SIZE / 2, GAME_HEIGHT - BALL_SIZE); // Spawn debris at ground level
            }

            return {
              ...ball,
              x: newX,
              y: Math.min(Math.max(newY, 0), GAME_HEIGHT - BALL_SIZE),
              velocity: {
                x: ball.velocity.x,
                y: newY >= GAME_HEIGHT - BALL_SIZE ? INITIAL_BOUNCE_VELOCITY : ball.velocity.y + GRAVITY,
              },
            };
          })
          .filter((ball) => ball !== null)
      );
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameActive, GAME_WIDTH, GAME_HEIGHT]);

  return (
    <div style={styles.container}>
    <div style={styles.score}>Score: {score}</div>

    <div style={styles.gameWindow}>
        <div
          style={{
            ...styles.target,
            left: SLOT_POSITION,
            top: (GAME_HEIGHT - SLOT_SIZE) / 2 - 30,
            width: SLOT_SIZE,
            height: SLOT_SIZE,
            boxShadow: lightUp ? '0 0 20px 10px rgba(16, 185, 129, 0.8)' : 'none',
          }}
        >
          <div
            style={{
              ...styles.perfectZone,
              width: PERFECT_HIT_RANGE * 2,
              height: PERFECT_HIT_RANGE * 2,
            }}
          />
        </div>

        {balls.map((ball) => (
          <div
            key={ball.id}
            style={{
              ...styles.ball,
              left: ball.x,
              top: ball.y,
              width: BALL_SIZE,
              height: BALL_SIZE,
            }}
          />
        ))}

        {/* Render debris particles */}
        {debrisParticles.map((debris) => (
          <div
            key={debris.id}
            style={{
              ...styles.debris,
              left: debris.x,
              top: debris.y,
              opacity: debris.opacity,
            }}
          />
        ))}

        <div
          style={{
            ...styles.greatText,
            top: (GAME_HEIGHT - SLOT_SIZE) / 2 - 100,
            left: SLOT_POSITION + SLOT_SIZE / 2,
            opacity: showGreatText ? 1 : 0,
            transform: showGreatText ? 'translate(-50%, -20px)' : 'translate(-50%, -50px)',
          }}
        >
          Great!
        </div>
        <div>
      <MusicIcon />
      {/* Other game elements */}
    </div>
    
        <div>
          <button
            className="back-button" // Use className instead of style
            onClick={() => {
              window.location.href = 'Menu.html';
            }}
          >
            Home
          </button>
        </div>

        <div
          style={{
            ...styles.goodText,
            top: (GAME_HEIGHT - SLOT_SIZE) / 2 - 100,
            left: SLOT_POSITION + SLOT_SIZE / 2,
            opacity: showGoodText ? 1 : 0,
            transform: showGoodText ? 'translate(-50%, -20px)' : 'translate(-50%, -50px)',
          }}
        >
          Good!
        </div>
      </div>

      <button style={styles.button} onClick={() => setGameActive(!gameActive)}>
        {gameActive ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default RhythmGame;