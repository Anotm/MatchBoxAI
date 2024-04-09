var p1BabyBrain = {};
var p2BabyBrain = {};
var gameBoard = new Board();

function setUpBoard(p1Color, p2Color) {
	// x = column
	// y = row
	gameBoard.setColors(p1Color, p2Color);

	for (var i=0; i<3; i++) {
		gameBoard.push(new Pawn(p1Color, 2, [i, 0]))
	}

	for (var i=0; i<3; i++) {
		gameBoard.push(null)
	}

	for (var i=0; i<3; i++) {
		gameBoard.push(new Pawn(p2Color, 1, [i, 2]))
	}

	gameBoard.move([1,0], [1,1]);
	console.log(gameBoard.prettify());
	gameBoard.findMoves();
}

setUpBoard("white", "black")