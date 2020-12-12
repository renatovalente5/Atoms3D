
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
var globalRotationXX_ON = 1;
var globalRotationXX_DIR = 1;
var globalRotationXX_SPEED = 1;

var globalRotationYY_ON = 1;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;

var globalRotationZZ_ON = 0;
var globalRotationZZ_DIR = 1;
var globalRotationZZ_SPEED = 1;

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

function checkMove(){
	var a=0, b=1;
	if ((globalRotationXX_ON == false && globalRotationYY_ON == false && globalRotationZZ_ON == false) || (globalRotationXX_ON == 0 && globalRotationYY_ON == 0 && globalRotationZZ_ON == 0)){
		a = 1;
	}
	for(var i = 0; i < sceneModels.length; i++ )
	{
		if( sceneModels[i].rotXXOn ) {
			b = 0;
		}
	}
	if (a == 1 && b == 1){
		document.getElementById("start-button").disabled = false;
		document.getElementById("stop-button").disabled = true;
	} else {
		document.getElementById("start-button").disabled = true;
		document.getElementById("stop-button").disabled = false;
	}
}

var resetClick = 0;

function setEventListeners(){

	// choose Molecule
	document.getElementById("water-button").onclick = function(){
		$('#water_molecule_buttons').show();
		$('#dioxide_molecule_buttons').hide();
		$('#water_atom_buttons').show();
		$('#dioxide_atom_buttons').hide();
		$('#new_molecule_buttons').hide();
		$('#new_atom_buttons').hide();
	};
	
	document.getElementById("dioxide-button").onclick = function(){
		$('#water_molecule_buttons').hide();
		$('#dioxide_molecule_buttons').show();
		$('#water_atom_buttons').hide();
		$('#dioxide_atom_buttons').show();
		$('#new_molecule_buttons').hide();
		$('#new_atom_buttons').hide();
	}; 


	document.getElementById("new-button").onclick = function(){
		$('#water_molecule_buttons').hide();
		$('#dioxide_molecule_buttons').hide();
		$('#water_atom_buttons').hide();
		$('#dioxide_atom_buttons').hide();
		$('#new_molecule_buttons').show();
		$('#new_atom_buttons').show();
	}; 
	
	var old_globalRotationXX_ON, old_globalRotationYY_ON, old_globalRotationZZ_ON, old_rotXXOn; 
	
	// start/stop Molecule
	document.getElementById("start-button").onclick = function(){
		if (old_rotXXOn == 0 || old_rotXXOn == false){
			document.getElementById("XX_direction_on").disabled = false;
			document.getElementById("XX_direction_off").disabled = true;
		} else {
			document.getElementById("XX_direction_on").disabled = true;
			document.getElementById("XX_direction_off").disabled = false;
			for(var i = 0; i < sceneModels.length; i++ )
			{
				sceneModels[i].rotXXOn = true;
			}
		}
		
		if (old_globalRotationXX_ON == 0 || old_globalRotationXX_ON == false){
			document.getElementById("XX-start-button").disabled = false;
			document.getElementById("XX-stop-button").disabled = true;
		} else {
			document.getElementById("XX-start-button").disabled = true;
			document.getElementById("XX-stop-button").disabled = false;
			globalRotationXX_ON = 1;
		}

		if (old_globalRotationYY_ON == 0 || old_globalRotationYY_ON == false){
			document.getElementById("YY-start-button").disabled = false;
			document.getElementById("YY-stop-button").disabled = true;
		} else {
			document.getElementById("YY-start-button").disabled = true;
			document.getElementById("YY-stop-button").disabled = false;
			globalRotationYY_ON = 1;
		}

		if (old_globalRotationZZ_ON == 0 || old_globalRotationZZ_ON == false){
			document.getElementById("ZZ-start-button").disabled = false;
			document.getElementById("ZZ-stop-button").disabled = true;
		} else {
			if (resetClick == 0){
				document.getElementById("ZZ-start-button").disabled = true;
				document.getElementById("ZZ-stop-button").disabled = false;
				globalRotationZZ_ON = 1;
			} else {
				document.getElementById("ZZ-start-button").disabled = false;
				document.getElementById("ZZ-stop-button").disabled = true;
				globalRotationZZ_ON = 0;
			}		
		}
		resetClick = 0;
	}; 

	document.getElementById("stop-button").onclick = function(){
		old_globalRotationXX_ON = globalRotationXX_ON;
		old_globalRotationYY_ON = globalRotationYY_ON;
		old_globalRotationZZ_ON = globalRotationZZ_ON;
		old_rotXXOn = sceneModels[0].rotXXOn;
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXOn = false;
		}
		globalRotationXX_ON = false;
		globalRotationYY_ON = false;
		globalRotationZZ_ON = false;
		document.getElementById("XX-start-button").disabled = false;
		document.getElementById("XX-stop-button").disabled = true;
		document.getElementById("YY-start-button").disabled = false;
		document.getElementById("YY-stop-button").disabled = true;
		document.getElementById("ZZ-start-button").disabled = false;
		document.getElementById("ZZ-stop-button").disabled = true;
		document.getElementById("XX_direction_on").disabled = false;
		document.getElementById("XX_direction_off").disabled = true;
	};

	// movement
	document.getElementById("XX-start-button").onclick = function(){
		globalRotationXX_ON = true;
		document.getElementById("stop-button").disabled = false;
		document.getElementById("start-button").disabled = true;
	};	
	
	document.getElementById("XX-stop-button").onclick = function(){
		globalRotationXX_ON = false;
		checkMove();
	};	

	document.getElementById("XX-direction-button").onclick = function(){
		if(globalRotationXX_DIR == -1){
			globalRotationXX_DIR = 1;
		}else{
			globalRotationXX_DIR = -1;
		}
	};
	
	document.getElementById("YY-start-button").onclick = function(){
		globalRotationYY_ON = true;
		document.getElementById("stop-button").disabled = false;
		document.getElementById("start-button").disabled = true;
	};

	document.getElementById("YY-stop-button").onclick = function(){
		globalRotationYY_ON = false;
		checkMove();
	};
	
	document.getElementById("YY-direction-button").onclick = function(){
		if(globalRotationYY_DIR == -1){
			globalRotationYY_DIR = 1;
		}else{
			globalRotationYY_DIR = -1;
		}
	};

	document.getElementById("ZZ-start-button").onclick = function(){
		globalRotationZZ_ON = true;
		document.getElementById("stop-button").disabled = false;
		document.getElementById("start-button").disabled = true;
	};

	document.getElementById("ZZ-stop-button").onclick = function(){
		globalRotationZZ_ON = false;
		checkMove();
	};	

	document.getElementById("ZZ-direction-button").onclick = function(){
		if(globalRotationZZ_DIR == -1){
			globalRotationZZ_DIR = 1;
		}else{
			globalRotationZZ_DIR = -1;
		}
	};

	// direction
	document.getElementById("XX-direction-rot-button").onclick = function(){
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
	
	document.getElementById("XX_direction_on").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXOn = true;
		}
	};

	document.getElementById("XX_direction_off").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXOn = false;
		}
		checkMove();
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
		resetClick = 1;

		document.getElementById("stop-button").disabled = true;
		document.getElementById("start-button").disabled = false;
		
		document.getElementById("XX-start-button").disabled = false;
		document.getElementById("XX-stop-button").disabled = true;
		document.getElementById("YY-start-button").disabled = false;
		document.getElementById("YY-stop-button").disabled = true;
		document.getElementById("ZZ-start-button").disabled = false;
		document.getElementById("ZZ-stop-button").disabled = true;
		document.getElementById("XX_direction_on").disabled = false;
		document.getElementById("XX_direction_off").disabled = true;

		globalRotationXX_ON = false;
		globalRotationYY_ON = false;
		globalRotationZZ_ON = false;
		globalAngleXX = 0;
		globalAngleYY = 0;
		globalAngleZZ = 0;

		// left sphere
		sceneModels[0].tx = -0.75; sceneModels[0].ty = -0.03;
		sceneModels[0].sx = 0.20; sceneModels[0].sy = 0.20; sceneModels[0].sz = 0.20;

		// left link
		sceneModels[1].tx = -0.40; sceneModels[1].ty = 0.23;
		sceneModels[1].sx = 0.25; sceneModels[1].sy = 0.05; sceneModels[1].sz = 0.05;

		// middle sphere
		sceneModels[2].tx = 0; sceneModels[2].ty = 0.5;
		sceneModels[2].sx = 0.25; sceneModels[2].sy = 0.25; sceneModels[2].sz = 0.25;

		// right link
		sceneModels[3].tx = 0.40; sceneModels[3].ty = 0.23;
		sceneModels[3].sx = 0.25; sceneModels[3].sy = 0.05; sceneModels[3].sz = 0.05;

		// right sphere
		sceneModels[4].tx = 0.75; sceneModels[4].ty = -0.03;
		sceneModels[4].sx = 0.20; sceneModels[4].sy = 0.20; sceneModels[4].sz = 0.20;

		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXOn = false;	
			sceneModels[i].rotYYOn = false;
			sceneModels[i].rotZZOn = false;
			sceneModels[i].rotXXSpeed = 1.0;
			sceneModels[i].rotYYSpeed = 1.0;
			sceneModels[i].rotZZSpeed = 1.0;
		}

		drawScene();  
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