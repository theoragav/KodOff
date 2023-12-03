'use client'

import  React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

export function Result(props) {
  const router = useRouter();
  const { gameResult } = props;
  const result = useRef(null);
  
  
  useEffect(() => {
    if (gameResult === "Victory!") {
      result.current.className = "Victory_Text";
    } else if (gameResult === "Defeat") {
      result.current.className = "Defeat_Text";
    } else {
      result.current.className = "Tie_Text";
    }

    setTimeout(() => {
      router.push('/');
    }, 1500);
  }, []);

  const handleClick = (e) => {
    router.push('/');
  };

  return (
    <div className="Overlay" onClick={handleClick}>
      <div ref={result}>{gameResult}</div>
    </div>
  );
};

export default Result;