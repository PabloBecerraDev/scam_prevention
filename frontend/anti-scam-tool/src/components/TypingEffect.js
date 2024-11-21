import React, { useState, useEffect } from "react";
import "./css/TypingEffect.css";

const TypingEffect = ({ titles, typingSpeed = 100, pauseTime = 2000, delayBeforeDelete = 1000 }) => {
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [isWaiting, setIsWaiting] = useState(false);
  
    useEffect(() => {
      let timeout;
  
      if (isTyping) {
        // Escribir el título letra por letra
        if (currentTitle.length < titles[currentIndex].length) {
          timeout = setTimeout(() => {
            setCurrentTitle((prev) => prev + titles[currentIndex][prev.length]);
          }, typingSpeed);
        } else {
          // Pausar al finalizar el título
          setIsWaiting(true);
          timeout = setTimeout(() => {
            setIsWaiting(false);
            setIsTyping(false);
          }, pauseTime);
        }
      } else if (!isTyping && !isWaiting) {
        // Borrar el título después de pausar
        if (currentTitle.length > 0) {
          timeout = setTimeout(() => {
            setCurrentTitle((prev) => prev.slice(0, -1));
          }, typingSpeed);
        } else {
          // Cambiar al siguiente título
          setIsTyping(true);
          setCurrentIndex((prev) => (prev + 1) % titles.length);
        }
      } else if (isWaiting) {
        // Esperar antes de borrar
        timeout = setTimeout(() => setIsWaiting(false), delayBeforeDelete);
      }
  
      return () => clearTimeout(timeout);
    }, [currentTitle, isTyping, isWaiting, titles, currentIndex, typingSpeed, pauseTime, delayBeforeDelete]);
  
    return <h1 className="typing-effect">{currentTitle}</h1>;
  };
  
  export default TypingEffect;