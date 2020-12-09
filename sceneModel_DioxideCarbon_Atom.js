
//------------------------------- Constructors -------------------------------

function emptyModelFeatures_4() {

	// EMPTY MODEL
	this.vertices_4 = [];
	this.normals_4 = [];

	// Displacement vector	
	this.tx_4 = 0.0;	
	this.ty_4 = 0.0;	
	this.tz_4 = 0.0;	
	
	// Rotation angles		
	this.rotAngleXX_4 = 0.0;	
	this.rotAngleYY_4 = 0.0;	
	this.rotAngleZZ_4 = 0.0;	
	
	this.traAngleZZ_4 = 0.0;	

	// Scaling factors	
	this.sx_4 = 1.0;	
	this.sy_4 = 1.0;	
	this.sz_4 = 1.0;		
	
	// Animation controls
	this.rotXXOn_4 = true;	
	this.rotYYOn_4 = true;	
	this.rotZZOn_4 = true;	

	this.rotXXSpeed_4 = 1.0;	
	this.rotYYSpeed_4 = 1.0;	
	this.rotZZSpeed_4 = 1.0;
	
	this.rotXXDir_4 = 1;
	this.rotYYDir_4 = 1;
	this.rotZZDir_4 = 1;

	// Animation controls	
	this.traZZOn_4 = false;	
	this.traZZSpeed_4 = 1.0;
	this.traZZDir_4 = 1;
	
	// Material features	
	this.kAmbi_4 = [ 0.2, 0.2, 0.2 ];	
	this.kDiff_4 = [ 0.7, 0.7, 0.7 ];
	this.kSpec_4 = [ 0.7, 0.7, 0.7 ];
	this.nPhong_4 = 100;
}

function simpleCubeModel_4( ) {
	var cube = new emptyModelFeatures_4();	
	cube.vertices_4 = [
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
	computeVertexNormals( cube.vertices_4, cube.normals_4 );
	return cube;
}

function cubeModel_4( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel_4();	
	midPointRefinement( cube.vertices_4, subdivisionDepth );	
	computeVertexNormals( cube.vertices_4, cube.normals_4 );	
	return cube;
}

function sphereModel_4( subdivisionDepth = 5 ) {	
	var sphere = new simpleCubeModel_4();	
	midPointRefinement( sphere.vertices_4, subdivisionDepth );	
	moveToSphericalSurface( sphere.vertices_4 )	
	computeVertexNormals( sphere.vertices_4, sphere.normals_4 );	
	return sphere;
}


//------------------------- Instantiating scene models -----------------------

var sceneModels_4 = [];

// NUCLEO O-1 (ESQUERDA)
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[0].traZZOn_4 = true;
sceneModels_4[0].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[0].tx_4 = 0; sceneModels_4[0].ty_4 = 0;
sceneModels_4[0].sx_4 = 0.1; sceneModels_4[0].sy_4 = 0.1; sceneModels_4[0].sz_4 = 0.1;

// ELETRAO 1 DENTRO NUCLEO O-1 
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[1].traZZOn_4 = true;
sceneModels_4[1].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[1].tx_4 = 0; sceneModels_4[1].ty_4 = 0.25;
sceneModels_4[1].sx_4 = 0.03; sceneModels_4[1].sy_4 = 0.03; sceneModels_4[1].sz_4 = 0.03;

// ELETRAO 2 DENTRO NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[2].traZZOn_4 = true;
sceneModels_4[2].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[2].tx_4 = 0; sceneModels_4[2].ty_4 = -0.25;
sceneModels_4[2].sx_4 = 0.03; sceneModels_4[2].sy_4 = 0.03; sceneModels_4[2].sz_4 = 0.03;

// ELETRAO 1 FORA NUCLEO O-1 
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[3].traZZOn_4 = true;
sceneModels_4[3].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[3].tx_4 = 0.5; sceneModels_4[3].ty_4 = 0;
sceneModels_4[3].sx_4 = 0.03; sceneModels_4[3].sy_4 = 0.03; sceneModels_4[3].sz_4 = 0.03;

// ELETRAO 2 FORA NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[4].traZZOn_4 = true;
sceneModels_4[4].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[4].tx_4 = -0.50; sceneModels_4[4].ty_4 = 0;
sceneModels_4[4].sx_4 = 0.03; sceneModels_4[4].sy_4 = 0.03; sceneModels_4[4].sz_4 = 0.03;

// ELETRAO 3 FORA NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[5].traZZOn_4 = true;
sceneModels_4[5].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[5].tx_4 = 0.25; sceneModels_4[5].ty_4 = 0.43;
sceneModels_4[5].sx_4 = 0.03; sceneModels_4[5].sy_4 = 0.03; sceneModels_4[5].sz_4 = 0.03;

// ELETRAO 4 DENTRO NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[6].traZZOn_4 = true;
sceneModels_4[6].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[6].tx_4 = -0.25; sceneModels_4[6].ty_4 = 0.43;
sceneModels_4[6].sx_4 = 0.03; sceneModels_4[6].sy_4 = 0.03; sceneModels_4[6].sz_4 = 0.03;

// ELETRAO 5 FORA NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[7].traZZOn_4 = true;
sceneModels_4[7].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[7].tx_4 = 0.25; sceneModels_4[7].ty_4 = -0.43;
sceneModels_4[7].sx_4 = 0.03; sceneModels_4[7].sy_4 = 0.03; sceneModels_4[7].sz_4 = 0.03;

// ELETRAO 6 FORA NUCLEO O-1 
sceneModels_4.push( new sphereModel_4( 6 ) );
sceneModels_4[8].traZZOn_4 = true;
sceneModels_4[8].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[8].tx_4 = -0.25; sceneModels_4[8].ty_4 = -0.43;
sceneModels_4[8].sx_4 = 0.03; sceneModels_4[8].sy_4 = 0.03; sceneModels_4[8].sz_4 = 0.03;