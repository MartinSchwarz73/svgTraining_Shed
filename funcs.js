// JavaScript Document

//global vars
var viewBoxSize = [1000, 500]; // svg view box in px
var Mproj = new Matrix44(); // projection materix
var refreshMatList = true; // Do material list need be refreshed ?

var xRange = [9999, -9999]; // vars for drawing scene
var yRange = [9999, -9999];
var framing = []; // array of all shed framing elements
var studWidth = 4; // inches
var studHeight = 2; // inches
var studSpan = 40; // span = 40" or 60" OC (on center)
var shedWidth = 10 * 12; // 10x18' shed (shed dimensions are in feets > *12 in inches)
var shedLength = 18 * 12;
var shedHeight = 7 * 12; // 7' 
var roofPitch = 8; // 8/12
var roofOverhang = 10; // inches
var cameraPoints = []; // array for drawing scene
var horizontalShift = 100; // px
var verticalShift = 100; // px

var coorMatrix = new Matrix33(); // matrices for transformation of scene
var rotMatrix = new Matrix33();
var vectA = new Vert3D(0, 0, 0); // vectors for transformation - A any vector, B will be calculated 
var vectB = null;
var vectR = new Vert3D(0, 0, 0); // axis of rotation
var angleOfRot = 0; // angle of rotation in degrees


function setRotMatrix() { // calc rotMatrix
	if (vectR.x != 0 || vectR.y != 0) {
		vectA.value = {
			x: -vectR.y,
			y: vectR.x,
			z: 0
		};
	} else {
		vectA.value = {
			x: 1,
			y: 0,
			z: 0
		};
	}

	vectB = vectR.cross(vectA); // normal vector 

	coorMatrix.cells = [vectA, vectB, vectR];

	rotMatrix.cells = [
		// 	{x: parseFloat(Math.cos(angleOfRot).toFixed(5)), y: parseFloat(-Math.sin(angleOfRot).toFixed(5)), z: 0},
		{
			x: Math.cos(angleOfRot),
			y: -Math.sin(angleOfRot),
			z: 0
		},
		//	{x: parseFloat(Math.sin(angleOfRot).toFixed(5)), y: parseFloat(Math.cos(angleOfRot).toFixed(5)), z: 0},
		{
			x: Math.sin(angleOfRot),
			y: Math.cos(angleOfRot),
			z: 0
		},
		{
			x: 0,
			y: 0,
			z: 1
		}
	];

	rotMatrix = rotMatrix.multiply(coorMatrix.transpose());
	rotMatrix = coorMatrix.multiply(rotMatrix);
}


function drawScene() { // main fnc which create all framing elements and draw the scene
	setProjectionMatrix(90, 0.1, 100, Mproj);

	// read values from sliders and set vars
	studSpan = document.getElementById('StudSpan').innerHTML;
	shedWidth = parseInt(document.getElementById('ShedWidth').innerHTML) * 12; // feets to inches  (*12)
	shedLength = parseInt(document.getElementById('ShedLength').innerHTML) * 12;
	shedHeight = parseInt(document.getElementById('ShedHeight').innerHTML) * 12;
	roofPitch = document.getElementById('RoofPitch').innerHTML;
	roofOverhang = document.getElementById('Overhang').innerHTML;
	viewBoxSize = [1000 * parseInt(document.getElementById('zoomScene').innerHTML) * 0.01, 500];
	horizontalShift = document.getElementById('hShift').innerHTML;
	verticalShift = document.getElementById('vShift').innerHTML;
	xRange = [9999, -9999]; // must be reset for correct redraw
	yRange = [9999, -9999];


	let targetElement = document.getElementById("perspective-view"); // 
	var svgCode = "";

	if (targetElement) {
		framing.length = 0; // empty arrays 
		cameraPoints.length = 0;
		var zOfset = 500.0; // move real objects from zero to ...
		var yOfset = 130.0;
		var framingPart = null;
		var studLength = shedHeight - 3 * studHeight; // minus top plates - sill 

		// shed format - unnecessary object, only for testting
		//			framingPart = new Stud(shedLength*12, shedWidth*12, studLength + 3 * studHeight, false, "gray");	// + sill plate + double top plate
		//		framingPart.startPos = {x:0.0, y: 0.0, z: 0};
		//		framing.push(framingPart);

		// sill plates
		framingPart = new SillPlate(studWidth, studHeight, shedWidth - 2 * studWidth, false, "green");
		framingPart.startPos = {
			x: 0,
			y: 0,
			z: studWidth
		};
		framing.push(framingPart);
		framingPart = new SillPlate(studWidth, studHeight, shedWidth - 2 * studWidth, false, "green");
		framingPart.startPos = {
			x: shedLength - studWidth,
			y: 0,
			z: studWidth
		};
		framing.push(framingPart);
		framingPart = new SillPlate(studWidth, studHeight, shedLength, true, "green");
		framingPart.startPos = {
			x: 0,
			y: 0,
			z: 0
		};
		framing.push(framingPart);
		framingPart = new SillPlate(studWidth, studHeight, shedLength, true, "green");
		framingPart.startPos = {
			x: 0,
			y: 0,
			z: shedWidth - studWidth
		};
		framing.push(framingPart);

		// side walls
		var i = 1;
		var endLoop = false;

		framingPart = new Stud(studWidth, studHeight, studLength, true, "SaddleBrown");
		framingPart.startPos = {
			x: 0,
			y: studHeight,
			z: 0
		};
		framing.push(framingPart);
		framing.push(framingPart.cornerStud(2));

		framingPart = new Stud(studWidth, studHeight, studLength, true, "SaddleBrown");
		framingPart.startPos = {
			x: 0,
			y: studHeight,
			z: shedWidth - studWidth
		};
		framing.push(framingPart);
		framing.push(framingPart.cornerStud(3));

		while (!endLoop) {
			if ((shedLength - studHeight - studWidth) > i * studSpan) {
				framingPart = new Stud(studWidth, studHeight, studLength, true, "SaddleBrown");
				framingPart.startPos = {
					x: i * studSpan - 0.5 * studHeight,
					y: studHeight,
					z: 0
				};
				framing.push(framingPart);

				framingPart = new Stud(studWidth, studHeight, studLength, true, "SaddleBrown");
				framingPart.startPos = {
					x: i * studSpan - 0.5 * studHeight,
					y: studHeight,
					z: shedWidth - studWidth
				};
				framing.push(framingPart);

				i++;
			} else {
				framingPart = new Stud(studWidth, studHeight, studLength, true, "SaddleBrown");
				framingPart.startPos = {
					x: shedLength - studHeight,
					y: studHeight,
					z: 0
				};
				framing.push(framingPart);
				framing.push(framingPart.cornerStud(1));

				framingPart = new Stud(studWidth, studHeight, studLength, true, "SaddleBrown");
				framingPart.startPos = {
					x: shedLength - studHeight,
					y: studHeight,
					z: shedWidth - studWidth
				};
				framing.push(framingPart);
				framing.push(framingPart.cornerStud(0));

				endLoop = true;
			}
		}

		// front/back walls
		i = 0;
		endLoop = false;

		while (!endLoop) {
			if ((shedWidth - 2 * studWidth - studHeight) > (i * studSpan)) {
				framingPart = new Stud(studWidth, studHeight, studLength, false, "SaddleBrown");
				framingPart.startPos = {
					x: 0,
					y: studHeight,
					z: i * studSpan + studWidth
				};
				framing.push(framingPart);

				framingPart = new Stud(studWidth, studHeight, studLength, false, "SaddleBrown");
				framingPart.startPos = {
					x: shedLength - studWidth,
					y: studHeight,
					z: i * studSpan + studWidth
				};
				framing.push(framingPart);

				i++;
			} else {
				framingPart = new Stud(studWidth, studHeight, studLength, false, "SaddleBrown");
				framingPart.startPos = {
					x: 0,
					y: studHeight,
					z: shedWidth - studWidth - studHeight
				};
				framing.push(framingPart);

				framingPart = new Stud(studWidth, studHeight, studLength, false, "SaddleBrown");
				framingPart.startPos = {
					x: shedLength - studWidth,
					y: studHeight,
					z: shedWidth - studWidth - studHeight
				};
				framing.push(framingPart);

				endLoop = true;
			}
		}

		// top plates
		framingPart = new TopPlate(studWidth, studHeight, shedWidth - 2 * studWidth, false, "Sienna"); // front bottom
		framingPart.startPos = {
			x: 0,
			y: studLength + studHeight,
			z: studWidth
		}; //y: shedHeight + studHeight ... + sillplate
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedWidth - 2 * studWidth, false, "Sienna"); // back bottom
		framingPart.startPos = {
			x: shedLength - studWidth,
			y: studLength + studHeight,
			z: studWidth
		};
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedLength, true, "Sienna"); // left bottom
		framingPart.startPos = {
			x: 0,
			y: studLength + studHeight,
			z: 0
		};
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedLength, true, "Sienna"); // right bottom
		framingPart.startPos = {
			x: 0,
			y: studLength + studHeight,
			z: shedWidth - studWidth
		};
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedWidth, false, "Sienna"); // front top
		framingPart.startPos = {
			x: 0,
			y: studLength + 2 * studHeight,
			z: 0
		}; //y: shedHeight + studHeight ... + sillplate
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedWidth, false, "Sienna"); // back top
		framingPart.startPos = {
			x: shedLength - studWidth,
			y: studLength + 2 * studHeight,
			z: 0
		};
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedLength - 2 * studWidth, true, "Sienna"); // left top
		framingPart.startPos = {
			x: studWidth,
			y: studLength + 2 * studHeight,
			z: 0
		};
		framing.push(framingPart);
		framingPart = new TopPlate(studWidth, studHeight, shedLength - 2 * studWidth, true, "Sienna"); // right top
		framingPart.startPos = {
			x: studWidth,
			y: studLength + 2 * studHeight,
			z: shedWidth - studWidth
		};
		framing.push(framingPart);

		// ridge board
		var rafterRun = 0.5 * shedWidth;
		var rafterRise = roofPitch / 12 * rafterRun;
		framingPart = new RidgeBoard(studWidth, studHeight, shedLength, false, "brown");
		framingPart.startPos = {
			x: 0,
			y: shedHeight + rafterRise - framingPart.w,
			z: 0.5 * (shedWidth - studHeight)
		};
		framing.push(framingPart);

		// ridge board support
		framingPart = new Stud(studWidth, studHeight, framing[framing.length - 1].startPos.y - shedHeight, false, "SaddleBrown");
		framingPart.startPos = {
			x: 0,
			y: shedHeight,
			z: 0.5 * (shedWidth - studHeight)
		};
		framing.push(framingPart);

		framingPart = new Stud(studWidth, studHeight, framing[framing.length - 2].startPos.y - shedHeight, false, "SaddleBrown");
		framingPart.startPos = {
			x: shedLength - studWidth,
			y: shedHeight,
			z: 0.5 * (shedWidth - studHeight)
		};
		framing.push(framingPart);

		// rafters
		framingPart = new Rafter(studWidth, studHeight, Math.sqrt(rafterRise * rafterRise + rafterRun * rafterRun), false, "chocolate", roofPitch, studHeight, roofOverhang);
		framingPart.startPos = {
			x: 0,
			y: shedHeight + rafterRise,
			z: rafterRun
		};
		framing.push(framingPart);

		framingPart = new Rafter(studWidth, studHeight, Math.sqrt(rafterRise * rafterRise + rafterRun * rafterRun), true, "chocolate", roofPitch, studHeight, roofOverhang);
		framingPart.startPos = {
			x: 0,
			y: shedHeight + rafterRise,
			z: rafterRun
		};
		framing.push(framingPart);

		var i = 1;
		var endLoop = false;

		while (!endLoop) {
			if ((shedLength - studHeight) > i * studSpan) {
				framingPart = new Rafter(studWidth, studHeight, Math.sqrt(rafterRise * rafterRise + rafterRun * rafterRun), false, "chocolate", roofPitch, studHeight, roofOverhang);
				framingPart.startPos = {
					x: i * studSpan - 0.5 * studHeight,
					y: shedHeight + rafterRise,
					z: rafterRun
				};
				framing.push(framingPart);

				framingPart = new Rafter(studWidth, studHeight, Math.sqrt(rafterRise * rafterRise + rafterRun * rafterRun), true, "chocolate", roofPitch, studHeight, roofOverhang);
				framingPart.startPos = {
					x: i * studSpan - 0.5 * studHeight,
					y: shedHeight + rafterRise,
					z: rafterRun
				};
				framing.push(framingPart);

				i++;
			} else {
				framingPart = new Rafter(studWidth, studHeight, Math.sqrt(rafterRise * rafterRise + rafterRun * rafterRun), false, "chocolate", roofPitch, studHeight, roofOverhang);
				framingPart.startPos = {
					x: shedLength - studHeight,
					y: shedHeight + rafterRise,
					z: rafterRun
				};
				framing.push(framingPart);

				framingPart = new Rafter(studWidth, studHeight, Math.sqrt(rafterRise * rafterRise + rafterRun * rafterRun), true, "chocolate", roofPitch, studHeight, roofOverhang);
				framingPart.startPos = {
					x: shedLength - studHeight,
					y: shedHeight + rafterRise,
					z: rafterRun
				};
				framing.push(framingPart);

				endLoop = true;
			}
		}

		const vertCamera = new Vert3D(0, 0, 0);
		const tmpVert = new Vert3D(0, 0, 0);
		framing.forEach(stud => {
			stud.calcVertices();
			let tmpArr = stud.vertices.map((item) => {
				tmpVert.value = item; // copy item to tmpVert
				tmpVert.z = item.z + zOfset; // move real 3D scene
				tmpVert.y = item.y - yOfset;

				multPointMatrix(tmpVert, vertCamera, Mproj); // 3D >> 2D
				xRange[0] = Math.min(xRange[0], vertCamera.x); // we need to know dimensions of 2D scene
				xRange[1] = Math.max(xRange[1], vertCamera.x);
				yRange[0] = Math.min(yRange[0], vertCamera.y);
				yRange[1] = Math.max(yRange[1], vertCamera.y);
				return [parseFloat(vertCamera.x.toFixed(5)), parseFloat(vertCamera.y.toFixed(5))];
			});
			cameraPoints.push(tmpArr); // put the calculated vert to the array
		});

		let ratio = Math.min(viewBoxSize[0] / (xRange[1] - xRange[0]), viewBoxSize[1] / (yRange[1] - yRange[0]));
		let xMid = -(xRange[0] * ratio) + parseInt(horizontalShift);
		let yMid = -(yRange[0] * ratio) + parseInt(verticalShift);

		for (let i = 0; i < cameraPoints.length; i++) { // generate svg code
			framing[i].edges.forEach(poly => {
				svgCode += `<path d="`;
				svgCode += `M ${(xMid+cameraPoints[i][poly[0]][0]*ratio).toFixed(4)} ${(yMid+cameraPoints[i][poly[0]][1]*ratio).toFixed(4)} `;
				for (let j = 1; j < (poly.length - 1); j++) {
					svgCode += `L ${(xMid+cameraPoints[i][poly[j]][0]*ratio).toFixed(4)} ${(yMid+cameraPoints[i][poly[j]][1]*ratio).toFixed(4)} `;
				}
				svgCode += (poly[poly.length - 1] ? `Z" stroke="${framing[i].color}" />` : `" stroke="${framing[i].color}" />`);
			});
		};
	};
	targetElement.innerHTML = svgCode; // publish svg

	// material list
	var materials = framing.reduce((allNames, name) => { // make a list of used materials (w x h x l) and count them
		let totalLength = (name.constructor.name == "Rafter") ? name.l + name.overhang : name.l;
		let key = name.constructor.name + ":" + name.w + " x " + name.h + " x " + totalLength.toFixed();
		const currCount = allNames[key] ?? 0;
		return {
			...allNames,
			[key]: currCount + 1
		};
	}, {});

	const sorted = Object.keys(materials) // sort the material by name and size (just for clarity)
		.sort()
		.reduce((accumulator, key) => {
			accumulator[key] = materials[key];

			return accumulator;
		}, {});

	if (refreshMatList) { // do we need recalc material list ? comes from sliders
		targetElement = document.getElementById("materialList");

		let materialsList = "";
		let cellCounter = 0;
		for (const property in sorted) {
			if (cellCounter % 3 == 0) { // new row ?? table has 3 columns
				materialsList += (cellCounter == 0) ? "<tr>" : "</tr><tr>"; // is it the first cell or no ??
			}
			materialsList += "<td>" + `${property.split(":")[0]} - ${property.split(":")[1]}" (${sorted[property]} pcs)` + "</td>"; // new cell
			cellCounter++;
		}
		materialsList += "</tr>"; // close last row
		targetElement.innerHTML = materialsList; // publish the table
	}
}


function sliderChange(val, element) { // sliders "oninput" function
	document.getElementById(element).innerHTML = val;
}
