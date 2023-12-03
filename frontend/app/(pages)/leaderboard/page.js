'use client'

import  React, { useState, useEffect, useRef } from 'react';
import "./styles.css";
import { loggedInUser, getLeaderboard } from "./../../../api/api.mjs";
import { useRouter } from 'next/navigation';
import { Rank } from "./../../_components/rank/rank.js"

export function Leaderboard() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loggedInUser().then((data) => {
      if (data) setUser(data);
      else router.push('/login');
    });
    getLeaderboard().then((data) => {
      if (data) setUsers(data);
    });
    console.log("WebSocket URL inside useEffect:");
  }, []);

  const redirectHome = () => {
    router.push('/');
  };

  return (
    <div className="Leaderboard container-fluid mt-5 mb-5">
      <div className="d-flex align-items-center mb-3">
        <button type="submit" className="Icon_Button" onClick={redirectHome}>
          <i className="bi bi-caret-left-fill Icon"></i>
        </button>
        <div className="Page_Title">Leaderboard</div>
      </div>
      {users.map((user, index) => (
        <div key={index} className={`User mb-2 row justify-content-center align-items-center`}>
          <div className="Number col-md-2 text-center">{index + 1}</div>
          <div className="col-md-2"><Rank rank={user.rank}/></div>
          <div className="Rank col-md-2">{user.rank}</div>
          <img className="Pfp col-md-2" src={user.pfp}/>
          <div className="Username col-md-4">{user.username}</div>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;