'use client'
import React, { useEffect, useRef, useState } from 'react';

const wsUrl = 'ws://localhost:4000'; // Replace with your WebSocket server's address

export default function Home() {
  const ws = useRef(null);
  const [clientId, setClientId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
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
      }

      // join
      if (response.method === "join"){
        setGame(response.game);
      }

      // Here you can handle the WebSocket messages
      // For example, you can update the state if you keep track of game status or messages
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
    if (gameId) {
      console.log("Game id set successfully " + gameId);
    }
  }, [gameId]);

  useEffect(() => {
    if (game) {
      console.log("Game set successfully");
    }
  }, [game]);

  // Function to send messages to the WebSocket server
  const sendMessageToServer = (messageObject) => {
    console.log(ws.current && ws.current.readyState === WebSocket.OPEN);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(messageObject));
        console.log(messageObject);
    }
  };

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

  // Rest of your component's logic and state

  return (
    <div className='main-body'>
        <h1>Coding Game</h1>
        <button onClick={handleCreateGame}>New Game</button>
        <button onClick={handleJoinGame}>Join Game</button>
        <input type='text' onChange={(e) => setGameId(e.target.value)} />
        <div>
        {game?.clients.map((c) => (
          <div key={c.clientId} style={{ width: '200px'}}>
            {c.clientId}
          </div>
        ))}
        </div>
        <button onClick={() => sendMessageToServer({ action: 'start_game' })}>Start Game</button>
        <button onClick={() => sendMessageToServer({ action: 'end_game' })}>End Game</button>
    </div>
  );
}