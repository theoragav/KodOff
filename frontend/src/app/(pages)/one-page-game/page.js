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

export default function Game() {
  const router = useRouter();
  const [user, setUser] = useState({});
  // const [opponent, setOpponent] = useState({});
  const [opponent, setOpponent] = useState({
    _id: '6557fefb1ed206278afed4aa',
    username: 'abcde',
    pfp: 'https://64.media.tumblr.com/f3807536e9926b27fae9741f7a7ab0df/0bbbff4652e354ea-dd/s1280x1920/a3e0d2027b2e86f5760c1d39db1402a1de78a5fa.png',    
    rank: 500,
    createdAt: 1700265723395       
  });
  const [gamePin, setGamePin] = useState(null);
  const [timer, setTimer] = useState(30);
  const [currentNo, setCurrentNo] = useState(1);
  const [problem, setProblem] = useState("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.");
  const CreateGameForm = useRef(null);
  const JoinGameForm = useRef(null);
  const initialCode = "def kodoff():";
  const [code, setCode] = useState(initialCode);
  const [tests, setTests] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    loggedInUser().then((data) => {
        if (data) setUser(data);
        else router.push('/login');
    });
  }, []);

  const joinGame = () => {
    console.log("Joining game");
    CreateGameForm.current.className = "d-none";
  };

  const createGame = () => {
    setGamePin("Game Pin Changed");
    JoinGameForm.current.className = "d-none";
  };

  const submitProblem = (code) => {
    console.log(code);
    // replace logic with if the code submitted is correct
    if (code === "1") {
      // go to next problem
      setCurrentNo(currentNo + 1);
      // reset code block
      setCode(initialCode);
      // set next problem
      setProblem("Dynamic programming hehehehe");
      // reset tests result
      setTests(null);
    } else if (code === "W") {
      setWinner(user);
    } else if (code === "T") {
      setWinner("tie");
    } else if (code === "D") {
      setWinner(opponent);
    } else {
      setTests("Failed blabla cases");
    }
  };

  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className="d-flex flex-column mt-5 mb-4 justify-content-center">
            {Object.keys(opponent).length !== 0 ? (
              <div>
              <InGame user={user} opponent={opponent} timer={timer} currentNo={currentNo} problem={problem} 
              code={code} setCode={setCode} submitProblem={(code)=>submitProblem(code)} tests={tests}/>
              {winner && (
                  <div>
                      {winner === user ? <Result gameResult={"Victory!"}/> : 
                      winner === "tie" ? <Result gameResult={"Tie"}/> : <Result gameResult={"Defeat"}/>}
                  </div>
              )}
              </div>
              
            ) : (
              <div>
                <div className="Page_Title mb-3">New Game</div>
                <div className="row d-flex justify-content-between">
                    <div className="col-md-6" ref={CreateGameForm}><CreateGame gamePin={gamePin} createGame={()=>createGame()}/></div>
                    <div className="col-md-6" ref={JoinGameForm}><JoinGame joinGame={()=>joinGame()}/></div>
                </div>
                <Versus user={user} opponent={opponent}/>
              </div>
            )}
        </div>
      ) : ( 
        <div></div>
      )}
    </div>
  );
}