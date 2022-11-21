// JavaScript Document


function setProjectionMatrix(angleOfView, near, far, M) {
	var scale = 1 / Math.tan(angleOfView * 0.5 * Math.PI / 180);
	M.setCell(11, scale);
	M.setCell(22, scale);
	M.setCell(33, -far / (far - near));
	M.setCell(43, -far * near / (far - near));
	M.setCell(34, -1);
	M.setCell(44, 0);
}

function multPointMatrix(inP, outP, M) {
	//out = in * Mproj;
	outP.x = inP.x * M.getCell(11) + inP.y * M.getCell(21) + inP.z * M.getCell(31) + M.getCell(41);
	outP.y = inP.x * M.getCell(12) + inP.y * M.getCell(22) + inP.z * M.getCell(32) + M.getCell(42);
	outP.z = inP.x * M.getCell(13) + inP.y * M.getCell(23) + inP.z * M.getCell(33) + M.getCell(43);
	var w = inP.x * M.getCell(14) + inP.y * M.getCell(24) + inP.z * M.getCell(34) + M.getCell(44);

	// normalize if w is different than 1 (convert from homogeneous to Cartesian coordinates)
	if (w != 1) {
		outP.x /= w;
		outP.y /= w;
		outP.z /= w;
	}
}
