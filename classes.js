// JavaScript Document

// vertice or vector 3D
class Vert3D {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	set value(v) { // setter, v = {x:, y:, z:}
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	get value() { // getter
		return this;
	}

	duplicate() { // duplicate me
		return new Vert3D(this.x, this.y, this.z);
	}

	cross(v) { // cross products of two vectors me x v, returns new vector
		const r = new Vert3D();
		r.x = this.y * v.z - this.z * v.y;
		r.y = this.z * v.x - this.x * v.z;
		r.z = this.x * v.y - this.y * v.x;
		return r;
	}

	normalize() { // convert to unit vector (save direction but length = 1)
		let n = this.x * this.x + this.y * this.y + this.z * this.z;
		if (n > 0) {
			let factor = 1 / Math.sqrt(n);
			this.x *= factor, this.y *= factor, this.z *= factor;
		}
		return this;
	}

	multByMatrix(m) { // multiplication Vect (me) x matrix (m)
		let tmp = new Vert3D();

		tmp.x = this.x * m.getCell(0, 0) + this.y * m.getCell(1, 0) + this.z * m.getCell(2, 0);
		tmp.y = this.x * m.getCell(0, 1) + this.y * m.getCell(1, 1) + this.z * m.getCell(2, 1);
		tmp.z = this.x * m.getCell(0, 2) + this.y * m.getCell(1, 2) + this.z * m.getCell(2, 2);
		// var w = this.x * m.getCell(14) + this.y * m.getCell(24) + this.z * m.getCell(34) +  M.getCell(44); 

		// normalize if w is different than 1 (convert from homogeneous to Cartesian coordinates)
		/* if (w != 1) { 
			outP.x /= w; 
			outP.y /= w; 
			outP.z /= w; 
		} */
		this.x = tmp.x;
		this.y = tmp.y;
		this.z = tmp.z;

		return this;
	}

	toString() {
		return `[${this.x.toFixed(2)},${this.y.toFixed(2)},${this.z.toFixed(2)}]`;
	}
}

// matrix 3x3
class Matrix33 {
	constructor() {
		this.m = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
	}

	set cells(abr) { //setter - abr = [Vert3D, Vert3D, Vert3D]
		this.m[0][0] = abr[0]['x'];
		this.m[1][0] = abr[0]['y'];
		this.m[2][0] = abr[0]['z'];
		this.m[0][1] = abr[1]['x'];
		this.m[1][1] = abr[1]['y'];
		this.m[2][1] = abr[1]['z'];
		this.m[0][2] = abr[2]['x'];
		this.m[1][2] = abr[2]['y'];
		this.m[2][2] = abr[2]['z'];
	}

	get cells() { // getter
		return this.m;
	}

	setCell(r, c, v) { // set one cell r=row, c=column, v=value
		this.m[r][c] = v;
	}

	getCell(r, c) { // return one cell r=row, c=column
		return this.m[r][c];
	}

	multiply(m) { // matrix33 x matrix33, this.m x m, return new matrix
		let mm = new Matrix33();
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				mm.setCell(i, j,
					this.m[i][0] * m.getCell(0, j)
					+ this.m[i][1] * m.getCell(1, j)
					+ this.m[i][2] * m.getCell(2, j));
			}
		}
		return mm;
	}

	transpose() { // return new matrix33 - transposed this.m
		let tm = new Matrix33();
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				tm.setCell(i, j, this.m[j][i]);
			}
		}
		return tm;
	}
}

// matrix 4x4
class Matrix44 {

	constructor() {
		this.m = [
			[1.0, 0.0, 0.0, 0.0],
			[0.0, 1.0, 0.0, 0.0],
			[0.0, 0.0, 1.0, 0.0],
			[0.0, 0.0, 0.0, 1.0]
		];
	}

	set cells(arr) { // setter - arr[16]
		this.m[0] = [arr[0], arr[1], arr[2], arr[3]];
		this.m[1] = [arr[4], arr[5], arr[6], arr[7]];
		this.m[2] = [arr[8], arr[9], arr[10], arr[11]];
		this.m[3] = [arr[12], arr[13], arr[14], arr[15]];
	}

	get cells() { // getter
		return this.m;
	}

	getCell(cell) { // get one cell - cell is string "rc" (row column) 1..4 1..4
		if (cell.constructor.name !== 'String') { // if the cell is not a String maybe is a Number
			if (cell.constructor.name === 'Number') cell = cell.toString(); // if it's a Number change it into String
			else return null; // else cell has bad format
		}
		cell = cell.slice(0, 2); // we need only 2 numbers
		if (cell.length != 2 || cell.match(/[1-4]/g) == null) return null; // get 2 coords ? and are they 1..4 ?
		if (cell.match(/[1-4]/g).length != 2) return null; // both coords must be 1..4
		let row = parseInt(cell.slice(0, 1)) - 1; // coords are 1..4, but array is 0..3 
		let col = parseInt(cell.slice(-1)) - 1;
		return this.m[row][col];
	}

	setCell(cell, value) { // set one cell - cell is string "rc" (row column) 1..4
		if (cell.constructor.name !== 'String') { // if the cell is not a String maybe is a Number
			if (cell.constructor.name === 'Number') cell = cell.toString(); // if it's a Number change it into String
			else return null; // else cell has bad format
		}
		cell = cell.slice(0, 2); // we need only 2 numbers
		if (cell.length != 2 || cell.match(/[1-4]/g) == null) return null; // get 2 coords ? and are they 1..4 ?
		if (cell.match(/[1-4]/g).length != 2) return null; // both coords must be 1..4
		let row = parseInt(cell.slice(0, 1)) - 1; // coords are 1..4, but array is 0..3 
		let col = parseInt(cell.slice(-1)) - 1;
		this.m[row][col] = value;
		return value;
	}

	multiply(m) { // matrix44 x matrix44, this.m x m, return new matrix
		const mm = new Matrix44();
		for (let i = 0; i < 4; ++i) {
			for (let j = 0; j < 4; ++j) {
				mm[i][j] = this.m[i][0] * m[0][j] + this.m[i][1] * m[1][j]
					+ this.m[i][2] * m[2][j] + this.m[i][3] * m[3][j];
			}
		}
		return mm;
	}

	toString() {
		var s = `[${this.m[0][0]}][${this.m[0][1]}][${this.m[0][2]}][${this.m[0][3]}]\n`;
		s += `[${this.m[1][0]}][${this.m[1][1]}][${this.m[1][2]}][${this.m[1][3]}]\n`;
		s += `[${this.m[2][0]}][${this.m[2][1]}][${this.m[2][2]}][${this.m[2][3]}]\n`;
		s += `[${this.m[3][0]}][${this.m[3][1]}][${this.m[3][2]}][${this.m[3][3]}]\n`;
		return s;
	}
}


class Stud {
	constructor(w = 4, h = 2, l = 100, rot = false, color = "black") {
		this.w = w; // w x h is base
		this.h = h;
		this.l = l; // l =  stud's length
		this.rot = rot; // rotate stud ?
		this.color = color; // pen color
		this.startPos = new Vert3D(0, 0, 0); // start position
		this.direction = new Vert3D(1, 1, 0); // scene direction = 45deg CW
		this.vertices = []; //array of Vert3D - real scene coords
		this.edges = [
			[0, 1, 2, 3, true],
			[4, 5, 6, 7, true],
			[0, 4, false],
			[1, 5, false],
			[2, 6, false],
			[3, 7, false]
		]; // how to draw object
		// edges = [MoveToVect, ...LineToVect, close_path]
	}

	calcVertices() { // fill the vertices array
		if (this.vertices.length == 0) {
			vectR.value = {
				x: 0.0,
				y: 1.0,
				z: 0.0
			}; // rot around Y axis
			angleOfRot = Math.atan(-this.direction.y / this.direction.x);
			setRotMatrix();

			let tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z); // [0] 1st base
			this.vertices.push(tmpVert); // save point in the array

			if (!this.rot) { // rotate stud or no ?
				tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y, this.startPos.z); //[1]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y, this.startPos.z + this.h); //[2]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + this.h); //[3] end of 1st base
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.l, this.startPos.z); //[4] 2nd base
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y + this.l, this.startPos.z); //[5]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y + this.l, this.startPos.z + this.h); //[6]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.l, this.startPos.z + this.h); //[7]
				this.vertices.push(tmpVert);
			} else {
				tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y, this.startPos.z); //[1]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y, this.startPos.z + this.w); //[2]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + this.w); //[3] end of 1st base
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.l, this.startPos.z); //[4] 2nd base
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y + this.l, this.startPos.z); //[5]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y + this.l, this.startPos.z + this.w); //[6]
				this.vertices.push(tmpVert);
				tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.l, this.startPos.z + this.w); //[7]
				this.vertices.push(tmpVert);
			}
			this.vertices.forEach(v => { // calc the real vert position in the scene
				v.multByMatrix(rotMatrix);
			});

		}
	}

	cornerStud(refPoint) {
		// corner stud is a new stud, copy of "this", but rotated and placed to the reference point
		let tmpStud = new Stud(this.w, this.h, this.l, !this.rot, this.color);
		switch (refPoint) {
			case 0:
				tmpStud.startPos = {
					x: this.startPos.x - this.w,
					y: this.startPos.y,
					z: this.startPos.z
				};
				break;
			case 1:
				tmpStud.startPos = {
					x: this.startPos.x - this.w,
					y: this.startPos.y,
					z: this.startPos.z + this.w - this.h
				};
				break;
			case 2:
				tmpStud.startPos = {
					x: this.startPos.x + this.h,
					y: this.startPos.y,
					z: this.startPos.z + this.w - this.h
				};
				break;
			case 3:
				tmpStud.startPos = {
					x: this.startPos.x + this.h,
					y: this.startPos.y,
					z: this.startPos.z
				};
				break;
		}
		return tmpStud;
	}

	getVertices() {
		this.calcVertices();
		return this.vertices;
	}


	toString() {
		this.calcVertices();
		return `Vertices:\n${this.vertices}`;
	}
}

class SillPlate extends Stud {
	// sill plate is lying stud, so we need only new calcVertices method
	calcVertices() {
		this.vertices.length = 0; // empty array
		let alpha = Math.atan(this.direction.y / this.direction.x);
		vectR.value = {
			x: 0.0,
			y: 1.0,
			z: 0.0
		}; // rot around Y axis
		angleOfRot = Math.atan(-this.direction.y / this.direction.x);
		setRotMatrix();
		let tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z); // [0] 1st base
		this.vertices.push(tmpVert);

		if (!this.rot) {
			tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y, this.startPos.z); //[1]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y + this.h, this.startPos.z); //[2]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.h, this.startPos.z); //[3] end of 1st base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + this.l); //[4] 2nd base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y, this.startPos.z + this.l); //[5]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.w, this.startPos.y + this.h, this.startPos.z + this.l); //[6]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.h, this.startPos.z + this.l); //[7]
			this.vertices.push(tmpVert);
		} else {
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + this.w); //[1]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.h, this.startPos.z + this.w); //[2]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.h, this.startPos.z); //[3] end of 1st base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y, this.startPos.z); //[4] 2nd base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y, this.startPos.z + this.w); //[5]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y + this.h, this.startPos.z + this.w); //[6]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y + this.h, this.startPos.z); //[7]
			this.vertices.push(tmpVert);
		}

		this.vertices.forEach(v => { // calc the real vert position in the scene
			v.multByMatrix(rotMatrix);
		});
	}
}

class TopPlate extends SillPlate {
	// top plates are the same as sill plates, but we need both classes for the material list
	calcVertices() {
		super.calcVertices();
	}
}

class RidgeBoard extends Stud {
	// ridge board is a horizontal stud and his width = rafter width + 2" (at least +2" in reality)
	constructor(w = 4, h = 2, l = 100, rot = false, color = "black") {
		super(w + 2, h, l, rot, color);
	}

	calcVertices() {
		this.vertices.length = 0; // empty array
		let alpha = Math.atan(this.direction.y / this.direction.x);
		vectR.value = {
			x: 0.0,
			y: 1.0,
			z: 0.0
		}; // rot around X axis
		angleOfRot = Math.atan(-this.direction.y / this.direction.x); //40 / 180 * Math.PI;	
		setRotMatrix();
		let tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z); // [0] 1st base
		this.vertices.push(tmpVert);

		if (!this.rot) {
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + this.h); //[1]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.w, this.startPos.z + this.h); //[2]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.w, this.startPos.z); //[3] end of 1st base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y, this.startPos.z); //[4] 2nd base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y, this.startPos.z + this.h); //[5]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y + this.w, this.startPos.z + this.h); //[6]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y + this.w, this.startPos.z); //[7]
			this.vertices.push(tmpVert);
		} else {
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + this.h); //[1]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.w, this.startPos.z + this.h); //[2]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y + this.w, this.startPos.z); //[3] end of 1st base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y, this.startPos.z); //[4] 2nd base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y, this.startPos.z + this.h); //[5]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y + this.w, this.startPos.z + this.h); //[6]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.l, this.startPos.y + this.w, this.startPos.z); //[7]
			this.vertices.push(tmpVert);
		}

		this.vertices.forEach(v => { // calc the real vert position in the scene
			v.multByMatrix(rotMatrix);
		});
	}
}

class Rafter extends Stud {
	// rafter is a sloping stud with mitered ends and overhang
	constructor(w = 4, h = 2, l = 100, rot = false, color = "black", pitch = 8, ridge = 2, overhang = 10) {
		super(w, h, l, rot, color); // call Stud constructor
		this.pitch = parseInt(pitch); // roof pitch tells you how many inches the roof rises for every 12 inches in depth
		this.ridge = ridge; // ridge board width - we need to know that because the rafters lie on the ridge board
		this.overhang = parseInt(overhang); // overhang is part of rafter outside of building
	}

	calcVertices() {
		this.vertices.length = 0; // empty array
		let alpha = Math.atan(this.pitch / 12);
		vectR.value = {
			x: 0.0,
			y: 1.0,
			z: 0.0
		}; // rot around Y axis

		angleOfRot = Math.atan(-this.direction.y / this.direction.x);
		setRotMatrix();
		let halfOfRidge = this.ridge / 2;
		let miteredEdge = this.w / Math.cos(alpha);
		let totalRise = (this.l + this.overhang) * Math.sin(alpha);
		let totalRun = (this.l + this.overhang) * Math.cos(alpha);

		let tmpVert = new Vert3D(this.startPos.x, this.startPos.y, this.startPos.z + halfOfRidge); // [0] 1st base
		this.vertices.push(tmpVert);

		if (!this.rot) {
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y, this.startPos.z + halfOfRidge); //[1]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y - miteredEdge, this.startPos.z + halfOfRidge); //[2]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y - miteredEdge, this.startPos.z + halfOfRidge); //[3] end of 1st base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y - totalRise + 2 * miteredEdge / 3, this.startPos.z + totalRun); //[4] 2nd base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y - totalRise + 2 * miteredEdge / 3, this.startPos.z + totalRun); //[5]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y - totalRise - miteredEdge / 3, this.startPos.z + totalRun); //[6]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y - totalRise - miteredEdge / 3, this.startPos.z + totalRun); //[7]
			this.vertices.push(tmpVert);
		} else {
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y, this.startPos.z - halfOfRidge); //[1]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y - miteredEdge, this.startPos.z - halfOfRidge); //[2]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y - miteredEdge, this.startPos.z - halfOfRidge); //[3] end of 1st base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y - totalRise + 2 * miteredEdge / 3, this.startPos.z - totalRun); //[4] 2nd base
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y - totalRise + 2 * miteredEdge / 3, this.startPos.z - totalRun); //[5]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x + this.h, this.startPos.y - totalRise - miteredEdge / 3, this.startPos.z - totalRun); //[6]
			this.vertices.push(tmpVert);
			tmpVert = new Vert3D(this.startPos.x, this.startPos.y - totalRise - miteredEdge / 3, this.startPos.z - totalRun); //[7]
			this.vertices.push(tmpVert);
		}

		this.vertices.forEach(v => { // calc the real vert position in the scene
			v.multByMatrix(rotMatrix);
		});

	}
}
