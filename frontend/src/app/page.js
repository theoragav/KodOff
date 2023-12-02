'use client'

import  React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, login, logOut, loggedInUser } from "../api/api.mjs";
import { Profile } from "./_components/profile/profile.js";
import "./styles.css";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({});

  useEffect(() => {
    loggedInUser().then((data) => {
        if (data) setUser(data);
        else router.push('/login');
    });
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code"); 
    const state = urlParams.get("state"); 
    if (code && state) {
      if (state === 'login') {
        login(code).then((data) => {
          setUser(data);
          router.replace('/');
        });
      } else if (state === 'signup') {
        signUp(code).then((data) => {
          setUser(data);
          router.replace('/');
        });
      }
    }
  }, []);

  function logOutAccount() {
    logOut();
    setUser({});
    router.push('/login');
  }

  return (
    <div>
      {Object.keys(user).length !== 0 ? (
        <div className="Home Main_Card container-fluid mt-5">
          <div className="Title row d-flex justify-content-between align-items-center align-self-stretch">
            <div className="App col-md-7 d-flex align-items-center">
              <div className="App_Logo"></div>
              <div className="App_Name">KodOff</div>
            </div>
            <div className="col-md-5"><Profile user={user}/></div>
          </div>
          <div className="Content row d-flex gx-5">
            <div className="Game_Menu col-md-5 d-flex flex-column align-items-start text-break mt-5">
              <Link href="/one-page-game"><button type="submit" className="Menu_Button">Let's KodOff</button></Link>
              <Link href="/history"><button type="submit" className="Menu_Button">Match History</button></Link>
              <Link href="/leaderboard"><button type="submit" className="Menu_Button">Leaderboard</button></Link>
              <button type="submit" className="SubMenu_Button" onClick={logOutAccount}>Log Out</button>
            </div>
            <div className="col-md-7 Main_Illustration"></div>
          </div>
        </div>
      ) : ( 
        <div></div>
      )}
    </div>
  )
}
