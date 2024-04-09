var p1BabyBrain = {};
var p2BabyBrain = {};
var gameBoard = new Board();

function randEl(list) {
	return list[Math.floor(Math.random()*list.length)];
}

function setUpBoard(p1Color, p2Color) {
	// x = column
	// y = row
	gameBoard = new Board();
	gameBoard.setColors(p1Color, p2Color);

	for (var i=0; i<3; i++) {
		gameBoard.push(new Pawn(p1Color, 2, [i, 0]));
	}

	for (var i=0; i<3; i++) {
		gameBoard.push(null);
	}

	for (var i=0; i<3; i++) {
		gameBoard.push(new Pawn(p2Color, 1, [i, 2]));
	}

	const print = false;
	while (true) {
		let allMoves = gameBoard.findMoves();
		if (allMoves.length == 0) {
			if (print) {console.log(0);}
			break;
		}
		if (gameBoard.getCurrentPlayer() == 2 && p2BabyBrain[gameBoard.toString()] === undefined) {
			let stringMoves = [];
			for (const move of allMoves) {
				stringMoves.push(move.toString());
			}
			p2BabyBrain[gameBoard.toString()] = stringMoves;
		}

		let randMove = randEl(allMoves);
		if (print) {console.log(randMove.prettify());}
		gameBoard = randMove;
		let winner = gameBoard.getWinner();
		if (winner != null) {
			if (print) {console.log(winner);}
			break;
		}
	}
}

for (var i = 0; i < 100; i++) {
	setUpBoard("white", "black");
	console.log(i);
}

console.log(p2BabyBrain);
const keys = Object.keys(p2BabyBrain);
const parent = new Board();
parent.fromString(keys[0]);
console.log(parent.prettify());

for (const string of p2BabyBrain[keys[0]]) {
	const child = new Board();
	child.fromString(string);
	console.log(child.prettify());
}
