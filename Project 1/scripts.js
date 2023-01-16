//Select all items 
const playerText = document.querySelector("#playerText");
const computerText = document.querySelector("#computerText");
const resultText = document.querySelector("#resultText");
const playerScoreText = document.querySelector("#playerScore");
const computerScoreText = document.querySelector("#computerScore");
const choiceBtns = document.querySelectorAll(".choiceBtn");

// Initialize variables and set computer and player scores to 0
let player;
let computer;
let result;
let playerScore = 0;
let computerScore = 0;

choiceBtns.forEach(button => button.addEventListener("click", () => {

	//for player turn, get text content of button
	player = button.textContent;
	//it is now computers turn
	computerTurn();

	//assign strings to player and computer
	playerText.textContent = `Player: ${player}`;
	computerText.textContent = `Computer:  ${computer}`;
	//result checks winner
	resultText.textContent = checkWinner();
	//keeping score
	playerScoreText.textContent = `Player Score: ${playerScore}`;
	computerScoreText.textContent = `Computer Score: ${computerScore}`;

}));

//declare computers turn function
function computerTurn() {
	const randNum = Math.floor(Math.random() * 3) + 1
	
	//computer picks a random num using switch statement that will be assigned to rock paper or scissors
	switch(randNum) {
		case 1:
			computer = "ROCK";
			break;
		case 2:
			computer = "PAPER";
			break;
		case 3: 
			computer = "SCISSORS";
			break;
	}
}

//declare check winner function, based on player and computer choices,update the score for each player and set the maximum score for each player
function checkWinner() {
	if (player == computer){
		return "Draw!";
	}
	else if (computerScore == 10) {
		
		return "Game over, Computer wins! Better luck next time!"
	}

	else if (playerScore == 10) {
		return "Game over, Player wins! Congrats!"
	}

	else if(computer == "ROCK" && player == "PAPER") {
		playerScore++
		return "Player Wins!"
	}

	else if(player == "ROCK" && computer == "PAPER") {
		computerScore++
		return "Computer Wins!"
		
	}

	else if(computer == "PAPER" && player == "SCISSORS") {
		playerScore++
		return "Player Wins!"
	}

	else if(player == "PAPER" && computer == "SCISSORS") {
		computerScore++
		return "Computer Wins!"
		
	}

	else if(computer == "SCISSORS" && player == "ROCK") {
		playerScore++;
		return "Player Wins!"
	}

	else if(computer == "ROCK" && player == "SCISSORS") {
		computerScore++
		return "Computer Wins!"
	}



}