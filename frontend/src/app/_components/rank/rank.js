import  React, { useState, useEffect, useRef } from 'react';
import "./styles.css";

const BronzeUB = 499;
const SilverUB = 999;
const GoldUB = 1500;

export function Rank(props) {
  const { rank } = props;

  function rankClass() {
    let rankTitle;
    if (rank <= BronzeUB) {
        rankTitle = "Bronze";
    } else if (rank <= SilverUB) {
        rankTitle = "Silver";
    } else {
        rankTitle = "Gold";
    }
    return rankTitle;
  }

  return (
        <div className={rankClass()}></div>
  );
}

export default Rank;
