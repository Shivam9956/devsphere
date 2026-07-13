import React, { useState, useEffect, useRef } from 'react';
import './Typewriter.css';

export default function Typewriter({ 
  words = [], 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  delayBetween = 2000 
}) {
  const [displayText, setDisplayText] = useState('');
  const wordsRef = useRef(words);

  // Keep words ref updated
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    let active = true;
    let timerId = null;
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      if (!active) return;
      const currentWords = wordsRef.current;
      if (!currentWords || currentWords.length === 0) {
        timerId = setTimeout(tick, 500);
        return;
      }

      const fullWord = currentWords[wordIndex % currentWords.length] || '';

      if (deleting) {
        if (charIndex > 0) {
          charIndex--;
          setDisplayText(fullWord.slice(0, charIndex));
          timerId = setTimeout(tick, deletingSpeed);
        } else {
          deleting = false;
          wordIndex = (wordIndex + 1) % currentWords.length;
          timerId = setTimeout(tick, typingSpeed);
        }
      } else {
        if (charIndex < fullWord.length) {
          charIndex++;
          setDisplayText(fullWord.slice(0, charIndex));
          timerId = setTimeout(tick, typingSpeed);
        } else {
          deleting = true;
          timerId = setTimeout(tick, delayBetween);
        }
      }
    }

    tick();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [typingSpeed, deletingSpeed, delayBetween]);

  return (
    <span className="typewriter-container">
      <span className="typewriter-text">{displayText}</span>
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
