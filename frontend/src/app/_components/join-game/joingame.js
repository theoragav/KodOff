'use client'

import  React, { useState, useEffect, useRef } from 'react';
import "./styles.css";

export function JoinGame(props) {
  const { joinGame } = props;
  const handleSubmit = (e) => {
    joinGame();
  };

  return (
    <div className="Option_Form d-flex flex-column justify-content-center align-items-center">
      <input type="text" placeholder="Enter Game Pin" className="Join_Input align-self-stretch" />
      <button type="submit" className="Join_Btn align-self-stretch w-100" onClick={handleSubmit}>Join Another Game</button>
    </div>
  )
}

export default JoinGame;