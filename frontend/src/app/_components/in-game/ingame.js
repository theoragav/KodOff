'use client'

import  React, { useState, useEffect, useRef } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import "./styles.css";

export function InGame(props) {
  const { user, opponent, timer, currentNo, problem, code, setCode, submitProblem, tests } = props;

  const Q1 = useRef(null);
  const Q2 = useRef(null);
  const Q3 = useRef(null);
  const success = useRef(null);

  useEffect(() => {
    if (currentNo === 1) {
      Q1.current.className = "Number Current";
      Q2.current.className = "Number Inactive";
      Q3.current.className = "Number Inactive";
      success.current.className = "d-none";
    } else if (currentNo === 2) {
      Q1.current.className = "Number Done";
      Q2.current.className = "Number Current";
      Q3.current.className = "Number Inactive";
      success.current.className = "Correct";
      setTimeout(() => {
        success.current.className = "d-none";
      }, 2000);
    } else if (currentNo === 3) {
      Q1.current.className = "Number Done";
      Q2.current.className = "Number Done";
      Q3.current.className = "Number Current";
      success.current.className = "Correct";
      setTimeout(() => {
        success.current.className = "d-none";
      }, 2000);
    } else {
      Q1.current.className = "Number Done";
      Q2.current.className = "Number Done";
      Q3.current.className = "Number Done";
      success.current.className = "Correct";
    }
  }, [currentNo]);

  const handleSubmit = (e) => {
    submitProblem(code);
  };

  return (
    <div className="InGame d-flex flex-column container-fluid">
      <div className="row d-flex justify-content-between align-items-center align-self-stretch">
        <div className="Profile col-md-3 d-flex align-items-center flex-wrap">
          <img className="Pfp User" src={user.pfp}/>
          <div className="Username">{user.username}</div>
        </div>
        <div className="Game_Info col-md-6 d-flex align-items-center justify-content-center">
          <div className="Problems d-flex align-items-center">
            <div className="Number" ref={Q1}>1</div>
            <div className="Number" ref={Q2}>2</div>
            <div className="Number" ref={Q3}>3</div>
          </div>
          <div className="Clock"></div>
          {timer !== null && (
          <div className='Timer'>
            {Math.floor(timer / 60000)}:{(timer % 60000 / 1000).toFixed(0).padStart(2, '0')}
          </div>
        )}
        </div>
        <div className="Profile col-md-3 d-flex align-items-center flex-wrap">
          <img className="Pfp Opponent" src={opponent.pfp}/>
          <div className="Username">{opponent.username}</div>
        </div>
      </div>
      <div className="Problem">{problem}</div>
      <div>
        <CodeMirror
          value={code}
          theme={vscodeDark}
          minHeight='50vh'
          maxHeight='50vh'
          extensions={[python()]}
          onChange={(code) => setCode(code)}
          className="CodeEditor"
        />
      </div>
      {tests && (
          <div className="Tests"><i className="bi bi-x-circle-fill Icon"></i>{tests}</div>
      )}
      <div className="d-flex align-self-stretch justify-content-end align-items-center">
      <div className="Correct" ref={success}><i className="bi bi-check-circle-fill Icon"></i></div>
        <button type="submit" className="Submit_Btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}

export default InGame;