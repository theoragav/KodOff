'use client'

import  React, { useState, useEffect, useRef } from 'react';
import "./styles.css";
import { loggedInUser, getMatchHistory } from "./../../../api/api.mjs";
import { useRouter } from 'next/navigation';

export function History() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [games, setGames] = useState([]);

  useEffect(() => {
    loggedInUser().then((user) => {
        if (user) {
          setUser(user);
          getMatchHistory().then((games) => {
            if (games) {
              const updatedGames = games.map(game => {
                let status = null;
                if (game.player1Score > game.player2Score) {
                  status = game.player1 === user.username ? "Victory" : "Defeat";
                } else if (game.player2Score > game.player1Score) {
                  status = game.player2 === user.username ? "Victory" : "Defeat";
                } else {
                  status = "Tie";
                }
                return { ...game, status };
              });
              setGames(updatedGames)
            }
          });
        }
        else router.push('/login');
    });
  }, []);

  const redirectHome = () => {
    router.push('/');
  };

  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className="History container-fluid mt-5">
          <div className="d-flex align-items-center mb-3">
            <button type="submit" className="Icon_Button" onClick={redirectHome}>
              <i className="bi bi-caret-left-fill Icon"></i>
            </button>
            <div className="Page_Title">Match History</div>
          </div>
          {games.map((game, index) => (
            <div key={index} className={`Game row mb-2 justify-content-center align-items-center ${
              game.status === "Victory" ? "Victory" : game.status === "Defeat" ? "Defeat" : "Tie"}`}>
              <div className="Players col d-flex align-items-center justify-content-center">
                <div className="">{game.player1}</div>
                <div className="Versus"></div>
                <div className="">{game.player2}</div>
              </div>
              <div className={`Status col d-flex justify-content-center 
                ${game.status === "Victory" ? "Victory-Text" : game.status === "Defeat" ? "Defeat-Text" : "Tie-Text"}`}>
                {game.status}</div>
              <div className="Scores col d-flex justify-content-center">
                <div className="">{game.player1Score}</div>
                <div> - </div>
                <div className="">{game.player2Score}</div>
              </div>
            </div>
          ))}
        </div> 
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default History;