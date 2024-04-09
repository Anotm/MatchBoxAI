class Board {
	constructor() {
		this.board=[];
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

	get(x,y) {
		return this.board[3*y + x];
	}

	set([x,y], pawn) {
		this.board[3*y + x] = pawn;
	}

	move([x1,y1], [x2,y2]) {
		let pawn = get([x1,y1]);
		pawn.setCoordinates([x2,y2]);
		pawn.findMoves();
		set([x2,y2], pawn);
	}

	push(object) {
		this.board.push(object);
	}
}