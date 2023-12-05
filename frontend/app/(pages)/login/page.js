'use client'

import React, { useRef } from "react";
import Link from 'next/link'
import "./styles.css";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

export function Login() {

  function redirectToGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID + "&redirect_uri=" + GITHUB_REDIRECT_URI + "&scope=user&state=login");
  }

  return (
    <div className="Access_Card container-fluid mt-5">
      <div className="row d-flex gx-5">
          <div className="Left_Container col-md-5 d-flex flex-column text-break text-center justify-content-center">
            <div className="App d-flex align-items-center justify-content-center">
              <div className="App_Logo"></div>
              <div className="App_Name">KodOff</div>
            </div>
            <div className="Main_Slogan">3 problems, 2 coders, 1 winner</div>
            <div className="Main_Description">Challenge your coding skills in real-time 1-on-1 duels by solving 3 coding problems under the clock!</div>
            <div className="Main_Access d-flex flex-column align-items-center">
              <button type="submit" className="mb-2 Main_Btn" onClick={redirectToGithub}>
                <i className="bi bi-github Main_Icon"></i>
                Log In with Github
              </button>
              <Link className="Main_Switch" href="/signup">Do not have an account yet?</Link>
            </div>
          </div>
          <div className="col-md-7 Main_Illustration"></div>
      </div>
    </div>
  );
}

export default Login;