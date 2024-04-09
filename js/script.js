var p1BabyBrain = {};
var p2BabyBrain = {};
var gameBoard = new Board();

function setUpBoard(p1Color, p2Color) {
	// x = column
	// y = row
	for (var i=0; i<3; i++) {
		gameBoard.push(new Pawn(p1Color, 1, i, 0))
	}

	for (var i=0; i<3; i++) {
		gameBoard.push(null)
	}

	for (var i=0; i<3; i++) {
		gameBoard.push(new Pawn(p2Color, 2, i, 2))
	}

	console.log(gameBoard.toString());
}

setUpBoard("white", "black")