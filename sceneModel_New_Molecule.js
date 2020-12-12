
//------------------------------- Constructors -------------------------------

function emptyModelFeatures_5() {

	// EMPTY MODEL
	this.vertices_5 = [];
	this.normals_5 = [];

	// Displacement vector	
	this.tx_5 = 0.0;	
	this.ty_5 = 0.0;	
	this.tz_5 = 0.0;	
	
	// Rotation angles		
	this.rotAngleXX_5 = 0.0;	
	this.rotAngleYY_5 = 0.0;	
	this.rotAngleZZ_5 = 0.0;	
	
	this.traAngleZZ_5 = 0.0;	

	// Scaling factors	
	this.sx_5 = 1.0;	
	this.sy_5 = 1.0;	
	this.sz_5 = 1.0;		
	
	// Animation controls
	this.rotXXOn_5 = true;	
	this.rotYYOn_5 = true;	
	this.rotZZOn_5 = true;	

	this.rotXXSpeed_5 = 1.0;	
	this.rotYYSpeed_5 = 1.0;	
	this.rotZZSpeed_5 = 1.0;
	
	this.rotXXDir_5 = 1;
	this.rotYYDir_5 = 1;
	this.rotZZDir_5 = 1;

	// Animation controls	
	this.traZZOn_5 = false;	
	this.traZZSpeed_5 = 1.0;
	this.traZZDir_5 = 1;
	
	// Material features	
	this.kAmbi_5 = [ 0.2, 0.2, 0.2 ];	
	this.kDiff_5 = [ 1.0, 0.0, 0.0 ];
	this.kSpec_5 = [ 0.7, 0.7, 0.7 ];
	this.nPhong_5 = 100;
}

function simpleCubeModel_5( ) {
	var cube = new emptyModelFeatures_5();	
	cube.vertices_5 = [
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
	computeVertexNormals( cube.vertices_5, cube.normals_5 );
	return cube;
}

function cubeModel_5( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel_5();	
	midPointRefinement( cube.vertices_5, subdivisionDepth );	
	computeVertexNormals( cube.vertices_5, cube.normals_5 );	
	return cube;
}

function sphereModel_5( subdivisionDepth = 5 ) {	
	var sphere = new simpleCubeModel_5();	
	midPointRefinement( sphere.vertices_5, subdivisionDepth );	
	moveToSphericalSurface( sphere.vertices_5 )	
	computeVertexNormals( sphere.vertices_5, sphere.normals_5 );	
	return sphere;
}


//------------------------- Instantiating scene models -----------------------

var sceneModels_5 = [];

// // Model 0 --- Left sphere
// sceneModels_5.push( new sphereModel_5( 6 ) );
// sceneModels_5[0].rotZZOn_5 = false;
// sceneModels_5[0].rotYYOn_5 = false;
// sceneModels_5[0].kDiff_5 = [ 1.0, 1.0, 1.0 ];
// sceneModels_5[0].tx_5 = -0.75; sceneModels_5[0].ty_5 = 0;
// sceneModels_5[0].sx_5 = 0.20; sceneModels_5[0].sy_5 = 0.20; sceneModels_5[0].sz_5 = 0.20;

// // Model 1 --- Left simpleCube
// sceneModels_5.push( new simpleCubeModel_5() );
// sceneModels_5[1].rotZZOn_5 = false;
// sceneModels_5[1].rotYYOn_5 = false;
// sceneModels_5[1].kDiff_5 = [ 0.8, 0.8, 0.8 ];
// sceneModels_5[1].tx_5 = -0.40; sceneModels_5[1].ty_5 = 0;
// sceneModels_5[1].sx_5 = 0.16; sceneModels_5[1].sy_5 = 0.05; sceneModels_5[1].sz_5 = 0.05;

// // Model 2 --- Middle sphere
// sceneModels_5.push( new sphereModel_5( 6 ) );
// sceneModels_5[2].rotZZOn_5 = false;
// sceneModels_5[2].rotYYOn_5 = false;
// sceneModels_5[2].kDiff_5 = [ 1.0, 0.0, 0.0 ];
// sceneModels_5[2].tx_5 = 0; sceneModels_5[2].ty_5 = 0;
// sceneModels_5[2].sx_5 = 0.25; sceneModels_5[2].sy_5 = 0.25; sceneModels_5[2].sz_5 = 0.25;

// // Model 3 --- Middle simpleCube
// sceneModels_5.push( new simpleCubeModel_5() );
// sceneModels_5[3].rotZZOn_5 = false;
// sceneModels_5[3].rotYYOn_5 = false;
// sceneModels_5[3].kDiff_5 = [ 1.0, 1.0, 1.0 ];
// sceneModels_5[3].tx_5 = 0.40; sceneModels_5[3].ty_5 = 0;
// sceneModels_5[3].sx_5 = 0.16; sceneModels_5[3].sy_5 = 0.05; sceneModels_5[3].sz_5 = 0.05;

// // Model 4 --- Right sphere
// sceneModels_5.push( new sphereModel_5( 6 ) );
// sceneModels_5[4].rotZZOn_5 = false;
// sceneModels_5[4].rotYYOn_5 = false;
// sceneModels_5[4].kDiff_5 = [ 1.0, 1.0, 1.0 ];
// sceneModels_5[4].tx_5 = 0.75; sceneModels_5[4].ty_5 = 0;
// sceneModels_5[4].sx_5 = 0.20; sceneModels_5[4].sy_5 = 0.20; sceneModels_5[4].sz_5 = 0.20;
