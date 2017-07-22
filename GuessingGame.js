function generateWinningNumber(){
	return Math.round(100*(Math.random())+.5)
}

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game(){

	//Reset or initialize headers
	$("#title").text("Play the Guessing Game!")
	$("#subtitle").text("Guess a number between 1-100!")
	$('#hint, #submit').prop("disabled",false)

	this.playersGuess = null
	this.pastGuesses = []
	this.winningNumber = generateWinningNumber()
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber)
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber
}

Game.prototype.playersGuessSubmission = function(number){
	//console.log("the submitted number: " + number)
	if (number < 1 || number > 100 || typeof number != "number"){
		throw "That is an invalid guess."
	}
	else{
		this.playersGuess = number
		return this.checkGuess()
	}
}




Game.prototype.checkGuess = function(){
	console.log("Cheat? " + this.winningNumber)

	//winning and losing
	if (this.playersGuess === this.winningNumber){
		$("#subtitle").text("Click Reset to play again!")
		$('#hint, #submit').prop("disabled",true)
		return "You Win!"
	}
	else if (this.pastGuesses.indexOf(this.playersGuess) > -1){
		return "You have already guessed that number."
	}
	else {
		this.pastGuesses.push(this.playersGuess)
	}
	if (this.pastGuesses.length > 3){
		$('#hint, #submit').prop("disabled",true)
		$("#subtitle").text("Click Reset to try again.")
		return "You Lose."
	}

	//change subtitle
	if (this.isLower()){
        $('#subtitle').text("Guess Higher!")
    } 
    else {
        $('#subtitle').text("Guess Lower!")
    }

    //return proximity
	if (this.difference() < 10){
		return "You're burning up!"
	}
	else if (this.difference() < 25){
		return "You're lukewarm."
	}
	else if (this.difference() < 50){
		return "You're a bit chilly."
	}
	else {
		return "You're ice cold!"
	}

	
}

newGame = function(){
	return new Game();
}

Game.prototype.provideHint = function(){
	hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()]
	shuffle(hintArr)
	return hintArr
}

function pullGuess(gameInstance){
	var result = gameInstance.playersGuessSubmission(parseInt($('#player-input').val(),10))
	$('#player-input').val("")
	$("#title").text(result)
}

//JQuery handler
$(document).ready(function(){

	var currentgame = new Game()

	$("#submit").click(function(){
		//console.log("clicky")
		pullGuess(currentgame)
	})

	$("#player-input").keypress(function(){
		if (event.which === 13){
			pullGuess(currentgame)
		}
	})

	$("#reset").click(function(){
		currentgame = new Game()
	})

	$("#hint").click(function(){
		var hints = currentgame.provideHint()
		$("#title").text('It is either '+hints[0]+', '+hints[1]+', or '+hints[2])
	})

})





	