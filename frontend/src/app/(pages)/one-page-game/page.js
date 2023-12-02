'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loggedInUser } from "../../../api/api.mjs";
import { JoinGame } from "../../_components/join-game/joingame.js"
import { CreateGame } from "../../_components/create-game/creategame"
import { Versus } from "../../_components/versus/versus.js"
import { InGame } from "../../_components/in-game/ingame.js"
import { Result } from "../../_components/result-overlay/result.js"
import "./styles.css";

const wsUrl = 'ws://localhost:4000'; 

export default function Game() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [opponent, setOpponent] = useState({});
  // const [opponent, setOpponent] = useState({
  //   _id: '6557fefb1ed206278afed4aa',
  //   username: 'abcde',
  //   pfp: 'https://64.media.tumblr.com/f3807536e9926b27fae9741f7a7ab0df/0bbbff4652e354ea-dd/s1280x1920/a3e0d2027b2e86f5760c1d39db1402a1de78a5fa.png',    
  //   rank: 500,
  //   createdAt: 1700265723395       
  // });
  const [timer, setTimer] = useState(30);
  const [problem, setProblem] = useState("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.");
  const CreateGameForm = useRef(null);
  const Or = useRef(null);
  const JoinGameForm = useRef(null);
  const initialCode = "def kodoff():";
  const [code, setCode] = useState(initialCode);
  const [tests, setTests] = useState(null);

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
        console.log(gameId);
        setCreatorId(response.clientId);
        setGame(response.game);
      }

      // join
      if (response.method === "join"){
        setGame(response.game);
        setGameId(response.game.id);
      }

      if (response.method === "submit"){
        setGame(response.game);
        setWinner(response.winner);
      }

      if (response.method === "nextQuestion"){
        // replace logic with if the code submitted is correct
        // reset code block
        setCode(initialCode);
        // reset tests result
        setTests(null);
        // } else {
        //   setTests("Failed blabla cases");
        // }
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

      // Handle wrong answer
      if (response.method === "wrongAnswer") {
        setTests(response.message);
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

  const joinGame = () => {
    const payload = {
      "method": "join",
      "clientId": clientId,
      "gameId": joinId,
    };
    ws.current.send(JSON.stringify(payload));
    Or.current.className = "d-none";
    CreateGameForm.current.className = "d-none";
  };

  const createGame = () => {
    Or.current.className = "d-none";
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

  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className="d-flex flex-column mt-5 mb-4 justify-content-center">
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
                    <div className="col-md-5" ref={CreateGameForm}><CreateGame gamePin={gameId} createGame={()=>createGame()}/></div>
                    <div className="col-md-1 Or" ref={Or}>OR</div>
                    {/* <div className="col-md-5" ref={JoinGameForm}><JoinGame joinGame={()=>joinGame()}/></div> */}
                    <div ref={JoinGameForm} className="col-md-5 Option_Form d-flex flex-column justify-content-center align-items-center">
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