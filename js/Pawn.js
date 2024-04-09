class Pawn {
	constructor (color, playerNum, x, y) {
		this.playerNum = playerNum;
		this.x = x;
		this.y = y;
		this.color = color;
		this.moves[];
	}

	getPlayerNumber() {
		return this.playerNum;
	}

	getCoordinates() {
		return [this.x, this.y]
	}

	setCoordinates([x,y]) {
		this.x = x;
		this.y = y;
	}

	findMoves() {

	}
}