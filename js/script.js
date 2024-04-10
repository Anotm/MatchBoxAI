var p1BabyBrain = {};
var p2BabyBrain = {};
var gameBoard = new Board();

function remove(dic, key, value) {
	var i = 0;
	let newList = []
	for (const el of dic[key]) {
		if (el != value) newList.push(el);
	}
	dic[key] = newList;
}

function randEl(list) {
	return list[Math.floor(Math.random()*list.length)];
}

function setWinners(dic, player) {
	let keys = Object.keys(dic);

	for (const key of keys) {
		let newList = [];
		for (const string of dic[key]) {
			let b = new Board();
			b.fromString(string);
			if (b.getWinner() == player) newList.push(string);
		}
		if (newList.length != 0) dic[key] = newList;
	}
}

function prettify(string) {
	let newString = "";
	let stringList = string.split("");
	for (var i = 0; i < 9; i++) {
		newString += stringList[i];
		if (i%3==2) newString += "\n";
	}
	return newString;
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
}

function playCC1() {
	setUpBoard("white", "black");

	let history = [];
	const print = false;
	while (true) {
		let allMoves = gameBoard.findMoves();
		if (allMoves.length == 0) {
			if (print) console.log(0);
			break;
		}
		
		const isP2 = gameBoard.getNextPlayer() == 2;
		const isP1 = gameBoard.getNextPlayer() == 1;
		const notInP2Brain = p2BabyBrain[gameBoard.toString()] === undefined;
		const notInP1Brain = p1BabyBrain[gameBoard.toString()] === undefined;

		if (isP2 && notInP2Brain) {
			let stringMoves = [];
			for (const move of allMoves) {
				stringMoves.push(move.toString());
			}
			p2BabyBrain[gameBoard.toString()] = stringMoves;
		} else if (isP1 && notInP1Brain) {
			let stringMoves = [];
			for (const move of allMoves) {
				stringMoves.push(move.toString());
			}
			p1BabyBrain[gameBoard.toString()] = stringMoves;
		}

		let randMove = randEl(allMoves); // get the next move and set it
		if (print) console.log(prettify(randMove.toString()));
		gameBoard = randMove;
		history.push(gameBoard.toString());

		let winner = gameBoard.getWinner(); // check for win condition
		if (winner != null) {
			if (print) console.log(winner);
			if (winner == 1 || winner == 0) { // remove loosing move from p2
				let offset = (gameBoard.getCurrentPlayer() == 1) ? 2 : 1;
				let key = history[history.length-offset-1];
				let value = history[history.length-offset];
				remove(p2BabyBrain, key, value);
				if (p2BabyBrain[key].length == 0) {
					let key = history[history.length-offset-3];
					let value = history[history.length-offset-2];
					remove(p2BabyBrain, key, value);
				}
			}
			break;
		}
	}
}

function playCC2() {
	setUpBoard("white", "black");

	let history = [];
	const print = false;
	while (true) {
		const isP2 = gameBoard.getNextPlayer() == 2;
		let randMove = new Board();
		if (isP2) { // if P2 - get move from database
			if (p2BabyBrain[gameBoard.toString()] == undefined || p2BabyBrain[gameBoard.toString()].length == 0) {
				if (print) console.log(0);
				break;
			}
			randMove.fromString(randEl(p2BabyBrain[gameBoard.toString()]));
		} else { // if P1 - generate move
			let allMoves = gameBoard.findMoves();
			if (allMoves.length == 0) {
				if (print) console.log(0);
				break;
			}
			randMove = randEl(allMoves);
		}

		if (print) console.log(prettify(randMove.toString()));
		gameBoard = randMove;
		history.push(gameBoard.toString());

		let winner = gameBoard.getWinner(); // check for win condition
		if (winner != null) {
			if (print) console.log(winner);
			break;
		}
	}
}

for (var i = 0; i < 1000; i++) {
	console.log("--------------------------")
	playCC1();
}
console.log(p2BabyBrain);
setWinners(p2BabyBrain, 2);
console.log(p2BabyBrain);

for (var i = 0; i < 50; i++) {
	console.log("--------------------------")
	playCC2();
}