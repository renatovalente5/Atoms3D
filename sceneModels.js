
//------------------------------- Constructors -------------------------------

function emptyModelFeatures() {

	// EMPTY MODEL
	this.vertices = [];
	this.normals = [];

	// Displacement vector	
	this.tx = 0.0;	
	this.ty = 0.0;	
	this.tz = 0.0;	
	
	// Rotation angles		
	this.rotAngleXX = 0.0;	
	this.rotAngleYY = 0.0;	
	this.rotAngleZZ = 0.0;	
	
	this.traAngleZZ = 0.0;	

	// Scaling factors	
	this.sx = 1.0;	
	this.sy = 1.0;	
	this.sz = 1.0;		
	
	// Animation controls
	this.rotXXOn = true;	
	this.rotYYOn = true;	
	this.rotZZOn = true;	

	this.rotXXSpeed = 1.0;	
	this.rotYYSpeed = 1.0;	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	this.rotYYDir = 1;
	this.rotZZDir = 1;

	// Animation controls	
	this.traZZOn = false;	
	this.traZZSpeed = 1.0;
	this.traZZDir = 1;
	
	// Material features	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];	
	this.kDiff = [ 0.7, 0.7, 0.7 ];
	this.kSpec = [ 0.7, 0.7, 0.7 ];
	this.nPhong = 100;
}

function singleTriangleModel( ) {	
	var triangle = new emptyModelFeatures();
	triangle.vertices = [
		// FRONTAL TRIANGLE		 
		-0.5, -0.5,  0.5,		 
		 0.5, -0.5,  0.5,		 
		 0.5,  0.5,  0.5,
	];

	triangle.normals = [
		// FRONTAL TRIANGLE		 
		 0.0,  0.0,  1.0,		 
		 0.0,  0.0,  1.0,		 
		 0.0,  0.0,  1.0,
	];
	return triangle;
}

function simpleCubeModel( ) {
	var cube = new emptyModelFeatures();	
	cube.vertices = [
		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];
	computeVertexNormals( cube.vertices, cube.normals );
	return cube;
}

function cubeModel( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel();	
	midPointRefinement( cube.vertices, subdivisionDepth );	
	computeVertexNormals( cube.vertices, cube.normals );	
	return cube;
}

function simpleTetrahedronModel( ) {	
	var tetra = new emptyModelFeatures();	
	tetra.vertices = [
		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];
	computeVertexNormals( tetra.vertices, tetra.normals );
	return tetra;
}

function tetrahedronModel( subdivisionDepth = 0 ) {	
	var tetra = new simpleTetrahedronModel();	
	midPointRefinement( tetra.vertices, subdivisionDepth );	
	computeVertexNormals( tetra.vertices, tetra.normals );	
	return tetra;
}

function sphereModel( subdivisionDepth = 5 ) {	
	var sphere = new simpleCubeModel();	
	midPointRefinement( sphere.vertices, subdivisionDepth );	
	moveToSphericalSurface( sphere.vertices )	
	computeVertexNormals( sphere.vertices, sphere.normals );	
	return sphere;
}


//------------------------- Instantiating scene models -----------------------

var sceneModels = [];

// Model 0 --- Left sphere
sceneModels.push( new sphereModel( 6 ) );
sceneModels[0].rotZZOn = false;
sceneModels[0].rotYYOn = false;
sceneModels[0].tx = -0.75; sceneModels[0].ty = -0.03;
sceneModels[0].sx = 0.20; sceneModels[0].sy = 0.20; sceneModels[0].sz = 0.20;

// Model 1 --- Left simpleCube
sceneModels.push( new simpleCubeModel() );
sceneModels[1].rotZZOn = false;
sceneModels[1].rotYYOn = false;
sceneModels[1].rotAngleZZ = 37.5;
sceneModels[1].tx = -0.40; sceneModels[1].ty = 0.23;
sceneModels[1].sx = 0.25; sceneModels[1].sy = 0.05; sceneModels[1].sz = 0.05;

// Model 2 --- Middle sphere
sceneModels.push( new sphereModel( 6 ) );
sceneModels[2].rotZZOn = false;
sceneModels[2].rotYYOn = false;
sceneModels[2].tx = 0; sceneModels[2].ty = 0.5;
sceneModels[2].sx = 0.25; sceneModels[2].sy = 0.25; sceneModels[2].sz = 0.25;

// Model 3 --- Middle simpleCube
sceneModels.push( new simpleCubeModel() );
sceneModels[3].rotZZOn = false;
sceneModels[3].rotYYOn = false;
sceneModels[3].rotAngleZZ = -37.5;
sceneModels[3].tx = 0.40; sceneModels[3].ty = 0.23;
sceneModels[3].sx = 0.25; sceneModels[3].sy = 0.05; sceneModels[3].sz = 0.05;

// Model 4 --- Right sphere
sceneModels.push( new sphereModel( 6 ) );
sceneModels[4].rotZZOn = false;
sceneModels[4].rotYYOn = false;
sceneModels[4].tx = 0.75; sceneModels[4].ty = -0.03;
sceneModels[4].sx = 0.20; sceneModels[4].sy = 0.20; sceneModels[4].sz = 0.20;
