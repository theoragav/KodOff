'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loggedInUser } from "../../../api/api.mjs";
import { Profile } from "../../_components/profile/profile.js"
import "./styles.css";

const wsUrl = 'ws://localhost:4000'; 

export default function CreateGame() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const ws = useRef(null);
  const [clientId, setClientId] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    loggedInUser().then((data) => {
      if (data) setUser(data);
      else router.push('/login');
    });

    // Initialize WebSocket connection
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newWs.onmessage = (message) => {
      const response = JSON.parse(message.data);
      console.log('Received:', response);

      // connect
      if (response.method === "connect") {
        setClientId(response.clientId);
      }

      // create
      if (response.method === "create") {
        setGameId(response.game.id);
        setCreatorId(response.clientId);
        setGame(response.game);
      }

      // join
      if (response.method === "join"){
        setGame(response.game);
      }

      if (response.method === "submit"){
        setGame(response.game);
        setWinner(response.winner);
      }

      if (response.method === "nextQuestion"){
        setGame(response.game);
      }

      if (response.method === "end"){
        setGame(response.game);
        setWinner(response.winner);
      }

      // Handle timer updates
      if (response.method === "timer") {
        setTimeLeft(response.timeLeft);
      }

      // Handle error
      if (response.method === "error") {
        setErrorMessage(response.message);
        return; // Early return to prevent further processing
      }
    };

    newWs.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current = newWs;

    // Cleanup on component unmount
    return () => newWs.close();
  }, []);

  useEffect(() => {
    if (clientId) {
      console.log("Client id set successfully " + clientId);
    }
  }, [clientId]);

  useEffect(() => {
    if (creatorId) {
      console.log("Creator id set successfully " + creatorId);
    }
  }, [creatorId]);

  useEffect(() => {
    if (gameId) {
      console.log("Game id set successfully " + gameId);
    }
  }, [gameId]);

  useEffect(() => {
    if (game) {
      console.log("Game set successfully");
    }
  }, [game]);

  useEffect(() => {
    if (winner) {
      console.log("Winner set successfully");
    }
  }, [winner]);

  useEffect(() => {
    if (timeLeft !== null) {
      console.log("Timer updated: " + timeLeft + " milliseconds remaining");
    }
  }, [timeLeft]);
  

  const handleCreateGame = () => {
    const payload = {
      "method": "create",
      "clientId": clientId,
    };
    ws.current.send(JSON.stringify(payload));
  };

  const handleJoinGame = () => {
    const payload = {
      "method": "join",
      "clientId": clientId,
      "gameId": gameId,
    };
    ws.current.send(JSON.stringify(payload));
  };

  const handleSubmit = () => {
    const payload = {
        "method": "submit",
        "clientId": clientId,
        "gameId": gameId,
    };
    ws.current.send(JSON.stringify(payload));
  };

  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className='main-body'>
        <h1 className="game-title">Project Kodoff</h1>
        {errorMessage && (
        <div style={{ color: 'red' }}>
          Error: {errorMessage}
        </div>
        )}
        <button className='game-pin-btn' onClick={handleCreateGame}>New Game</button>
        <button className='game-pin-btn' onClick={handleJoinGame}>Join Game</button>
        <input className='game-pin-input' type='text' onChange={(e) => setGameId(e.target.value)} />
        <div className='game-pin-div'>
          {gameId && clientId === creatorId && (
            <div>
              <span className='game-pin-label'>Game Pin:</span> <div className='game-pin-label'>{gameId}</div>
            </div>
          )}
        </div>
        <div className='players-section'>
          {game?.clients && game.clients.length > 0 && (
            <div>
              {game?.clients.map((c) => {
                // Return the JSX element for rendering
                return (
                  <div key={c.clientId}>
                    <Profile user={c.user}></Profile>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {timeLeft !== null && (
          <div className='game-timer'>
            Time Left: {Math.floor(timeLeft / 60000)}:{(timeLeft % 60000 / 1000).toFixed(0).padStart(2, '0')}
          </div>
        )}
        {game && game.clients.some(client => client.clientId === clientId) && 
        game.clients.find(client => client.clientId === clientId)?.problem &&
        game.clients.find(client => client.clientId === clientId)?.problem?.desc && (
            <div className='current-problem'>
                <h3>Current Problem:</h3>
                <p>{game.clients.find(client => client.clientId === clientId).problem.desc}</p>
            </div>
        )}
        <button className='game-pin-btn' onClick={handleSubmit}>Submit</button>
        {game && winner && (
          <p className='game-result'>
              {winner === clientId ? "You win!" : 
              winner === "tie" ? "It's a tie!" : "You lose."}
          </p>
        )}
    </div>
      ) : ( 
        <div></div>
      )}
    </div>
  );
}