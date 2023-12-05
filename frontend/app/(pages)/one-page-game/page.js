'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loggedInUser } from "./../../../api/api.mjs";
import { JoinGame } from "./../../_components/join-game/joingame.js"
import { CreateGame } from "./../../_components/create-game/creategame"
import { Versus } from "./../../_components/versus/versus.js"
import { InGame } from "./../../_components/in-game/ingame.js"
import { Result } from "./../../_components/result-overlay/result.js"
import "./styles.css";

const wsUrl = process.env.NEXT_PUBLIC_WS; 

export default function Game() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const CreateGameForm = useRef(null);
  const Or = useRef(null);
  const JoinGameForm = useRef(null);
  const initialCode = "def kodoff():";
  const [code, setCode] = useState(initialCode);
  const [tests, setTests] = useState(null);
  const [hide, setHide] = useState(false);

  const ws = useRef(null);
  const [clientId, setClientId] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [joinId, setJoinId] = useState(null);
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loggedInUser().then((data) => {
        if (data) setUser(data);
        else router.push('/login');
    });


    // Initialize WebSocket connection
    const newWs = new WebSocket(wsUrl);

    newWs.onmessage = (message) => {
      const response = JSON.parse(message.data);

      // connect
      if (response.method === "connect") {
        setClientId(response.clientId);
        setErrorMessage(null);
      }

      // create
      if (response.method === "create") {
        setGameId(response.game.id);
        setCreatorId(response.clientId);
        setGame(response.game);
        Or.current.className = "d-none";
        setHide(true);
        setErrorMessage(null);
      }

      // join
      if (response.method === "join"){
        setGame(response.game);
        setGameId(response.game.id);
        Or.current.className = "d-none";
        CreateGameForm.current.className = "d-none";
        setErrorMessage(null);
      }

      if (response.method === "submit"){
        setGame(response.game);
        setWinner(response.winner);
        setErrorMessage(null);
      }

      if (response.method === "nextQuestion"){
        setCode(initialCode);
        setTests(null);
        setGame(response.game);
        setErrorMessage(null);
      }

      if (response.method === "end"){
        setGame(response.game);
        setWinner(response.winner);
        setErrorMessage(null);
      }

      // Handle timer updates
      if (response.method === "timer") {
        setTimeLeft(response.timeLeft);
        setErrorMessage(null);
      }

      // Handle error
      if (response.method === "error") {
        setErrorMessage(response.message);
        return; // Early return to prevent further processing
      }

      // Handle wrong answer
      if (response.method === "wrongAnswer") {
        setTests(response.message);
        setErrorMessage(null);
        return; // Early return to prevent further processing
      }
    };

    ws.current = newWs;

    // Cleanup on component unmount
    return () => newWs.close();
  }, []);

  const joinGame = () => {
    const payload = {
      "method": "join",
      "clientId": clientId,
      "gameId": joinId,
    };
    ws.current.send(JSON.stringify(payload));
  };

  const createGame = () => {
    JoinGameForm.current.className = "d-none";
    const payload = {
      "method": "create",
      "clientId": clientId,
    };
    ws.current.send(JSON.stringify(payload));
  };

  const submitProblem = (code) => {
    const payload = {
      "method": "submit",
      "clientId": clientId,
      "gameId": gameId,
      "code": code
    };
    ws.current.send(JSON.stringify(payload));
  };
  
  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className="OnePageGame d-flex flex-column mt-5 mb-4 justify-content-center">
            {errorMessage && (
              <div className="Error mb-3"><i className="bi bi-exclamation-triangle-fill Icon"></i>{errorMessage}</div>
            )}
            {game?.clients && game.clients.length === 2 ? (
              <div>
              <InGame user={user} opponent={game.clients.find(client => client.clientId !== clientId).user || {}} 
              timer={timeLeft} currentNo={game.clients.find(client => client.clientId === clientId)?.submits + 1} 
              problem={game.clients.find(client => client.clientId === clientId)?.problem?.desc} 
              code={code} setCode={setCode} submitProblem={(code)=>submitProblem(code)} tests={tests}/>
              {winner && (
                  <div>
                      {winner === user.username ? <Result gameResult={"Victory!"}/> : 
                      winner === "tie" ? <Result gameResult={"Tie"}/> : <Result gameResult={"Defeat"}/>}
                  </div>
              )}
              </div>
              
            ) : (
              <div>
                <div className="Page_Title mb-3">New Game</div>
                <div className="Forms row d-flex justify-content-between align-items-center">
                    <div className="col" ref={CreateGameForm}><CreateGame gamePin={gameId} createGame={()=>createGame()} hide={hide}/></div>
                    <div className="col-md-1 Or" ref={Or}>OR</div>
                    <div ref={JoinGameForm} className="col Option_Form d-flex flex-column justify-content-center align-items-center">
                      <input type="text" placeholder="Enter Game Pin" className="Join_Input align-self-stretch" onChange={(e) => setJoinId(e.target.value)}/>
                      <button type="submit" className="Join_Btn align-self-stretch w-100" onClick={joinGame}>Join Another Game</button>
                    </div>
                </div>
                <Versus user={user} opponent={game?.clients.find(client => client.clientId !== clientId)?.user || {}}/>
              </div>
            )}
        </div>
      ) : ( 
        <div></div>
      )}
    </div>
  );
}