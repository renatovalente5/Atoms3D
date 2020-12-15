
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
	
	// Material features	
	this.kAmbi_2 = [ 0.2, 0.2, 0.2 ];	
	this.kDiff_2 = [ 0.7, 0.7, 0.7 ];
	this.kSpec_2 = [ 0.7, 0.7, 0.7 ];
	this.nPhong_2 = 100;
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
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[0].kDiff_2 = [ 1.0, 1.0, 1.0 ];
sceneModels_2[0].tx_2 = -0.50; sceneModels_2[0].ty_2 = 0.84;
sceneModels_2[0].sx_2 = 0.06; sceneModels_2[0].sy_2 = 0.06; sceneModels_2[0].sz_2 = 0.06;

// NUCLEO H2
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[1].kDiff_2 = [ 1.0, 1.0, 1.0 ];
sceneModels_2[1].tx_2 = 0.50; sceneModels_2[1].ty_2 = 0.84;
sceneModels_2[1].sx_2 = 0.06; sceneModels_2[1].sy_2 = 0.06; sceneModels_2[1].sz_2 = 0.06;

// ELETRAO NUCLEO H2
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[2].kDiff_2 = [ 1.0, 1.0, 1.0 ];
sceneModels_2[2].tx_2 = 0.25; sceneModels_2[2].ty_2 = 0.43;
sceneModels_2[2].sx_2 = 0.03; sceneModels_2[2].sy_2 = 0.03; sceneModels_2[2].sz_2 = 0.03;

// ELETRAO NUCLEO H1
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[3].kDiff_2 = [ 1.0, 1.0, 1.0 ];
sceneModels_2[3].tx_2 = -0.25; sceneModels_2[3].ty_2 = 0.43; 
sceneModels_2[3].sx_2 = 0.03; sceneModels_2[3].sy_2 = 0.03; sceneModels_2[3].sz_2 = 0.03;

// NUCLEO O
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[4].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[4].tx_2 = 0; sceneModels_2[4].ty_2 = 0;
sceneModels_2[4].sx_2 = 0.1; sceneModels_2[4].sy_2 = 0.1; sceneModels_2[4].sz_2 = 0.1;

// ELETRAO 1 DENTRO NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[5].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[5].tx_2 = 0; sceneModels_2[5].ty_2 = 0.25;
sceneModels_2[5].sx_2 = 0.03; sceneModels_2[5].sy_2 = 0.03; sceneModels_2[5].sz_2 = 0.03;

// ELETRAO 2 DENTRO NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[6].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[6].tx_2 = 0; sceneModels_2[6].ty_2 = -0.25;
sceneModels_2[6].sx_2 = 0.03; sceneModels_2[6].sy_2 = 0.03; sceneModels_2[6].sz_2 = 0.03;

// ELETRAO 1 FORA NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[7].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[7].tx_2 = 0.5; sceneModels_2[7].ty_2 = 0;
sceneModels_2[7].sx_2 = 0.03; sceneModels_2[7].sy_2 = 0.03; sceneModels_2[7].sz_2 = 0.03;

// ELETRAO 2 FORA NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[8].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[8].tx_2 = -0.50; sceneModels_2[8].ty_2 = 0;
sceneModels_2[8].sx_2 = 0.03; sceneModels_2[8].sy_2 = 0.03; sceneModels_2[8].sz_2 = 0.03;

// ELETRAO 3 FORA NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[9].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[9].tx_2 = 0.25; sceneModels_2[9].ty_2 = 0.43;
sceneModels_2[9].sx_2 = 0.03; sceneModels_2[9].sy_2 = 0.03; sceneModels_2[9].sz_2 = 0.03;

// ELETRAO 4 DENTRO NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[10].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[10].tx_2 = -0.25; sceneModels_2[10].ty_2 = 0.43;
sceneModels_2[10].sx_2 = 0.03; sceneModels_2[10].sy_2 = 0.03; sceneModels_2[10].sz_2 = 0.03;

// ELETRAO 5 FORA NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[11].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[11].tx_2 = 0.25; sceneModels_2[11].ty_2 = -0.43;
sceneModels_2[11].sx_2 = 0.03; sceneModels_2[11].sy_2 = 0.03; sceneModels_2[11].sz_2 = 0.03;

// ELETRAO 6 FORA NUCLEO O 
sceneModels_2.push( new sphereModel_2( 4 ) );
sceneModels_2[12].kDiff_2 = [ 1.0, 0.0, 0.0 ];
sceneModels_2[12].tx_2 = -0.25; sceneModels_2[12].ty_2 = -0.43;
sceneModels_2[12].sx_2 = 0.03; sceneModels_2[12].sy_2 = 0.03; sceneModels_2[12].sz_2 = 0.03;