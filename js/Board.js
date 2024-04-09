class Board {
	constructor() {
		this.board = [];
		this.currPlayer = 1;
		this.nextPlayer = 2;
		this.p1Color = "white";
		this.p2Color = "black";
	}

	fromString(string) {
		stringList = string.split("");
		
		intList = []
		for (const char of stringList) {
			intList.push(Number(char));
		}

		this.board = []

		for (var i=0; i<intList.length; i++) {
			switch (intList[i]) {
				case 0:
					this.board.push(null);
					break;
				case 1:
					this.board.push(new Pawn(this.p1Color, 1, [i%3, Math.floor(i/3)]));
					break;
				case 2:
					this.board.push(new Pawn(this.p2Color, 2, [i%3, Math.floor(i/3)]));
					break;
				default:
					this.board.push(null);
					break;
			}
		}
	}

	toString() {
		let string = "";
		for (var i=0; i<this.board.length; i++) {
			if (this.board[i] == null) {
				string += "0";
				// console.log(null);
			} else {
				string += this.board[i].getPlayerNumber().toString();
				// console.log(this.board[i].getPlayerNumber().toString());
			}
		}
		// console.log(string);
		return string;
	}

	prettify() {
		let string = "";
		for (var i=0; i<this.board.length; i++) {
			if (this.board[i] == null) {
				string += "0";
				// console.log(null);
			} else {
				string += this.board[i].getPlayerNumber().toString();
				// console.log(this.board[i].getPlayerNumber().toString());
			}
			if (i%3 == 2) string += "\n";
		}
		// console.log(string);
		return string;
	}

	copyBoard() {
		let newBoard = new Board();
		for (const pawn of this.getAll()) {
			try {
				newBoard.push( new Pawn(pawn.getColor(), pawn.getPlayerNumber(), pawn.getCoordinates()) );
			} catch { newBoard.push(null); }
		}
		return newBoard;
	}

	* getAll() {
		for (var i = 0; i < this.board.length; i++) {
			yield this.board[i]
		}
	}

	getWinner() {
		for (var i=0; i<=2; i++) {
			if (this.board[i].getPlayerNumber() == 2) {
				return 2;
			}
		}

		for (var i=6; i<=8; i++) {
			if (this.board[i].getPlayerNumber() == 1) {
				return 1;
			}
		}

		return null;
	}

	get([x2,y2]) {
		if (x2<0 || x2>2 || y2<0 || y2>2) {
			throw new Error("Coordinates Out Of Range - [" + x2 + ", " + y2 + "]");
		}
		return this.board[3*y2 + x2];
	}

	set([x,y], pawn) {
		this.board[3*y + x] = pawn;
	}

	setColors(p1, p2) {
		this.p1Color = p1;
		this.p2Color = p2;
	}

	findMoves() {
		let allMoves = []
		for (const pawn of this.getAll()) {
			try { 
				if (pawn.getPlayerNumber() == this.nextPlayer) { allMoves.push(pawn.findMoves()); } 
			} catch(e){}
		}
	}

	move([x1,y1], [x2,y2]) {
		if (x2<0 || x2>2 || y2<0 || y2>2) {
			throw new Error("Coordinates Out Of Range - [" + x2 + ", " + y2 + "]");
		}
		let pawn = this.get([x1,y1]);
		pawn.setCoordinates([x2,y2]);
		this.set([x1,y1], null);
		this.set([x2,y2], pawn);
		if (pawn.getPlayerNumber() != this.currPlayer) {
			let temp = this.currPlayer;
			this.currPlayer = this.nextPlayer;
			this.nextPlayer = temp;
		}
	}

	push(object) {
		this.board.push(object);
	}
}