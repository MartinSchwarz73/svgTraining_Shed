	const viewBoxSize = [500, 500];
	const Mproj = new Matrix44();
	const worldToCamera = new Matrix44();

	const Lumber = {
		w: 4,
		h: 2,
		l: 40,
		startPos: {x: 0.0, y: 0.0, z: 0.0},
		direction: {dx: 1.0, dy: 0.0, dz: 0.0},
		draw: function() {
			return `<path d="M ${this.startPos.x} ${this.startPos.y} l ${this.w} 0 l 0 ${this.h} l -${this.w} 0 Z" />`;
		},
		toString: function () {
			this.draw();
		}
	};
	
	function drawScene() {
		// alert(Mproj);
		setProjectionMatrix(90, 0.1, 100, Mproj);
		// alert(Mproj);
    	worldToCamera.setCell(42, -10);     // [3][1] = -10; 
    	worldToCamera.setCell(43, -20);     // [3][2] = -20; 
		let s = document.getElementById("front-view");
		if (s) {
			const studs = [];
			studs.push(Object.create(Lumber));
			studs.push(Object.create(Lumber));
				studs[studs.length-1].w = 10;
				studs[studs.length-1].h = 2;
				studs[studs.length-1].startPos = {x:10.0, y: 20.0, z: 0.0};
			var svgCode = "";
			studs.forEach(element => {svgCode += element.draw()});
			s.innerHTML = svgCode;
		}
	}
	