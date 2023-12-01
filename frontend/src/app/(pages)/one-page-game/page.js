'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loggedInUser } from "../../../api/api.mjs";
import { JoinGame } from "../../_components/join-game/joingame.js"
import { CreateGame } from "../../_components/create-game/creategame"
import { Versus } from "../../_components/versus/versus.js"
import { InGame } from "../../_components/in-game/ingame.js"
import { Overlay } from "../../_components/result-overlay/result.js"
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
  const [testsRan, setTestsRan] = useState(null);
  const [gameResult, setGameResult] = useState("Victory");

  const [showOverlay, setShowOverlay] = useState(false);
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

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
    if (code === "def kodoff():") {
        setCurrentNo(currentNo + 1);
        setProblem("Dynamic programming hehehehe");
    }
  };

  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className="d-flex flex-column mt-5 mb-4 justify-content-center">
            {Object.keys(opponent).length !== 0 ? (
              <InGame user={user} opponent={opponent} timer={timer} currentNo={currentNo} problem={problem} 
              submitProblem={(code)=>submitProblem(code)}/>
            ) : (
              <div>
                <div className="Page_Title mb-3">New Game</div>
                <div className="row d-flex justify-content-between">
                    <div className="col-md-6" ref={CreateGameForm}><CreateGame gamePin={gamePin} createGame={()=>createGame()}/></div>
                    <div className="col-md-6" ref={JoinGameForm}><JoinGame joinGame={()=>joinGame()}/></div>
                </div>
                <Versus user={user} opponent={opponent}/>
                {/* <button onClick={toggleOverlay}>Show Overlay</button>
                {showOverlay && <Overlay onClose={toggleOverlay} />} */}
                {/* <Overlay gameResult={gameResult}/> */}
              </div>
            )}
        </div>
      ) : ( 
        <div></div>
      )}
    </div>
  );
}