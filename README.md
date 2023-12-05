# __KodOff__

## Project URL
http://kodoff.io

http://kodoff.net  

http://34.130.40.53/

(all 3 links point to the same deployment, we had multiple domains as one of them took a while to forward properly)

## Project Video URL 

KodOff.io - The True Online Competitive Programming Experience - CSCC09 Project Fall 2023


## Project Description

### Description
KodOff is a real-time online competitive programming 1-on-1 game where each player has to solve 3 given programming prompts within 2 minutes and 30 seconds. Our goal is for users to have fun and engage in real-time coding challenges, showcasing their problem-solving abilities in a time-crunch environment.

### Features
**Authentication:**
   - GitHub account-based authentication for quick sign up, log in, and log out processes.
   - Note that users need to initially sign up in our application first before being able to log in seamlessly on future occasions.

**Home:**
   - Users can see their profile with their rank number and progress. 
   - Each user starts with an initial rating of 0 points, and will be able to gain or lose points by playing KodOffs. 
   - Users are able to navigate to other pages on this page.

**Game Lobbies:**
   - Players can host their own games by generating a shareable game lobby PIN to initiate a KodOff with another player.
   - Players can join another game by inputting in an existing shareable game lobby PIN to the Join Game form.

**Game Flow:**
   - Players solve one problem at a time and each problem they are solving is the same for both players in a KodOff. 
   - Players can advance to the next problem only after successfully solving the current problem by passing a set of test cases.
   - The three programming problems are randomly assigned.
   - The game ends when a player solves all three questions first or when the timer of 2:30 minutes runs out.

**Coding Environment:**
   - Answers are supported in Python, executed online in real-time upon submission.
   - Imports are restricted as problems are only meant to be solved with default numPy library that is already pre-imported
   - File operations are also restricted
   - Non terminating scripts are gracefully handled by an execution timeout system
   - Submitted code will be verified with a series of test cases and user can only move on to the next question after passing all the test cases for a given problem

**Rank System:**
   - Uses dynamic ELO rating system that takes in 4 factors when calculating rank changes
My current rank
Opponent current rank
My final score
Opponent final score
   - Winning by 3-0 would give the largest possible rating increase while winning by 1 would give the smallest possible rating increase

**Match History:**
   - A History Page to provide a comprehensive overview of past 20 matches, including opponents, outcomes, and scores.

**Leaderboard:**
   - Real-time global leaderboard showcasing the top 50 players and their respective ratings.


## Development

### Frontend ### 
__React + Bootstrap__

The frontend communicates with the backend using asynchronous requests to fetch and send data. These API endpoints that the application is calling to send to the backend is under `/frontend/api`. 

The project application pages and components lie under `/frontend/app`.

Bootstrap and external fonts are imported as CDN links under `/app/layout.js`. Bootstrap is used for styling and layout components in order to generalize the styling throughout the pages. 

React's states are widely used to ensure responsiveness and efficient updates across components.

The application is structured with a separation of concerns, organizing its codebase into distinct directories. The `/app/(pages)` consists of all the pages within the application, this is also done this way in order to leverage React's Router file system. The `/app/_components` directory contains reusable components utilized across various pages, for a more modular and efficient development approach.

The coding text editor is integrated into the application using the `uiw codemirror` library, using Visual Studio as its theme. The choice is to provide a familiar and user-friendly coding environment. 

Under `/app/(pages)/one-page-game/page.js`, real-time updates in the game are implemented using WebSockets for communication between the client and server. By directly working with the native WebSocket API, the client establishes a connection to the server. Event listeners are utilized to handle WebSocket events such as onopen to establish connection, onmessage for receiving messages from the server, and onclose for handling disconnections. Custom events specific to the application, such as implementing the timer for real-time interactions in a KodOff, are dispatched using the send method. Using WebSockets, the frontend allows instantaneous updates and interactions.


### Backend ### 
__Express.js__

The backend uses Express.js for handling REST operations efficiently. Database operations are performed asynchronously, with promises to enhance code readability and maintainability. The interaction with the database is facilitated by the native MongoDB Node.js driver to ensure an optimal communication between the application and the database.

Our application uses GitHub as a third-party API for account authentication. Upon a successful redirect from GitHub, the backend acquires a user access token, which acts as a key to be able to grant our application the ability to access user data from GitHub. The only data we are extracting for our application is their GitHub username and GitHub avatar, which is then used by the frontend to add on to their profile. 

__WebSocket__

The WebSocket implementation can be found in app.mjs and in page.js under one-page-game. We chose WebSocket library ‘ws’ to implement the WebSocket as it is lightweight, simple and fast. When a client connects, we establish a WebSocket connection using their clientId which is derived from their session data, and this forms the basis of our player tracking system within the game. We store this in a clients object which maps a clientId to the respective WebSocket connection. The WebSocket server manages events including game creation, game joining, and submission of game responses, updating all clients accordingly in real-time, which ensures that all players in the game have the updated game information. For each game session, we store it in a games object that is updated real-time based on the information received through WebSocket connections. Relevant information such as the clientId of the two players in the game, player scores, and game progress are stored in this object. For the submission of the game responses, a call is made to the execPythonScript from DockerManager.mjs which returns a value that we can use to evaluate the game progress of the player. The management of connection closures is crucial in preventing memory leaks and ensuring fairness and accuracy of the game state. 


__Python Executor and gameplay related features__

All features related to Python Execution and gameplay are found under the gameplay folder. Python Executor and Rank Algorithms were implemented as separate modular mjs files to ease merging and usage with backend endpoints and websocket.

All code related to Python Execution can be found under DockerManager.mjs. As the name suggests, each submitted Python Code is executed in individual Docker containers as we are dealing with untrusted or external code. Docker containers offer better isolation, resource control, and environmental consistency compared to executing the code directlu. The Docker Container created is also as light as possible, it is based on python:3.9-slim and the only imported library by default is numpy.

Ensuring the python code is executed securely starts way before execution. Regex is used to prevent any import or file operations being contained in the script. Once the script is sanitized, we construct a temporary python script where the user submitted function named kodoff will be tested against the various test cases of the particular problem that is currently being solved. This execution will happen inside a container that is specifically created for that submission and is set with the following flags to maximize security


rm : removes the container when it exists to prevent unintentional container left running
memory=100m : limits max amount of usable memory by container to 100mb
cpus=0.5s : limits usable cpu by container to 0.5
network none: disables network usage for container
security-opt=no-new-privileges: ensures container privileges is not increased over time
tmpfs', '/run:rw,noexec,nosuid,size=65536k:
rw: read write access within the scope of the temporary file system's /run directory inside of the container
noexec: execution of binaries from the temporary file system is disallowed
nosuid: set-user-ID and set-group-ID bits are ignored
size=65536k: limits the overall size of the temporary file system to 65536 kilobytes

The outcome of the execution will then be observed and the appropriate error message gracefully will be returned by the function if necessary. Given that the container has been running for more than 12 seconds, it will trigger an execution timeout and the appropriate message will be gracefully returned by the function.

Given that the code was able to be submitted correctly, a line containing the number of test cases passed and failed will be printed to stdout for the function to analyze if the submitted code passed the given test cases or not. To prevent falsifying and mocking results, the outputted line of test results is concatenated with a random string that is generated right before code execution. The result of the test cases would then be returned by the function.

Rank update algorithm is found in RankSystem.mjs under Gameplay that uses standard ELO algorithm but with a linear K rating for smoother progression through different ranks.

### Database ### 
__MongoDB__


We use MongoDB as our database for its flexibility and scalability. Our collections are:
   - `users`, which contains users that are registered for our application
    - username: unique from GitHub
    - pfp: profile picture uploaded from GitHub
    - rank: rating points accumulated by user, initialized to 0
  - `games`, which contains games created by users
    - gamePin: uniquely generated
    - player1: username of player
    - player2: username of the other player in a game
    - player1Score: number of problems solved by player1
    - player2Score: number of problems solved by player 2
  - `problems`, which contains programming problems
    - desc: textual description of the programming problem
    - test_cases: set of test cases associated with the programming problem
    - test_results: set of results of the test cases


## Deployment

1. **Updating environment variables**
   - Update all the environment variables and database connection strings on both backend and frontend

2. **Setting up the Virtual Machine**
   - Create a custom VPC network to connect for the VM’s Network Interface (For firewall rules, check the example-open-allow-custom with IPv4 ranges to 0.0.0.0) 
   - Create a VM on Google Cloud Platform with specific properties (Region: northamerica-northeast2, Machine configuration: E2, Machine type: e2-micro)
   - Add the made custom VPC network to the VM's configuration
   - Add SSH key to the VM's configuration for secure access
   - Install Node.js and Docker on the VM

3. **Transferring the Backend folders/files to the VM**
   - Copy all required backend files from the local machine to the VM using `scp -r`.

4. **Deploying the Backend directly in the VM with PM2:**
   - Navigate to the backend directory which contains the Dockerfile for the python executor and run the following command to build the Docker image `docker build -t python-exec-env .`
   - Install all backend dependencies by running `npm install`
   - Create docker group and add user to docker group so backend can perform “run” to execute submitted python script with the docker image that was built
     by following the instructions on `https://docs.docker.com/engine/install/linux-postinstall/`
   - Install PM2 (process manager 2) with npm by running `sudo npm install pm2@latest -g`
   - Start the express backend server with pm2 which allows it to run in the background and provides automatic restart in the event of an unexpected crash by running `pm2 start app.mjs`
5. **Transferring the Frontend folders/files to the Virtual Machine:**
   - Copy all required frontend files from the local machine to the VM using `scp -r`

6. **Deploying the containerized Frontend in the VM using Docker:**
   - Create a Dockerfile for the frontend `frontend.dockerfile`
   - Build the frontend image by running `docker build -t frontend -f frontend.dockerfile .`
   - Deploy the frontend by running `docker run -d --rm -p 80:3000 frontend`

7. **Deploying the MongoDb Database:**
   - This project uses MongoDb Atlas to deploy the database on the cloud

## Challenges

__Deployment__
Deploying the application was a really difficult challenge due to the need to ensure everything is set up correctly, requiring lots of time, especially since each of our team members have never successfully deployed before. Setting up the Virtual Machine (VM) on Google Cloud Platform with the appropriate firewall settings, installing the required dependencies especially for the backend which was deployed directly with PM2, moving the frontend components into docker containers, and making last minute code changes in our efforts to connect the backend and frontend which required hours and meticulous attention to detail. Overcoming this challenge was really a joy because it took us days to ensure the application runs well in the production environment.

__Ensuring a Secure Python Code Executor__
To prioritize security, we made the decision to execute python inside individual dockerize containers as containers offer better isolation, resource control, and environmental consistency. We had to learn the various flags offered by docker for security and how to appropriately use them for our scenario in addition to the pre-execution code sanitization performed with regex. We had to spend a lot of time thinking how to run various test cases and passing the result of the test cases securely out of the container before ultimately using the randomly generated seed (string) and the current implement structure of the elements in the problems database. We also had to learn more about child processes and the various exit conditions to not only return better error messages back to the user but to gracefully handle various types of termination, especially the timeout set within 12 seconds. This decision to use containers for execution meant that we could not deploy the backend like how it was shown in the lab with the provided dockerfile as docker in docker configuration is not suggested. Hence we had to install Node directly into our VMs and use PM2 to continuously serve the backend. In the end, we are confident that we have a python executor that is secure from a wide variety of attacks.

__WebSocket__
Implementing WebSockets was key to the application and thus we needed to make sure that WebSockets were implemented accurately. This was a new concept to us and introduced a significant challenge. We ensured that all parts throughout the gameplay, such as the start of the game, the timer during a KodOff, and the result of the game were real-time and efficient. Overall, back and forth data communication between the client and server, working with asynchronous events, and connecting them on the frontend required a thorough understanding of WebSocket, which was not an easy concept to grasp. Additionally, we learnt that we had to implement an upgrade mechanism for transforming an HTTP protocol to a WebSocket communication. This changes the stateless request-response pattern to a continuous, two-way communication over the connection. 



## Contributions

Christopher Nathanael:
- Created dockerfile and decided required imports for Kodoff python execution
- Implemented containerized secure python execution feature using Docker and various appropriate security flags
- Implemented regex for initial script sanitization prior to construction and execution
- Implemented the ability to run submitted code against various test cases and expected results from the problems database by the construction of an appropriate python script
- Implemented rank system algorithm inspired by standard ELO algorithm with linear k factor

Shannon Budiman:
- Lead deployment, effectively modified code to ensure successful deployment
- Implemented WebSocket functionality on the server that handles connections and messages from the clients, allowing real-time updates for all players in a game
- Integrated game functionality within the WebSocket infrastructure, like assigning random questions to players, correct code submission game logic, implementing a game timer, all of which are provided to the players in an instantaneous and synchronized manner
- Bridged websocket functionality with both frontend and the python executor components, ensuring a functional and responsive gaming experience
 
Theora Gavrila Pui: 
- Implemented GitHub account authentication by integrating with the GitHub API, establishing secure communication, obtaining user access tokens for user data retrieval, with user sessions and cookies
- Designed and developed the frontend with Figma, React, and Bootstrap. Utilized Figma for design prototypes, developed these designs using React and Bootstrap for an interactive and engaging user experience. Pages include: Login, Sign Up, Home, New Game Interface, In Game Interface, Match History, Leaderboard. 

# One more thing? 

We performed the majority of our merging locally under one machine therefore the github contribution chart to the main branch does not accurately reflect the contribution of each team member. We all agree that everybody gave their best for this project.

When testing our application on the website, please:
View them on a full screen Desktop/Laptop for a better user experience
Sign up first to be registered in our application

Thank you for the great semester! 

# Credits
ChatGPT for debugging and deployment help (https://chat.openai.com)

StackOverflow for debugging and deployment help (https://stackoverflow.com/)

Python NumPy documentation from https://numpy.org/doc/

Python 3.9 Slim base image for Dockerfile from https://hub.docker.com/layers/library/python/3.9-slim/images/sha256-b370e60efdfcc5fcb0a080c0905bbcbeb1060db3ce07c3ea0e830b0d4a17f758

MongoDb Atlas documentation from https://www.mongodb.com/docs/

Docker documentation from https://docs.docker.com/

Icons used in the website from https://icons.getbootstrap.com/

Home page illustration from https://iconscout.com/free-illustration/concept-of-seo-ranking-2040894

Coding background illustration from https://stock.adobe.com/ca/search/images?filters%5Bcontent_type%3Azip_vector%5D=1&hide_panel=true&k=code+&search_type=usertyped&asset_id=430175470

App logo and rank illustrations from https://iconscout.com/ 

Fonts used: https://fonts.google.com/specimen/Josefin+Sans?query=josefin+sans

https://fonts.google.com/specimen/Poppins?query=poppins

https://fonts.google.com/specimen/IBM+Plex+Mono?query=ibm+plex+mono

Random game id generator from https://github.com/hnasr/javascript_playground/tree/master/websocket-cell-game
