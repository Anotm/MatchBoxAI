var $dCanvas = $('#d1 > #dialogCanvas');

// console.log($myCanvas);

// rectangle shape 
$dCanvas.drawRect({
  fillStyle: '#555',
  strokeWidth: 0,
  x: 0, y: 0,
  fromCenter: false,
  width: 50,
  height: 50
});

$dCanvas.drawRect({
  fillStyle: '#eee',
  strokeWidth: 0,
  x: 0, y: 0,
  fromCenter: false,
  width: 50,
  height: 50
});

for (var i=0; i<9; i++) {
	if (i%2 == 0 ) { // even
		$dCanvas.drawRect({
			fillStyle: '#555',
			strokeWidth: 0,
			x: 0, y: 0,
			fromCenter: false,
			width: 50,
			height: 50
		});
	} else {		 // odd

	}
}

function popUp(id) {
	window.d1.showModal();
}