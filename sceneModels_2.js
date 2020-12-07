
//------------------------------- Constructors -------------------------------

function emptyModelFeatures_2() {

	// EMPTY MODEL
	this.vertices_2 = [];
	this.normals_2 = [];

	// Displacement vector	
	this.tx_2 = 0.0;	
	this.ty_2 = 0.0;	
	this.tz_2 = 0.0;	
	
	// Rotation angles		
	this.rotAngleXX_2 = 0.0;	
	this.rotAngleYY_2 = 0.0;	
	this.rotAngleZZ_2 = 0.0;	
	
	this.traAngleZZ_2 = 0.0;	

	// Scaling factors	
	this.sx_2 = 1.0;	
	this.sy_2 = 1.0;	
	this.sz_2 = 1.0;		
	
	// Animation controls
	this.rotXXOn_2 = true;	
	this.rotYYOn_2 = true;	
	this.rotZZOn_2 = true;	

	this.rotXXSpeed_2 = 1.0;	
	this.rotYYSpeed_2 = 1.0;	
	this.rotZZSpeed_2 = 1.0;
	
	this.rotXXDir_2 = 1;
	this.rotYYDir_2 = 1;
	this.rotZZDir_2 = 1;

	// Animation controls	
	this.traZZOn_2 = false;	
	this.traZZSpeed_2 = 1.0;
	this.traZZDir_2 = 1;
	
	// Material features	
	this.kAmbi_2 = [ 0.2, 0.2, 0.2 ];	
	this.kDiff_2 = [ 0.7, 0.7, 0.7 ];
	this.kSpec_2 = [ 0.7, 0.7, 0.7 ];
	this.nPhong_2 = 100;
}

function singleTriangleModel_2( ) {	
	var triangle = new emptyModelFeatures_2();
	triangle.vertices_2 = [
		// FRONTAL TRIANGLE		 
		-0.5, -0.5,  0.5,		 
		 0.5, -0.5,  0.5,		 
		 0.5,  0.5,  0.5,
	];

	triangle.normals_2 = [
		// FRONTAL TRIANGLE		 
		 0.0,  0.0,  1.0,		 
		 0.0,  0.0,  1.0,		 
		 0.0,  0.0,  1.0,
	];
	return triangle;
}

function simpleCubeModel_2( ) {
	var cube = new emptyModelFeatures_2();	
	cube.vertices_2 = [
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
	computeVertexNormals( cube.vertices_2, cube.normals_2 );
	return cube;
}

function cubeModel_2( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel_2();	
	midPointRefinement( cube.vertices_2, subdivisionDepth );	
	computeVertexNormals( cube.vertices_2, cube.normals_2 );	
	return cube;
}

function simpleTetrahedronModel_2( ) {	
	var tetra = new emptyModelFeatures_2();	
	tetra.vertices_2 = [
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
	computeVertexNormals( tetra.vertices_2, tetra.normals_2 );
	return tetra;
}

function tetrahedronModel_2( subdivisionDepth = 0 ) {	
	var tetra = new simpleTetrahedronModel_2();	
	midPointRefinement( tetra.vertices_2, subdivisionDepth );	
	computeVertexNormals( tetra.vertices_2, tetra.normals_2 );	
	return tetra;
}

function sphereModel_2( subdivisionDepth = 5 ) {	
	var sphere = new simpleCubeModel_2();	
	midPointRefinement( sphere.vertices_2, subdivisionDepth );	
	moveToSphericalSurface( sphere.vertices_2 )	
	computeVertexNormals( sphere.vertices_2, sphere.normals_2 );	
	return sphere;
}


//------------------------- Instantiating scene models -----------------------

var sceneModels_2 = [];

// NUCLEO H1
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[0].traZZOn_2 = true;
sceneModels_2[0].tx_2 = -0.50; sceneModels_2[0].ty_2 = 0.70;
sceneModels_2[0].sx_2 = 0.06; sceneModels_2[0].sy_2 = 0.06; sceneModels_2[0].sz_2 = 0.06;

// NUCLEO H2
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[1].traZZOn_2 = true;
sceneModels_2[1].tx_2 = 0.50; sceneModels_2[1].ty_2 = 0.70;
sceneModels_2[1].sx_2 = 0.06; sceneModels_2[1].sy_2 = 0.06; sceneModels_2[1].sz_2 = 0.06;

// NUCLEO O
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[2].traZZOn_2 = true;
sceneModels_2[2].tx_2 = 0; sceneModels_2[2].ty_2 = -0.30;
sceneModels_2[2].sx_2 = 0.1; sceneModels_2[2].sy_2 = 0.1; sceneModels_2[2].sz_2 = 0.1;

// ELETRAO NUCLEO H1
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[3].traZZOn_2 = true;
sceneModels_2[3].tx_2 = 0.20; sceneModels_2[3].ty_2 = 0.85;
sceneModels_2[3].sx_2 = 0.03; sceneModels_2[3].sy_2 = 0.03; sceneModels_2[3].sz_2 = 0.03;

// ELETRAO NUCLEO H2
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[4].traZZOn_2 = true;
sceneModels_2[4].tx_2 = -0.20; sceneModels_2[4].ty_2 = 0.85; 
sceneModels_2[4].sx_2 = 0.03; sceneModels_2[4].sy_2 = 0.03; sceneModels_2[4].sz_2 = 0.03;

// ELETRAO 1 DENTRO NUCLEO O 
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[5].traZZOn_2 = true;
sceneModels_2[5].tx_2 = 0; sceneModels_2[5].ty_2 = 0.02;
sceneModels_2[5].sx_2 = 0.03; sceneModels_2[5].sy_2 = 0.03; sceneModels_2[5].sz_2 = 0.03;

// ELETRAO 2 DENTRO NUCLEO O 
sceneModels_2.push( new sphereModel_2( 6 ) );
sceneModels_2[6].traZZOn_2 = true;
sceneModels_2[6].tx_2 = 0; sceneModels_2[6].ty_2 = -0.65;
sceneModels_2[6].sx_2 = 0.03; sceneModels_2[6].sy_2 = 0.03; sceneModels_2[6].sz_2 = 0.03;