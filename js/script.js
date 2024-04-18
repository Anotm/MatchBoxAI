var p2BabyBrain = {};
var gameBoard = new Board();
var playedMove = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function p2Add(key, value) {
	if (p2BabyBrain[key] === undefined) {
		$("div.game-UI > div.p2").append('<div class="entry" id='+key+'></div>');
		$("div.game-UI > div.p2 > div.entry#"+key).append('<div class="key">"' + key + '"</div>:');
		$("div.game-UI > div.p2 > div.entry#"+key).append('<div class="values"></div>');
	}
	p2BabyBrain[key] = value;
	$("div.game-UI > div.p2 > div.entry#"+key+" > div.values").empty();
	for (const el of p2BabyBrain[key]) {
		$("div.game-UI > div.p2 > div.entry#"+key+" > div.values").append('<div class="value" id="'+el+'">"' + el + '"</div>');
	}
	await sleep(1);
}

async function p2Remove(key, value) {
	if (p2BabyBrain[key] !== undefined) {
		var i = 0;
		let newList = []
		for (const el of p2BabyBrain[key]) {
			if (el != value) newList.push(el);
		}
		$("div.entry#"+key+" > div.values > div.value#"+value).remove();
		p2BabyBrain[key] = newList;
	}
	await sleep(1);
}

function randEl(list) {
	return list[Math.floor(Math.random()*list.length)];
}

async function p2SetWinners() {
	let keys = Object.keys(p2BabyBrain);

	for (const key of keys) {
		let newList = [];
		for (const string of p2BabyBrain[key]) {
			let b = new Board();
			b.fromString(string);
			if (b.getWinner() != 2) newList.push(string);
		}
		if (newList.length != 0) {
			for (const string of p2BabyBrain[key]) {
				if (!newList.includes(string)) p2Remove(key,string);
			}
		}
	}
	// await sleep(1000);
	// paintP2Data();
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

async function playCC1() {
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
		const notInP2Brain = p2BabyBrain[gameBoard.toString()] === undefined;

		if (isP2 && notInP2Brain) {
			let stringMoves = [];
			for (const move of allMoves) {
				stringMoves.push(move.toString());
			}
			await p2Add(gameBoard.toString(), stringMoves);
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
				await p2Remove(key, value);
				if (p2BabyBrain[key].length == 0) {
					let key = history[history.length-offset-3];
					let value = history[history.length-offset-2];
					await p2Remove(key, value);
				}
			}
			break;
		}
	}
}

async function playCC2() {
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
				return 0;
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
			return winner;
			break;
		}
	}
}

function validPlayedMove() {
	console.log(playedMove);
	const print = true;
	if (playedMove[0][0] == playedMove[1][0] && playedMove[0][1] == playedMove[1][1]) {
		if (print) console.log("invalid");
		return false;
	}
	if (playedMove[1][1]-playedMove[0][1] != -1) {
		if (print) console.log("invalid");
		return false;
	}
	if (print) console.log("valid");
	return true;
}

async function cellClick(id) {
		playedMove.push([id%3, Math.floor(id/3)]);
		$("div.cell#" + id).addClass("cellClicked");
		await sleep(100);
		if (playedMove.length == 2) {
			validPlayedMove();
			for (const cell of $("div.cell")) {
				$(cell).removeClass("cellClicked");
			}
			playedMove = [];
		}
}



async function run() {
	$("div.game-UI > div.p2").empty();

	for (var i = 0; i < 10000; i++) {
		console.log("--------------------------")
		gameBoard = new Board();
		await playCC1();
		// await paintP2Data();
	}

	// console.log(p2BabyBrain);
	p2SetWinners();
	// console.log(p2BabyBrain);

	winners = [0,0,0]

	for (var i = 0; i < 1000; i++) {
		console.log("--------------------------")
		gameBoard = new Board();
		win = await playCC2();
		winners[win]++;
	}
	console.log(winners);
	gameBoard = new Board();
}

run();