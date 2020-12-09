
//------------------------------- Constructors -------------------------------

function emptyModelFeatures_3() {

	// EMPTY MODEL
	this.vertices_3 = [];
	this.normals_3 = [];

	// Displacement vector	
	this.tx_3 = 0.0;	
	this.ty_3 = 0.0;	
	this.tz_3 = 0.0;	
	
	// Rotation angles		
	this.rotAngleXX_3 = 0.0;	
	this.rotAngleYY_3 = 0.0;	
	this.rotAngleZZ_3 = 0.0;	
	
	this.traAngleZZ_3 = 0.0;	

	// Scaling factors	
	this.sx_3 = 1.0;	
	this.sy_3 = 1.0;	
	this.sz_3 = 1.0;		
	
	// Animation controls
	this.rotXXOn_3 = true;	
	this.rotYYOn_3 = true;	
	this.rotZZOn_3 = true;	

	this.rotXXSpeed_3 = 1.0;	
	this.rotYYSpeed_3 = 1.0;	
	this.rotZZSpeed_3 = 1.0;
	
	this.rotXXDir_3 = 1;
	this.rotYYDir_3 = 1;
	this.rotZZDir_3 = 1;

	// Animation controls	
	this.traZZOn_3 = false;	
	this.traZZSpeed_3 = 1.0;
	this.traZZDir_3 = 1;
	
	// Material features	
	this.kAmbi_3 = [ 0.2, 0.2, 0.2 ];	
	this.kDiff_3 = [ 1.0, 0.0, 0.0 ];
	this.kSpec_3 = [ 0.7, 0.7, 0.7 ];
	this.nPhong_3 = 100;
}

function simpleCubeModel_3( ) {
	var cube = new emptyModelFeatures_3();	
	cube.vertices_3 = [
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
	computeVertexNormals( cube.vertices_3, cube.normals_3 );
	return cube;
}

function cubeModel_3( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel_3();	
	midPointRefinement( cube.vertices_3, subdivisionDepth );	
	computeVertexNormals( cube.vertices_3, cube.normals_3 );	
	return cube;
}

function sphereModel_3( subdivisionDepth = 5 ) {	
	var sphere = new simpleCubeModel_3();	
	midPointRefinement( sphere.vertices_3, subdivisionDepth );	
	moveToSphericalSurface( sphere.vertices_3 )	
	computeVertexNormals( sphere.vertices_3, sphere.normals_3 );	
	return sphere;
}


//------------------------- Instantiating scene models -----------------------

var sceneModels_3 = [];

// Model 0 --- Left sphere
sceneModels_3.push( new sphereModel_3( 6 ) );
sceneModels_3[0].rotZZOn_3 = false;
sceneModels_3[0].rotYYOn_3 = false;
sceneModels_3[0].kDiff_3 = [ 1.0, 1.0, 1.0 ];
sceneModels_3[0].tx_3 = -0.75; sceneModels_3[0].ty_3 = 0;
sceneModels_3[0].sx_3 = 0.20; sceneModels_3[0].sy_3 = 0.20; sceneModels_3[0].sz_3 = 0.20;

// Model 1 --- Left simpleCube
sceneModels_3.push( new simpleCubeModel_3() );
sceneModels_3[1].rotZZOn_3 = false;
sceneModels_3[1].rotYYOn_3 = false;
sceneModels_3[1].kDiff_3 = [ 0.8, 0.8, 0.8 ];
sceneModels_3[1].tx_3 = -0.40; sceneModels_3[1].ty_3 = 0;
sceneModels_3[1].sx_3 = 0.16; sceneModels_3[1].sy_3 = 0.05; sceneModels_3[1].sz_3 = 0.05;

// Model 2 --- Middle sphere
sceneModels_3.push( new sphereModel_3( 6 ) );
sceneModels_3[2].rotZZOn_3 = false;
sceneModels_3[2].rotYYOn_3 = false;
sceneModels_3[2].kDiff_3 = [ 1.0, 0.0, 0.0 ];
sceneModels_3[2].tx_3 = 0; sceneModels_3[2].ty_3 = 0;
sceneModels_3[2].sx_3 = 0.25; sceneModels_3[2].sy_3 = 0.25; sceneModels_3[2].sz_3 = 0.25;

// Model 3 --- Middle simpleCube
sceneModels_3.push( new simpleCubeModel_3() );
sceneModels_3[3].rotZZOn_3 = false;
sceneModels_3[3].rotYYOn_3 = false;
sceneModels_3[3].kDiff_3 = [ 1.0, 1.0, 1.0 ];
sceneModels_3[3].tx_3 = 0.40; sceneModels_3[3].ty_3 = 0;
sceneModels_3[3].sx_3 = 0.16; sceneModels_3[3].sy_3 = 0.05; sceneModels_3[3].sz_3 = 0.05;

// Model 4 --- Right sphere
sceneModels_3.push( new sphereModel_3( 6 ) );
sceneModels_3[4].rotZZOn_3 = false;
sceneModels_3[4].rotYYOn_3 = false;
sceneModels_3[4].kDiff_3 = [ 1.0, 1.0, 1.0 ];
sceneModels_3[4].tx_3 = 0.75; sceneModels_3[4].ty_3 = 0;
sceneModels_3[4].sx_3 = 0.20; sceneModels_3[4].sy_3 = 0.20; sceneModels_3[4].sz_3 = 0.20;
