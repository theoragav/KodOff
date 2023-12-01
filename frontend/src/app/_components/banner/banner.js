import  React, { useState, useEffect, useRef } from 'react';
import "./styles.css";

const BronzeUB = 499;
const SilverUB = 999;

export function UserBanner(props) {
  const { user } = props;
  const { playerType } = props;

  function rankClass() {
    let rankTitle;
    if (user.rank <= BronzeUB) {
        rankTitle = "Bronze";
    } else if (user.rank <= SilverUB) {
        rankTitle = "Silver";
    } else {
        rankTitle = "Gold";
    }
    return rankTitle;
  }

  function userTypeClass() {
    if (playerType == "user") {
      return "User";
    } else if (playerType == "opponent") {
      return "Opponent";
    } else {
      return "Waiting";
    }
  }

  function userTextTypeClass() {
    if (playerType == "user") {
      return "User_Username";
    } else if (playerType == "opponent") {
      return "Opponent_Username";
    } else {
      return "Waiting_Username";
    }
  }

  return (
    <div>
      {playerType !== "waiting" ? (
        <div className={`Banner d-flex flex-column align-items-center container-fluid ${userTypeClass()}`}>
          <div className="Profile">
              <img className="Pfp" src={user.pfp}/>
              <div className={`Username container-fluid ${userTextTypeClass()}`}>{user.username}</div>
          </div>
          <div className={`${rankClass()}`}></div>
        </div>
      ) : (
        <div className="Banner d-flex flex-column align-items-center container-fluid Waiting">
          <div className="Profile">
              <img className="Pfp" src="/assets/waiting_user_pfp.png"/>
              <div className="Username container-fluid Waiting_Username">Waiting for Opponent...</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserBanner;