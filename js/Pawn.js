class Pawn {
	constructor (color, playerNum, [x, y]) {
		this.playerNum = playerNum;
		this.x = x;
		this.y = y;
		this.color = color;
		this.moves = [];
	}

	getPlayerNumber() {
		return this.playerNum;
	}

	getCoordinates() {
		return [this.x, this.y]
	}

	getColor() {
		return this.color;
	}

	setCoordinates([x,y]) {
		this.x = x;
		this.y = y;
	}

	findMoves() {
		let newMoves = [];
		// console.log();
		// console.log(this.getCoordinates());
		var copy1 = gameBoard.copyBoard();
		var copy2 = gameBoard.copyBoard();
		var copy3 = gameBoard.copyBoard();
		let yMove = (this.playerNum == 1) ? this.y-1 : this.y+1;
		try {
			if (copy1.get([this.x-1, yMove]).getPlayerNumber() != this.playerNum) {
				copy1.move(this.getCoordinates(), [this.x-1, yMove]);
				newMoves.push(copy1);
				// console.log(copy1.prettify());
			}
		} catch (error) { /*console.log(error);*/ }

		try {
			if (copy2.get([this.x+1, yMove]).getPlayerNumber() != this.playerNum) {
				copy2.move(this.getCoordinates(), [this.x+1, yMove]);
				newMoves.push(copy2);
				// console.log(copy2.prettify());
			}
		} catch (error) { /*console.log(error);*/ }

		if (copy3.get([this.x, yMove]) == null) {
			copy3.move(this.getCoordinates(), [this.x, yMove]);
			newMoves.push(copy3);
			// console.log(copy3.prettify());
		}
		this.moves = newMoves;
		return newMoves;
	}
}