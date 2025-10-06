import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const targetText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), delayBetweenTexts);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, speed, deleteSpeed, delayBetweenTexts]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Split text into lines for styling
  const renderStyledText = (text: string) => {
    if (text.includes('Your Skin\'s Overnight Miracle')) {
      const words = text.split(' ');
      return (
        <>
          <span className="text-[#803716]">Your Skin's</span>
          <br />
          <span className="text-[#b66837]">Overnight</span>
          <br />
          <span className="text-[#e58f5a]">Miracle</span>
        </>
      );
    } else if (text.includes('Glow That Lasts 7 Days')) {
      return (
        <>
          <span className="text-[#b66837]">Glow That</span>
          <br />
          <span className="text-[#e58f5a]">Lasts 7 Days</span>
        </>
      );
    } else if (text.includes('Premium Collagen Masks')) {
      return (
        <>
          <span className="text-[#803716]">Premium</span>
          <br />
          <span className="text-[#b66837]">Collagen Masks</span>
        </>
      );
    }
    
    return <span className="text-[#803716]">{text}</span>;
  };

  return (
    <div className="min-h-[200px] lg:min-h-[240px] flex items-center justify-center">
      {renderStyledText(currentText)}
      <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
        |
      </span>
    </div>
  );
};

export default TypewriterEffect;