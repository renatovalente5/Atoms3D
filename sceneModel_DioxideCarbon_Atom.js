
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
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[0].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[0].tx_4 = -0.70; sceneModels_4[0].ty_4 = 0;
sceneModels_4[0].sx_4 = 0.1; sceneModels_4[0].sy_4 = 0.1; sceneModels_4[0].sz_4 = 0.1;

// ELETRAO 1 DENTRO NUCLEO O-1 
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[1].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[1].tx_4 = 0; sceneModels_4[1].ty_4 = 0.35;
sceneModels_4[1].sx_4 = 0.03; sceneModels_4[1].sy_4 = 0.03; sceneModels_4[1].sz_4 = 0.03;

// ELETRAO 2 DENTRO NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[2].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[2].tx_4 = -0.25; sceneModels_4[2].ty_4 = 0.25;
sceneModels_4[2].sx_4 = 0.03; sceneModels_4[2].sy_4 = 0.03; sceneModels_4[2].sz_4 = 0.03;

// ELETRAO 1 FORA NUCLEO O-1 
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[3].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[3].tx_4 = -0.25; sceneModels_4[3].ty_4 = -0.25;
sceneModels_4[3].sx_4 = 0.03; sceneModels_4[3].sy_4 = 0.03; sceneModels_4[3].sz_4 = 0.03;

// ELETRAO 2 FORA NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[4].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[4].tx_4 = 0; sceneModels_4[4].ty_4 = -0.30;
sceneModels_4[4].sx_4 = 0.03; sceneModels_4[4].sy_4 = 0.03; sceneModels_4[4].sz_4 = 0.03;

// ELETRAO 3 FORA NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[5].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[5].tx_4 = 0.25; sceneModels_4[5].ty_4 = -0.25;
sceneModels_4[5].sx_4 = 0.03; sceneModels_4[5].sy_4 = 0.03; sceneModels_4[5].sz_4 = 0.03;

// ELETRAO 4 FORA NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[6].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[6].tx_4 = 0.25; sceneModels_4[6].ty_4 = 0.25;
sceneModels_4[6].sx_4 = 0.03; sceneModels_4[6].sy_4 = 0.03; sceneModels_4[6].sz_4 = 0.03;

// ELETRAO 5 DENTRO NUCLEO O-1
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[7].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[7].tx_4 = 0.15; sceneModels_4[7].ty_4 = 0;
sceneModels_4[7].sx_4 = 0.03; sceneModels_4[7].sy_4 = 0.03; sceneModels_4[7].sz_4 = 0.03;

// ELETRAO 6 DENTRO NUCLEO O-1 
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[8].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[8].tx_4 = -0.15; sceneModels_4[8].ty_4 = 0;
sceneModels_4[8].sx_4 = 0.03; sceneModels_4[8].sy_4 = 0.03; sceneModels_4[8].sz_4 = 0.03;

// NUCLEO O-2 (DIREITO)
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[9].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[9].tx_4 = 0.70; sceneModels_4[9].ty_4 = 0;
sceneModels_4[9].sx_4 = 0.1; sceneModels_4[9].sy_4 = 0.1; sceneModels_4[9].sz_4 = 0.1;

// ELETRAO 1 DENTRO NUCLEO O-2 
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[10].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[10].tx_4 = 0; sceneModels_4[10].ty_4 = 0.35;
sceneModels_4[10].sx_4 = 0.03; sceneModels_4[10].sy_4 = 0.03; sceneModels_4[10].sz_4 = 0.03;

// ELETRAO 2 FORA NUCLEO O-2
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[11].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[11].tx_4 = -0.25; sceneModels_4[11].ty_4 = 0.25;
sceneModels_4[11].sx_4 = 0.03; sceneModels_4[11].sy_4 = 0.03; sceneModels_4[11].sz_4 = 0.03;

// ELETRAO 1 FORA NUCLEO O-2 
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[12].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[12].tx_4 = -0.25; sceneModels_4[12].ty_4 = -0.25;
sceneModels_4[12].sx_4 = 0.03; sceneModels_4[12].sy_4 = 0.03; sceneModels_4[12].sz_4 = 0.03;

// ELETRAO 2 FORA NUCLEO O-2
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[13].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[13].tx_4 = 0; sceneModels_4[13].ty_4 = -0.30;
sceneModels_4[13].sx_4 = 0.03; sceneModels_4[13].sy_4 = 0.03; sceneModels_4[13].sz_4 = 0.03;

// ELETRAO 3 FORA NUCLEO O-2
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[14].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[14].tx_4 = 0.25; sceneModels_4[14].ty_4 = -0.25;
sceneModels_4[14].sx_4 = 0.03; sceneModels_4[14].sy_4 = 0.03; sceneModels_4[14].sz_4 = 0.03;

// ELETRAO 4 FORA NUCLEO O-2
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[15].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[15].tx_4 = 0.25; sceneModels_4[15].ty_4 = 0.25;
sceneModels_4[15].sx_4 = 0.03; sceneModels_4[15].sy_4 = 0.03; sceneModels_4[15].sz_4 = 0.03;

// ELETRAO 5 DENTRO NUCLEO O-2
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[16].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[16].tx_4 = 0.15; sceneModels_4[16].ty_4 = 0;
sceneModels_4[16].sx_4 = 0.03; sceneModels_4[16].sy_4 = 0.03; sceneModels_4[16].sz_4 = 0.03;

// ELETRAO 6 DENTRO NUCLEO O-2 
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[17].kDiff_4 = [ 1.0, 0.0, 0.0 ];
sceneModels_4[17].tx_4 = -0.15; sceneModels_4[17].ty_4 = 0;
sceneModels_4[17].sx_4 = 0.03; sceneModels_4[17].sy_4 = 0.03; sceneModels_4[17].sz_4 = 0.03;

// NUCLEO C (DIREITO)
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[18].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[18].tx_4 = 0; sceneModels_4[18].ty_4 = 0;
sceneModels_4[18].sx_4 = 0.1; sceneModels_4[18].sy_4 = 0.1; sceneModels_4[18].sz_4 = 0.1;

// ELETRAO 1 FORA NUCLEO C
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[19].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[19].tx_4 = 0.15; sceneModels_4[19].ty_4 = 0;
sceneModels_4[19].sx_4 = 0.03; sceneModels_4[19].sy_4 = 0.03; sceneModels_4[19].sz_4 = 0.03;

// ELETRAO 2 FORA NUCLEO C
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[20].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[20].tx_4 = -0.25; sceneModels_4[20].ty_4 = 0.25;
sceneModels_4[20].sx_4 = 0.03; sceneModels_4[20].sy_4 = 0.03; sceneModels_4[20].sz_4 = 0.03;

// ELETRAO 1 FORA NUCLEO C
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[21].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[21].tx_4 = -0.25; sceneModels_4[21].ty_4 = -0.25;
sceneModels_4[21].sx_4 = 0.03; sceneModels_4[21].sy_4 = 0.03; sceneModels_4[21].sz_4 = 0.03;

// ELETRAO 2 FORA NUCLEO C
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[22].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[22].tx_4 = -0.15; sceneModels_4[22].ty_4 = 0;
sceneModels_4[22].sx_4 = 0.03; sceneModels_4[22].sy_4 = 0.03; sceneModels_4[22].sz_4 = 0.03;

// ELETRAO 3 DENTRO NUCLEO C
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[23].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[23].tx_4 = 0.25; sceneModels_4[23].ty_4 = -0.25;
sceneModels_4[23].sx_4 = 0.03; sceneModels_4[23].sy_4 = 0.03; sceneModels_4[23].sz_4 = 0.03;

// ELETRAO 4 DENTRO NUCLEO C
sceneModels_4.push( new sphereModel_4( 4 ) );
sceneModels_4[24].kDiff_4 = [ 1.0, 1.0, 1.0 ];
sceneModels_4[24].tx_4 = 0.25; sceneModels_4[24].ty_4 = 0.25;
sceneModels_4[24].sx_4 = 0.03; sceneModels_4[24].sy_4 = 0.03; sceneModels_4[24].sz_4 = 0.03;
