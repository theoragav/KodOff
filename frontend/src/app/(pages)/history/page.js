'use client'

import  React, { useState, useEffect, useRef } from 'react';
import "./styles.css";
import { loggedInUser } from "../../../api/api.mjs";
import { useRouter } from 'next/navigation';

export function History() {
  const router = useRouter();
  const [user, setUser] = useState({});
  useEffect(() => {
    loggedInUser().then((data) => {
        if (data) setUser(data);
        else router.push('/login');
    });
  }, []);

  const redirectHome = () => {
    router.push('/');
  };

  const dummyGame = [
    {player1: "abc", player2: "def", player1Score: 3, player2Score: 1, status: "Victory"},
    {player1: "def", player2: "abc", player1Score: 3, player2Score: 2, status: "Defeat"},
    {player1: "def", player2: "abc", player1Score: 1, player2Score: 1, status: "Tie"}
  ];
  const [games, setGames] = useState(dummyGame);
  

  return (
    <div className="History container-fluid mt-5">
      <div className="d-flex align-items-center">
        <button type="submit" className="Icon_Button" onClick={redirectHome}>
          <i className="bi bi-house-door-fill Icon"></i>
        </button>
        <div className="Page_Title">History</div>
      </div>
      {games.map((game, index) => (
        <div key={index} className={`Game row mt-3 justify-content-center align-items-center ${
          game.status === "Victory" ? "Victory" : game.status === "Defeat" ? "Defeat" : "Tie"}`}>
          <div className="Players col d-flex align-items-center justify-content-center">
            <div className="">{game.player1}</div>
            <div className="Versus"></div>
            <div className="">{game.player2}</div>
          </div>
          <div className="Status col d-flex justify-content-center">{game.status}</div>
          <div className="Scores col d-flex justify-content-center">
            <div className="">{game.player1Score}</div>
            <div> - </div>
            <div className="">{game.player2Score}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;