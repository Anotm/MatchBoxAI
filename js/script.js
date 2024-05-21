var gameBoard = new Board();
var userHistory = [];
var playedMove = [];
var p2BabyBrain = {};
var p2BigBrain = {
	"002012000": [ "000022000", "002010002" ],
	"002111000": [],
	"002122000": [ "002102020", "002120002" ],
	"002210000": [ "000220000", "002010200" ],
	"002221000": [ "002021200", "002201020" ],
	"020021000": [ "000022000", "020001020" ],
	"020112000": [ "020110002" ],
	"020120000": [ "000220000", "020100020" ],
	"020211000": [ "020011200" ],
	"022010001": [ "020012001" ],
	"022010100": [ "020012100" ],
	"022021100": [ "002022100" ],
	"022101100": [ "002201100" ],
	"022120001": [ "002220001", "022100002", "022100021" ],
	"022211100": [],
	"200012000": [ "000022000", "200010002" ],
	"200111000": [],
	"200122000": [ "200102020", "200120002" ],
	"200210000": [ "000220000", "200010200" ],
	"200221000": [ "200021200", "200201020" ],
	"202001100": [ "002201100" ],
	"202011010": [ "002021010" ],
	"202012100": [ "002022100", "200022100" ],
	"202100001": [ "200102001" ],
	"202102010": [ "202100020", "202100012" ],
	"202110010": [ "200120010" ],
	"202201010": [ "202001020", "202001210" ],
	"202210001": [ "002220001", "200220001", "202010201" ],
	"220010001": [ "020210001" ],
	"220010100": [ "020210100" ],
	"220021100": [ "200022100" ],
	"220101001": [ "200102001" ],
	"220112001": [],
	"220120001": [ "200220001", "220100002", "220100021" ],
	"222001110": [ "202002110" ],
	"222010101": [ "022020101", "220020101" ],
	"222100011": [ "202200011" ]
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function p2Add(key, value) {
	if (p2BabyBrain[key] === undefined) {
		$("div.game-UI > div.p2").append('<div class="entry" id='+key+' onclick="popUp(this.id)"></div>');
		$("div.game-UI > div.p2 > div.entry#"+key).append('<div class="key">"' + key + '"</div>:');
		$("div.game-UI > div.p2 > div.entry#"+key).append('<div class="values"></div>');
	}
	p2BabyBrain[key] = value;
	$("div.game-UI > div.p2 > div.entry#"+key+" > div.values").empty();
	const values = $("div.game-UI > div.p2 > div.entry#"+key+" > div.values");
	for (const el of p2BabyBrain[key]) {
		values.append('<div class="value" id="'+el+'">"' + el + '"</div>');
	}
	await sleep(10);
}

async function p2Remove(key, value) {
	const print = false;
	if (print) console.log(prettify(key) +  "\n" + prettify(value));
	if (p2BabyBrain[key] !== undefined) {
		var i = 0;
		let newList = []
		for (const el of p2BabyBrain[key]) {
			if (el != value) newList.push(el);
		}
		$("div.entry#"+key+" > div.values > div.value#"+value).remove();
		p2BabyBrain[key] = newList;
	}
	await sleep(10);
}

function randEl(list) {
	return list[Math.floor(Math.random()*list.length)];
}

async function p2SetWinners() {
	const print = false;
	let keys = Object.keys(p2BabyBrain);

	for (const key of keys) {
		let newList = [];
		for (const string of p2BabyBrain[key]) {
			let b = new Board();
			b.fromString(string);
			if (b.getWinner() == 2) newList.push(string);
		}
		if (newList.length != 0) {
			for (const string of p2BabyBrain[key]) {
				if (!newList.includes(string)) {
					p2Remove(key,string);
					if (print) console.log(prettify(string));
				}
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
	const print = true;
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

async function loadBigBrain() {
	p2BabyBrain = {};
	$("div.game-UI > div.p2").empty();
	let keys = Object.keys(p2BigBrain);
	for (key of keys) {
		await p2Add(key, p2BigBrain[key]);
	}
}

async function p2TeachBabyBrain() {
	const test = true;
	$("div.game-UI > div.p2").empty();
	p2BabyBrain = {};

	for (var i = 0; i < 1000; i++) {
		console.log("--------------------------")
		gameBoard = new Board();
		await playCC1();
	}

	p2SetWinners();

	if (test) {
		winners = [0,0,0]

		for (var i = 0; i < 100; i++) {
			console.log("--------------------------")
			gameBoard = new Board();
			win = await playCC2();
			winners[win]++;
		}
		console.log(winners);
	}
}

function paintBoard() {
	const print = false;
	const string = gameBoard.toString();
	if (print) console.log(string);

	for (cell of $("div.cell.p1")) $(cell).removeClass("p1");
	for (cell of $("div.cell.p2")) $(cell).removeClass("p2");

	for (var i = 0; i < string.length; i++) {
		const chr = string[i];
		if (chr == "1" || chr == "2") {
			$("div.cell#" + i).addClass("p" + chr);
		}
	}
}

function validPlayedMove() {
	const print = false;
	if (print) console.log(playedMove);
	// check if clicked on same tile
	if (playedMove[0][0] == playedMove[1][0] && playedMove[0][1] == playedMove[1][1]) {
		if (print) console.log("invalid");
		return false;
	}
	// check if direction/distance is valid
	if (playedMove[1][1]-playedMove[0][1] != -1) {
		if (print) console.log("invalid");
		return false;
	}

	const space = gameBoard.get(playedMove[1]);

	// check if peice blocking straigh path
	if (playedMove[0][0] == playedMove[1][0] && space != null) {
		if (print) console.log("invalid");
		return false;
	}
	// check if peice can capture
	if (Math.abs(playedMove[0][0]-playedMove[1][0]) == 1 && (space == null || space.getPlayerNumber() == 1)) {
		if (print) console.log("invalid");
		return false;
	}

	if (print) console.log("valid");
	return true;
}

function setWinnerOverlay(winner) {
	$("div.board > div.overlay").show();
	$("div.board > div.overlay > *").show();
	$("div.board > div.overlay > p").text("Winner: P" + winner);
	$("div.board > div.overlay > button").click(refreshBoard);
	$("div.board > div.overlay > button").text("Refresh");
}

function refreshBoard() {
	gameBoard = new Board();
	setUpBoard();
	paintBoard();
	$("div.board > div.overlay").hide();
}

function enableButtons(MT,AT,LT) {
	$("#MT-btn").attr("disabled", !MT);
	$("#AT-btn").attr("disabled", !AT);
	$("#LT-btn").attr("disabled", !LT);
}

async function cellClick(id) {
	playedMove.push([id%3, Math.floor(id/3)]);
	$("div.cell#" + id).addClass("cellClicked");
	await sleep(100);

	if (playedMove.length == 2) {
		if (validPlayedMove()) {
			gameBoard.move(playedMove[0],playedMove[1]);
			userHistory.push(gameBoard.toString());

			await sleep(100);

			for (const cell of $("div.cell")) $(cell).removeClass("cellClicked");
			playedMove = [];
			paintBoard();

			await sleep(300);

			winner = gameBoard.getWinner();
			if (winner != 0 && winner != null) {
				console.log(winner);
				if (winner == 1 || winner == 0) { // remove loosing move from p2
					let offset = (gameBoard.getCurrentPlayer() == 1) ? 2 : 1;
					let key = userHistory[userHistory.length-offset-1];
					let value = userHistory[userHistory.length-offset];
					await p2Remove(key, value);
					if (p2BabyBrain[key] != undefined && p2BabyBrain[key].length == 0) {
						let key = userHistory[userHistory.length-offset-3];
						let value = userHistory[userHistory.length-offset-2];
						await p2Remove(key, value);
					}
				}
				userHistory = [];
				setWinnerOverlay(winner);
				return;
			}

			const notInP2Brain = p2BabyBrain[gameBoard.toString()] === undefined;

			if (notInP2Brain) {
				let stringMoves = [];
				let allMoves = gameBoard.findMoves();
				for (const move of allMoves) {
					stringMoves.push(move.toString());
				}
				await p2Add(gameBoard.toString(), stringMoves);
				p2SetWinners();
			}

			nextMove = randEl(p2BabyBrain[gameBoard.toString()]);
			// console.log(nextMove);
			gameBoard.fromString(nextMove);
			gameBoard.setCurrentPlayer(2);
			userHistory.push(gameBoard.toString());
			paintBoard();
			
			await sleep(100);
		}
		for (const cell of $("div.cell")) $(cell).removeClass("cellClicked");
		playedMove = [];
		paintBoard();

		winner = gameBoard.getWinner();
		if (winner != 0 && winner != null) {
			if (winner == 1 || winner == 0) { // remove loosing move from p2
				let offset = (gameBoard.getCurrentPlayer() == 1) ? 2 : 1;
				let key = userHistory[userHistory.length-offset-1];
				let value = userHistory[userHistory.length-offset];
				await p2Remove(key, value);
				if (p2BabyBrain[key].length == 0) {
					let key = userHistory[userHistory.length-offset-3];
					let value = userHistory[userHistory.length-offset-2];
					await p2Remove(key, value);
				}
			}
			userHistory = [];
			setWinnerOverlay(winner);
			return;
		}
	}
}

function popUp(id) {
	window.d1.showModal();
}

async function btnMT(){
	enableButtons(false,false,false);
	p2BabyBrain = {};
	$("div.game-UI > div.p2").empty();
	gameBoard = new Board();
	setUpBoard();
	paintBoard();
	enableButtons(false,true,true);
}

async function btnAT(){
	enableButtons(false,false,false);
	$("div.board > div.overlay").show();
	$("div.board > div.overlay > p").show();
	$("div.board > div.overlay > p").text("Training...");
	await p2TeachBabyBrain();
	gameBoard = new Board();
	setUpBoard();
	paintBoard();
	$("div.board > div.overlay").hide();
	enableButtons(true,false,true);
}

async function btnLT(){
	enableButtons(false,false,false);
	$("div.board > div.overlay").show();
	$("div.board > div.overlay > p").show();
	$("div.board > div.overlay > p").text("Loading...");
	gameBoard = new Board();
	setUpBoard();
	await loadBigBrain();
	paintBoard();
	$("div.board > div.overlay").hide();
	enableButtons(true,true,false);
}

async function run() {
	await btnLT();
}

run();