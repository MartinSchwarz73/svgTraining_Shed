// JavaScript Document

class Vert3D {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	toString() {
		// alert("Vert3D.toString()");
		return `[${this.x.toFixed(2)},${this.y.toFixed(2)},${this.z.toFixed(2)}]`;
	}
}
class Line3D {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}
	
	toString() {
		return `[${this.a.x,this.a.y,this.a.z}]-[${this.b.x,this.b.y,this.b.z}]`;
	}
}
class Matrix44 {
	constructor() { 
		this.m = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
	}
	
	setAllCells(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        this.m[0][0] = a; 
        this.m[0][1] = b; 
        this.m[0][2] = c; 
        this.m[0][3] = d; 
        this.m[1][0] = e; 
        this.m[1][1] = f; 
        this.m[1][2] = g; 
        this.m[1][3] = h; 
        this.m[2][0] = i; 
        this.m[2][1] = j; 
        this.m[2][2] = k; 
        this.m[2][3] = l; 
        this.m[3][0] = m; 
        this.m[3][1] = n; 
        this.m[3][2] = o; 
        this.m[3][3] = p; 
	}

	getCell(cell) {
		var row = Math.floor(cell/10);
		var col = cell-row*10;
		return this.m[row-1][col-1];
	}
	
	setCell(cell, value) {
		// alert(`Matrix44::setCell(${cell},${value})`);
		var row = Math.floor(cell/10);
		var col = cell-row*10;
		// alert(`Matrix44: before setCell->m[${row-1}][${col-1}]=${this.m[row-1][col-1]}`);
		this.m[row-1][col-1] = value;
		// alert(`Matrix44: after setCell->m[${row-1}][${col-1}]=${this.m[row-1][col-1]}`);

	}
	
	toString() {
		var s = `[${this.m[0][0]}][${this.m[0][1]}][${this.m[0][2]}][${this.m[0][3]}]\n`;
		s += `[${this.m[1][0]}][${this.m[1][1]}][${this.m[1][2]}][${this.m[1][3]}]\n`;
		s += `[${this.m[2][0]}][${this.m[2][1]}][${this.m[2][2]}][${this.m[2][3]}]\n`; 
		s += `[${this.m[3][0]}][${this.m[3][1]}][${this.m[3][2]}][${this.m[3][3]}]\n`;
		return s;
	}
}


function setProjectionMatrix(angleOfView, near, far, M) 
{ 
    var scale = 1 / Math.tan(angleOfView * 0.5 * Math.PI / 180); 
    M.setCell(11, scale); 
    M.setCell(22, scale); 
    M.setCell(33, -far / (far - near)); 
    M.setCell(43, -far * near / (far - near)); 
    M.setCell(34, -1); 
    M.setCell(44,  0); 
} 

function multPointMatrix(inP, outP, M) 
{ 
    //out = in * Mproj;
    outP.x   = inP.x * M.getCell(11) + inP.y * M.getCell(21) + inP.z * M.getCell(31) +  M.getCell(41); 
    outP.y   = inP.x * M.getCell(12) + inP.y * M.getCell(22) + inP.z * M.getCell(32) +  M.getCell(42); 
    outP.z   = inP.x * M.getCell(13) + inP.y * M.getCell(23) + inP.z * M.getCell(33) +  M.getCell(43); 
    var w = inP.x * M.getCell(14) + inP.y * M.getCell(24) + inP.z * M.getCell(34) +  M.getCell(44); 
 
    // normalize if w is different than 1 (convert from homogeneous to Cartesian coordinates)
    if (w != 1) { 
        outP.x /= w; 
        outP.y /= w; 
        outP.z /= w; 
    } 
} 


/*
int main(int argc, char **argv) 
{ 
    uint32_t imageWidth = 512, imageHeight = 512; 
    Matrix44f Mproj; 
    Matrix44f worldToCamera; 
    worldToCamera[3][1] = -10; 
    worldToCamera[3][2] = -20; 
	
	Matrix44f worldToCamera = {0.95424, 0.20371, -0.218924, 0, 0, 0.732087, 0.681211, 0, 0.299041, -0.650039, 0.698587, 0, -0.553677, -3.920548, -62.68137, 1}; 



    float angleOfView = 90; 
    float near = 0.1; 
    float far = 100; 
	
	 setProjectionMatrix(angleOfView, near, far, Mproj); 
    unsigned char *buffer = new unsigned char[imageWidth * imageHeight]; 
    memset(buffer, 0x0, imageWidth * imageHeight); 

	
	    for (uint32_t i = 0; i < numVertices; ++i) { 
        Vec3f vertCamera, projectedVert; 
        multPointMatrix(vertices[i], vertCamera, worldToCamera); 
        multPointMatrix(vertCamera, projectedVert, Mproj); 
        if (projectedVert.x < -1 || projectedVert.x > 1 || projectedVert.y < -1 || projectedVert.y > 1) continue; 
        // convert to raster space and mark the position of the vertex in the image with a simple dot
        uint32_t x = std::min(imageWidth - 1, (uint32_t)((projectedVert.x + 1) * 0.5 * imageWidth)); 
        uint32_t y = std::min(imageHeight - 1, (uint32_t)((1 - (projectedVert.y + 1) * 0.5) * imageHeight)); 
        buffer[y * imageWidth + x] = 255; 

}
	
*/

// https://en.wikipedia.org/wiki/3D_projection
// https://pymicro.readthedocs.io/projects/pymicro/en/latest/cookbook/euler_angles.html
// https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrices-what-you-need-to-know-first