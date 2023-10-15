[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/KRLE_tfD)

# CSCC09: Project Proposal

## Project Title
**KodOff: Real-time Online Competitive Programming Duels** 

## Team Members
- Christopher Nathanael 
- Shannon Budiman
- Theora Gavrila Pui

## Description of the Web Application
### Brief Description
- **What is KodOff?**: A real-time online competitive programming 1 on 1 duel where each player has to solve 3 given programming prompts within a set period of time.
- **Game Flow**: 
    - 1 question is given at a time.
    - Players can only advance to the next question when they solve it (by passing test cases).
    - The 3 set questions will be randomly assigned depending on the players’ rating.
    - The player who solves all questions or solves more questions by the end of time wins

### Point System
- Complete all 3 questions first before time runs out: gain maximum possible rating points.
- Complete more questions than the opponent when time runs out: gain some rating points.
- Complete fewer questions than the opponent when time runs out: lose some rating points.
- The Opponent completes all 3 questions first: lose maximum possible rating points.
- Tie: Possible point adjustments based on rating differences.
Note that “maximum” and “some” depends on rating system algorithm

### In-Depth Feature Description
- Github account-based authentication for sign up, log in, and log out.
- Each player has an initial rating of 0 points.
- One way to have a KodOff is by generating a shareable game lobby PIN to be used by opponent to join
- Answers are supported in Python only for now and will be executed online real time as players submit.
- Another way to have a KodOff is by the Online Matchmaking System
    - If the player does not know anyone that is available or play against random opponents, there is an online matchmaking system the player can use
    - To search for a match, players have to queue in an online matchmaking system that will attempt to find an opponent within a reasonable rating range and region difference to ensure a fair and seamless competitive experience
    - If there is no opponent within the initial rating range, the range will slowly increase over time until an opponent is found but after a set amount of time, matchmaking will be canceled and user is prompted to wait and try again

- Text chat between the 2 players will be supported, allowing players to communicate in real time (Censorship will also be implemented)
- A Real-time Top 100 global leaderboard and the respective ratings
- History Page with past Match history and graph for past ratings over a set period of time (1 year, 6 months, 3 months, 1 month).

## Key Features that will be completed by the Beta Version (Due: Nov 12)
- Github account-based authentication for sign up, log in, and log out.
- Custom KodOff creation by generating functional PINs.
- Joining a game using a PIN.
- Functional KodOff with timer and “randomly” assigned questions from question bank.
- Players’ solution submission and verification for a given KodOff.
- Real-time game updates if a player or opponent has already completed all 3 questions or if the timer has finished.
- Functional rating system that increases or decreases ratings depending on KodOff result and net rating difference using algorithms to ensure fairly distributed ratings.

## Additional Features that will be completed by the Final Version (Due: Dec 3)
- Frontend aesthetics.
- Online matchmaking system accounting rating and region differences.
- Real-time global leaderboard with each player’s current rating
- Rating history graph and results of past matches
- Real-time text chat between players during a KodOff.

## Technology Stack
- **Frontend**: React and Bootstrap.
- **Backend**: Express.js (with GraphQL).
- **Database**: Redis and MongoDB.

## Top 5 Technical Challenges
1. Implementation of real-time features such Online Matchmaking System, KodOff Game Result impacting Global Leaderboard, in-game Text Chat, etc.
2. Executing Python code online and verifying each player’s code results.
3. RedisDB usage to store real-time status of KodOff games.
4. Using new technologies like Express in GraphQL for backend and Bootstrap for frontend.
5. Implementation of an efficient and balanced rating system inspired by rating algorithms used in modern competitive games (e.g., Glicko System).
