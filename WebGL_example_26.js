
//----------------------------- Global Variables -----------------------------

var gl = null; // WebGL context
var shaderProgram = null;
var triangleVertexPositionBuffer = null;	
var triangleVertexNormalBuffer = null;	

// The GLOBAL transformation parameters
var globalAngleXX = 0.0;
var globalAngleYY = 0.0;
var globalAngleZZ = 0.0;
var globalTz = 0.0;

// GLOBAL Animation controls
var globalRotationXX_ON = 0;
var globalRotationXX_DIR = 1;
var globalRotationXX_SPEED = 1;

var globalRotationYY_ON = 0;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;

var globalRotationZZ_ON = 0;
var globalRotationZZ_DIR = 1;
var globalRotationZZ_SPEED = 1;

var globalTranslationZZ_ON = 0;
var globalTranslationZZ_DIR = 1;
var globalTranslationZZ_SPEED = 1;

// To allow choosing the way of drawing the model triangles
var primitiveType = null;
 
// To allow choosing the projection type
var projectionType = 0;

// The viewer position
var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//------------------------------ The WebGL code ------------------------------

// Handling the Vertex Coordinates and the Vertex Normal Vectors
function initBuffers( model ) {		
	// Vertex Coordinates		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	
}

//  Drawing the model
function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader	
	initBuffers(model);
	
	// Material properties	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );   
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );
	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources	
	var numLights = lightSources.length;	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );   
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );   
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing - primitiveType allows drawing as filled triangles / wireframe / vertices	
	if( primitiveType == gl.LINE_LOOP ) {				
		var i;		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 		
	}	
}

//  Drawing the 3D scene
function drawScene() {	
	var pMatrix;	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType == 0 ) {
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );	
		globalTz = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		pos_Viewer[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 45, 1, 0.05, 15 );
		globalTz = -2.5;

		// The viewer is on (0,0,0)		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;		
		pos_Viewer[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE	
	//mvMatrix = translationMatrix( 0, 0, globalTz );
	mvMatrix = mult(translationMatrix( 0, 0, globalTz),
	mult(mult(rotationXXMatrix( globalAngleXX ), rotationYYMatrix( globalAngleYY )),
			  rotationZZMatrix( globalAngleZZ)));

	// Updating the position of the light sources, if required
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined  
		var lightSourceMatrix = mat4();
		if( !lightSources[i].isOff() ) {

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// Passing the Light Souree Matrix to apply
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
}

//--------------------------------- Animation --------------------------------
var lastTime = 0;

function animate() {	
	var timeNow = new Date().getTime();
	if( lastTime != 0 ) {		
		var elapsed = timeNow - lastTime;		
		
		// Global rotation		
		if( globalRotationXX_ON ) {
			globalAngleXX += globalRotationXX_DIR * globalRotationXX_SPEED * (90 * elapsed) / 1000.0;
		}
		if( globalRotationYY_ON ) {
			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
		}
		if( globalRotationZZ_ON ) {
			globalAngleZZ += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 1000.0;
		}

		// Local rotations	
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {
				sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
			}
			if( sceneModels[i].rotYYOn ) {
				sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
			}
			if( sceneModels[i].rotZZOn ) {
				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}
		}
		
		// Rotating the light sources	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotXXOn() ) {
				var angle = lightSources[i].getRotAngleXX() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;	
				lightSources[i].setRotAngleXX( angle );
			}
			if( lightSources[i].isRotYYOn() ) {
				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;		
				lightSources[i].setRotAngleYY( angle );
			}

			if( lightSources[i].isRotZZOn() ) {
				var angle = lightSources[i].getRotAngleZZ() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;	
				lightSources[i].setRotAngleZZ( angle );
			}
		}
	}
	lastTime = timeNow;
}

// Timer
function tick() {	
	requestAnimFrame(tick);	
	drawScene();
	animate();
}

//----------------------------- User Interaction -----------------------------

function outputInfos(){
    
}

function setEventListeners(){
	
	// var sceneModels = sceneModels_1;
	// var tx, ty, tz, rotAngleXX, rotAngleYY, rotAngleZZ, traAngleZZ, sx, sy, sz;
	// var rotXXOn, rotYYOn, rotZZOn, rotXXSpeed, rotYYSpeed, rotZZSpeed, rotXXDir, rotYYDir, rotZZDir;
	// var traZZOn, traZZSpeed, traZZDir;
	// var kAmbi, kDiff, kSpec, nPhong;

	// tx = tx_1; ty = ty_1; tz = tz_1;
	// rotAngleXX = rotAngleXX_1; rotAngleYY = rotAngleYY_1; rotAngleZZ = rotAngleZZ_1; traAngleZZ = traAngleZZ_1;
	// sx = sx_1; sy = sy_1; sz = sz_1;
	// rotXXOn = rotXXOn_1; rotYYOn = rotYYOn_1; rotZZOn = rotZZOn_1;
	// rotXXSpeed = rotXXSpeed_1; rotYYSpeed = rotYYSpeed_1; rotZZSpeed = rotZZSpeed_1;
	// rotXXDir = rotXXDir_1; rotYYDir = rotYYDir_1; rotZZDir = rotZZDir_1;
	// traZZOn = traZZOn_1; traZZSpeed = traZZSpeed_1; traZZDir = traZZDir_1;
	// kAmbi = kAmbi_1; kDiff = kDiff_1; kSpec = kSpec_1; nPhong = nPhong_1;

	// choose Molecule
	document.getElementById("water-button").onclick = function(){

	};
	
	document.getElementById("dioxide-button").onclick = function(){

	}; 
	
	// start/stop Molecule
	document.getElementById("start-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXOn = true;
		}
		if(globalAngleXX != 0){
			globalRotationXX_ON = true;
		}
		if(globalAngleYY != 0){
			globalRotationYY_ON = true;
		}
		if(globalAngleZZ != 0){
			globalRotationZZ_ON = true;
		}
	}; 

	document.getElementById("stop-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXOn = false;
		}
		globalRotationXX_ON = false;
		globalRotationYY_ON = false;
		globalRotationZZ_ON = false;
	};

	// movement
	document.getElementById("XX-start-button").onclick = function(){
		globalRotationXX_ON = true;
		// tick();
	};	
	
	document.getElementById("XX-stop-button").onclick = function(){
		globalRotationXX_ON = false;
	};	
	
	document.getElementById("YY-start-button").onclick = function(){
		globalRotationYY_ON = true;
	};

	document.getElementById("YY-stop-button").onclick = function(){
		globalRotationYY_ON = false;
	};
	
	document.getElementById("ZZ-start-button").onclick = function(){
		globalRotationZZ_ON = true;
	};

	document.getElementById("ZZ-stop-button").onclick = function(){
		globalRotationZZ_ON = false;
	};	

	// direction
	document.getElementById("XX-direction-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXDir == 1 ) {
				sceneModels[i].rotXXDir = -1;
			}
			else {
				sceneModels[i].rotXXDir = 1;
			}	
		}
	};
	
	document.getElementById("XX_direction_on_off").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {
				sceneModels[i].rotXXOn = false;
			}
			else {
				sceneModels[i].rotXXOn = true;
			}	
		}
	};   

	// shift
	document.getElementById("move-left-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].tx -= 0.25;
		}
	};

	document.getElementById("move-right-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].tx += 0.25;
		}		

	};      

	document.getElementById("move-up-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].ty += 0.25;
		}

	};      

	document.getElementById("move-down-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].ty -= 0.25;
		}
 
	};

	// speed 
	document.getElementById("XX-slower-button").onclick = function(){
		
		globalRotationXX_SPEED *= 0.75; 
		globalRotationYY_SPEED *= 0.75;
		globalRotationZZ_SPEED *= 0.75;
	};      

	document.getElementById("XX-faster-button").onclick = function(){
		
		globalRotationXX_SPEED *= 1.25;
		globalRotationYY_SPEED *= 1.25; 
		globalRotationZZ_SPEED *= 1.25;
	};      

	// zoom 
	var countScale = 0;
	document.getElementById("scale-up-button").onclick = function(){ 
		if (countScale != 3){
			for(var i = 0; i < sceneModels.length; i++ )
			{
				if (i == 1 || i == 3){
					sceneModels[i].sx *= 1.0;
				} else {
					sceneModels[i].sx *= 1.1;
				} 
				sceneModels[i].sy *= 1.1;
				sceneModels[i].sz *= 1.1;	
			}
			countScale++;
		} 
		drawScene(); 
	};

	document.getElementById("scale-down-button").onclick = function(){
		if (countScale != -3){
			for(var i = 0; i < sceneModels.length; i++ )
			{
				if (i == 1 || i == 3){
					if (sceneModels[i].sx <= 0.48)
						sceneModels[i].sx *= 1.1;
				} else {
					sceneModels[i].sx *= 0.9;
				}
				sceneModels[i].sy *= 0.9;
				sceneModels[i].sz *= 0.9;	
			}
			countScale--;
		} 
		drawScene(); 
	};

	// projection 	
	var projection = document.getElementById("projection-selection");	
	projection.addEventListener("click", function(){		
		var p = projection.selectedIndex;				
		switch(p){			
			case 0 : projectionType = 0;
				break;			
			case 1 : projectionType = 1;
				break;
		}  	
	});      

	// rendering	
	var list = document.getElementById("rendering-mode-selection");	
	list.addEventListener("click", function(){						
		var mode = list.selectedIndex;				
		switch(mode){
			case 0 : primitiveType = gl.TRIANGLES;
				break;			
			case 1 : primitiveType = gl.LINE_LOOP;
				break;			
			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});  

	document.getElementById("reset-button").onclick = function(){
		
		globalRotationXX_ON = false;
		globalRotationYY_ON = false;
		globalRotationZZ_ON = false;
		globalAngleXX = 0;
		globalAngleYY = 0;
		globalAngleZZ = 0;

		// left sphere
		sceneModels[0].tx = -0.75; sceneModels[0].ty = -0.03;
		sceneModels[0].sx = 0.20; sceneModels[0].sy = 0.20; sceneModels[0].sz = 0.20;
		sceneModels[0].rotXXOn = false;	
		sceneModels[0].rotYYOn = false;
		sceneModels[0].rotZZOn = false;
		sceneModels[0].rotXXSpeed = 1.0;
		sceneModels[0].rotYYSpeed = 1.0;
		sceneModels[0].rotZZSpeed = 1.0;

		// left link
		sceneModels[1].tx = -0.40; sceneModels[1].ty = 0.23;
		sceneModels[1].sx = 0.25; sceneModels[1].sy = 0.05; sceneModels[1].sz = 0.05;
		sceneModels[1].rotXXOn = false;	
		sceneModels[1].rotYYOn = false;
		sceneModels[1].rotZZOn = false;
		sceneModels[1].rotXXSpeed = 1.0;
		sceneModels[1].rotYYSpeed = 1.0;
		sceneModels[1].rotZZSpeed = 1.0;

		// middle sphere
		sceneModels[2].tx = 0; sceneModels[2].ty = 0.5;
		sceneModels[2].sx = 0.25; sceneModels[2].sy = 0.25; sceneModels[2].sz = 0.25;
		sceneModels[2].rotXXOn = false;	
		sceneModels[2].rotYYOn = false;
		sceneModels[2].rotZZOn = false;
		sceneModels[2].rotXXSpeed = 1.0;
		sceneModels[2].rotYYSpeed = 1.0;
		sceneModels[2].rotZZSpeed = 1.0;

		// right link
		sceneModels[3].tx = 0.40; sceneModels[3].ty = 0.23;
		sceneModels[3].sx = 0.25; sceneModels[3].sy = 0.05; sceneModels[3].sz = 0.05;
		sceneModels[3].rotXXOn = false;	
		sceneModels[3].rotYYOn = false;
		sceneModels[3].rotZZOn = false;
		sceneModels[3].rotXXSpeed = 1.0;
		sceneModels[3].rotYYSpeed = 1.0;
		sceneModels[3].rotZZSpeed = 1.0;

		// right sphere
		sceneModels[4].tx = 0.75; sceneModels[4].ty = -0.03;
		sceneModels[4].sx = 0.20; sceneModels[4].sy = 0.20; sceneModels[4].sz = 0.20;
		sceneModels[4].rotXXOn = false;	
		sceneModels[4].rotYYOn = false;
		sceneModels[4].rotZZOn = false;
		sceneModels[4].rotXXSpeed = 1.0;
		sceneModels[4].rotYYSpeed = 1.0;
		sceneModels[4].rotZZSpeed = 1.0;

		document.getElementById("stop-button").disabled = true;
		document.getElementById("start-button").disabled = false;
		drawScene();  
		// sceneModels[i].rotXXOn = true;
		// sceneModels[i].rotYYOn = true;
		// sceneModels[i].rotZZOn = true;
	};

}

//--------------------------- WebGL Initialization ---------------------------

function initWebGL( canvas ) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
		primitiveType = gl.TRIANGLES;	
		gl.enable( gl.CULL_FACE );	
		gl.cullFace( gl.BACK );
		gl.enable( gl.DEPTH_TEST ); 
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL 1, sorry! :-(");
	}       
}

function runWebGL() {	
	var canvas = document.getElementById("my-canvas");	
	initWebGL( canvas );
	
	shaderProgram = initShaders( gl );	
	setEventListeners();	
	tick(); 
	outputInfos();
}