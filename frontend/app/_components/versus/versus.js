'use client'

import  React, { useState, useEffect, useRef } from 'react';
import { UserBanner } from "./../banner/banner.js";
import "./styles.css";

export function Versus(props) {
  const { user, opponent } = props;

  return (
    <div className="Create_Game mt-5 container-fluid d-flex flex-column align-items-center align-self-stretch">
      <div className="Content row d-flex justify-content-center">
        <div className="col-md-4"><UserBanner user={user} playerType="user"/></div>
        <div className="Versus col-md-2 d-flex flex-column align-items-center mt-5"></div>
        {Object.keys(opponent).length !== 0 ? (
          <div className="col-md-4"><UserBanner user={opponent} playerType="opponent"/></div>
        ) : (
          <div className="col-md-4"><UserBanner playerType="waiting"/></div>
        )}
      </div>
    </div>
  )
}

export default Versus;
