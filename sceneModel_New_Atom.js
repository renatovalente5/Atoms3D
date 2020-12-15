
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