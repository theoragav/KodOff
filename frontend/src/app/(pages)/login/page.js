'use client'

import React, { useRef } from "react";
import Link from 'next/link'
import "./styles.css";

const GITHUB_CLIENT_ID = "519e665d1d70d75e371a";
const GITHUB_REDIRECT_URI = "http://localhost:3000/";

export function Login() {

  function redirectToGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user`);
  }

  return (
    <div className="container-fluid Access_Card mt-5">
      <div className="row d-flex px-4 py-5 gx-5">
          <div className="col-md-5 d-flex flex-column text-break text-center justify-content-center Main_LeftContainer">
            <div className="Main_Title">KodOff</div>
            <div className="Main_Slogan">3 problems, 2 coders, 1 winner</div>
            <div className="Main_Description">Challenge your coding skills in real-time 1-on-1 duels by solving 3 coding problems under the clock!</div>
            <div className="d-flex flex-column align-items-center Main_Access">
              <button type="submit" className="mb-2 Main_Btn" onClick={redirectToGithub}>
                <i className="bi bi-github Main_Icon"></i>
                Log In with Github
              </button>
              <Link className="Main_Switch" href="/signup">Don't have an account yet?</Link>
            </div>
          </div>
          <div className="col-md-7 Main_Illustration"></div>
      </div>
    </div>
  );
}

export default Login;