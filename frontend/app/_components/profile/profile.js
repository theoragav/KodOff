import  React, { useState, useEffect, useRef } from 'react';
import { Rank } from "./../rank/rank.js"
import "./styles.css";

const BronzeUB = 499;
const SilverUB = 999;
const GoldUB = 1500;

export function Profile(props) {
  const { user } = props;

  function calculateProgress() {
    let progress;
    if (user.rank <= BronzeUB) {
        progress = (user.rank / BronzeUB) * 100;
    } else if (user.rank <= SilverUB) {
        progress = (user.rank / SilverUB) * 100;
    } else if (user.rank <= GoldUB) {
        progress = (user.rank / GoldUB) * 100;
    } else {
        progress = 100; // MAX
    }
    return Math.floor(progress);
  }

  return (
    <div className="Profile container-fluid">
      <div className="row d-flex align-items-center">
        <div className="col-md-3">
            <img className="Pfp" src={user.pfp}/>
        </div>
        <div className="Content col-md-7 d-flex flex-column justify-content-center align-self-center">
            <div className="Username">{user.username}</div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="25"
                viewBox="0 0 720 25"
            >
                <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g transform="translate(-143 -459)">
                    <g transform="translate(143 459)">
                    <rect
                        width="720"
                        height="25"
                        x="0"
                        y="0"
                        fill="#D9D9D991"
                        rx="15"
                    ></rect>
                    <rect
                        width={`${calculateProgress()}%`}
                        height="25"
                        x="0"
                        y="0"
                        fill="#89CFD9"
                        rx="15"
                    style={{ transition: 'all 0.5s ease-in-out'}}
                    ></rect>
                    </g>
                </g>
                </g>
            </svg>
        </div>
        <div className="col-md-2 d-flex flex-column justify-content-center align-items-center">
            <Rank rank={user.rank}/>
            <div className="Rank_Number">{user.rank}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
