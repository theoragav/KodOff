'use client'

import  React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, login, logOut, loggedInUser } from "../api/api.mjs";
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
    <div className="container-fluid Access_Card mt-5">
      <div className="row d-flex px-4 py-5 gx-5">
          <div className="col-md-5 d-flex flex-column text-break text-center justify-content-center Main_LeftContainer">
            <div className="d-flex flex-column align-items-center Main_Access">
              <button type="submit" className="mb-2 Main_Btn" onClick={logOutAccount}>
                <i className="bi bi-box-arrow-in-right Main_Icon"></i>
                Log Out
              </button>
            </div>
            <div className="Main_Title">KodOff</div>
            <div className="Main_Slogan">3 problems, 2 coders, 1 winner</div>
            <div className="Main_Description">Challenge your coding skills in real-time 1-on-1 duels by solving 3 coding problems under the clock!</div>
            <div className="User_Profile">
              <div className="Main_Description">{user.username}</div>
              <div className="Main_Description">Rank: {user.rank}</div>
              <img className="Main_Description" src={user.pfp}/>
            </div>
            <div className="d-flex flex-column align-items-center Main_Access">
              <button type="submit" className="mb-2 Main_Btn">
                <i className="bi bi-arrow-right Main_Icon"></i>
                Create Game
              </button>
            </div>
          </div>
          <div className="col-md-7 Main_Illustration"></div>
      </div>
    </div>
  )
}
