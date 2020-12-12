
//------------------------------- Constructors -------------------------------

function emptyModelFeatures_6() {

	// EMPTY MODEL
	this.vertices_6 = [];
	this.normals_6 = [];

	// Displacement vector	
	this.tx_6 = 0.0;	
	this.ty_6 = 0.0;	
	this.tz_6 = 0.0;	
	
	// Rotation angles		
	this.rotAngleXX_6 = 0.0;	
	this.rotAngleYY_6 = 0.0;	
	this.rotAngleZZ_6 = 0.0;	
	
	this.traAngleZZ_6 = 0.0;	

	// Scaling factors	
	this.sx_6 = 1.0;	
	this.sy_6 = 1.0;	
	this.sz_6 = 1.0;		
	
	// Animation controls
	this.rotXXOn_6 = true;	
	this.rotYYOn_6 = true;	
	this.rotZZOn_6 = true;	

	this.rotXXSpeed_6 = 1.0;	
	this.rotYYSpeed_6 = 1.0;	
	this.rotZZSpeed_6 = 1.0;
	
	this.rotXXDir_6 = 1;
	this.rotYYDir_6 = 1;
	this.rotZZDir_6 = 1;

	// // Animation controls	
	// this.traZZOn_6 = false;	
	// this.traZZSpeed_6 = 1.0;
	// this.traZZDir_6 = 1;
	
	// Material features	
	this.kAmbi_6 = [ 0.2, 0.2, 0.2 ];	
	this.kDiff_6 = [ 0.7, 0.7, 0.7 ];
	this.kSpec_6 = [ 0.7, 0.7, 0.7 ];
	this.nPhong_6 = 100;
}

function simpleCubeModel_6( ) {
	var cube = new emptyModelFeatures_6();	
	cube.vertices_6 = [
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
	computeVertexNormals( cube.vertices_6, cube.normals_6 );
	return cube;
}

function cubeModel_6( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel_6();	
	midPointRefinement( cube.vertices_6, subdivisionDepth );	
	computeVertexNormals( cube.vertices_6, cube.normals_6 );	
	return cube;
}

function sphereModel_6( subdivisionDepth = 5 ) {	
	var sphere = new simpleCubeModel_6();	
	midPointRefinement( sphere.vertices_6, subdivisionDepth );	
	moveToSphericalSurface( sphere.vertices_6 )	
	computeVertexNormals( sphere.vertices_6, sphere.normals_6 );	
	return sphere;
}


//------------------------- Instantiating scene models -----------------------

var sceneModels_6 = [];

// NUCLEO H1
sceneModels_6.push( new sphereModel_6( 6 ) );
// sceneModels_6[0].traZZOn_6 = true;
sceneModels_6[0].kDiff_6 = [ 1.0, 1.0, 1.0 ];
sceneModels_6[0].tx_6 = -0.50; sceneModels_6[0].ty_6 = 0.84;
sceneModels_6[0].sx_6 = 0.06; sceneModels_6[0].sy_6 = 0.06; sceneModels_6[0].sz_6 = 0.06;

// // NUCLEO H2
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[1].traZZOn_6 = true;
// sceneModels_6[1].kDiff_6 = [ 1.0, 1.0, 1.0 ];
// sceneModels_6[1].tx_6 = 0.50; sceneModels_6[1].ty_6 = 0.84;
// sceneModels_6[1].sx_6 = 0.06; sceneModels_6[1].sy_6 = 0.06; sceneModels_6[1].sz_6 = 0.06;

// // ELETRAO NUCLEO H1
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[2].traZZOn_6 = true;
// sceneModels_6[2].kDiff_6 = [ 1.0, 1.0, 1.0 ];
// sceneModels_6[2].tx_6 = 0.25; sceneModels_6[2].ty_6 = 0.43;
// sceneModels_6[2].sx_6 = 0.03; sceneModels_6[2].sy_6 = 0.03; sceneModels_6[2].sz_6 = 0.03;

// // ELETRAO NUCLEO H2
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[3].traZZOn_6 = true;
// sceneModels_6[3].kDiff_6 = [ 1.0, 1.0, 1.0 ];
// sceneModels_6[3].tx_6 = -0.25; sceneModels_6[3].ty_6 = 0.43; 
// sceneModels_6[3].sx_6 = 0.03; sceneModels_6[3].sy_6 = 0.03; sceneModels_6[3].sz_6 = 0.03;

// // NUCLEO O
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[4].traZZOn_6 = true;
// sceneModels_6[4].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[4].tx_6 = 0; sceneModels_6[4].ty_6 = 0;
// sceneModels_6[4].sx_6 = 0.1; sceneModels_6[4].sy_6 = 0.1; sceneModels_6[4].sz_6 = 0.1;

// // ELETRAO 1 DENTRO NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[5].traZZOn_6 = true;
// sceneModels_6[5].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[5].tx_6 = 0; sceneModels_6[5].ty_6 = 0.25;
// sceneModels_6[5].sx_6 = 0.03; sceneModels_6[5].sy_6 = 0.03; sceneModels_6[5].sz_6 = 0.03;

// // ELETRAO 2 DENTRO NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[6].traZZOn_6 = true;
// sceneModels_6[6].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[6].tx_6 = 0; sceneModels_6[6].ty_6 = -0.25;
// sceneModels_6[6].sx_6 = 0.03; sceneModels_6[6].sy_6 = 0.03; sceneModels_6[6].sz_6 = 0.03;

// // ELETRAO 1 FORA NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[7].traZZOn_6 = true;
// sceneModels_6[7].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[7].tx_6 = 0.5; sceneModels_6[7].ty_6 = 0;
// sceneModels_6[7].sx_6 = 0.03; sceneModels_6[7].sy_6 = 0.03; sceneModels_6[7].sz_6 = 0.03;

// // ELETRAO 2 FORA NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[8].traZZOn_6 = true;
// sceneModels_6[8].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[8].tx_6 = -0.50; sceneModels_6[8].ty_6 = 0;
// sceneModels_6[8].sx_6 = 0.03; sceneModels_6[8].sy_6 = 0.03; sceneModels_6[8].sz_6 = 0.03;

// // ELETRAO 3 FORA NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[9].traZZOn_6 = true;
// sceneModels_6[9].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[9].tx_6 = 0.25; sceneModels_6[9].ty_6 = 0.43;
// sceneModels_6[9].sx_6 = 0.03; sceneModels_6[9].sy_6 = 0.03; sceneModels_6[9].sz_6 = 0.03;

// // ELETRAO 4 DENTRO NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[10].traZZOn_6 = true;
// sceneModels_6[10].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[10].tx_6 = -0.25; sceneModels_6[10].ty_6 = 0.43;
// sceneModels_6[10].sx_6 = 0.03; sceneModels_6[10].sy_6 = 0.03; sceneModels_6[10].sz_6 = 0.03;

// // ELETRAO 5 FORA NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[11].traZZOn_6 = true;
// sceneModels_6[11].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[11].tx_6 = 0.25; sceneModels_6[11].ty_6 = -0.43;
// sceneModels_6[11].sx_6 = 0.03; sceneModels_6[11].sy_6 = 0.03; sceneModels_6[11].sz_6 = 0.03;

// // ELETRAO 6 FORA NUCLEO O 
// sceneModels_6.push( new sphereModel_6( 6 ) );
// // sceneModels_6[12].traZZOn_6 = true;
// sceneModels_6[12].kDiff_6 = [ 1.0, 0.0, 0.0 ];
// sceneModels_6[12].tx_6 = -0.25; sceneModels_6[12].ty_6 = -0.43;
// sceneModels_6[12].sx_6 = 0.03; sceneModels_6[12].sy_6 = 0.03; sceneModels_6[12].sz_6 = 0.03;