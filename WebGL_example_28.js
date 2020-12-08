
//----------------------------- Global Variables -----------------------------

var gl_3 = null; // WebGL context
var shaderProgram_3 = null;
var triangleVertexPositionBuffer_3 = null;	
var triangleVertexNormalBuffer_3 = null;	

// The GLOBAL transformation parameters
var globalAngleXX_3 = 0.0;
var globalAngleYY_3 = 0.0;
var globalAngleZZ_3 = 0.0;
var globalTz_3 = 0.0;

// GLOBAL Animation controls
var globalRotationXX_ON_3 = 1;
var globalRotationXX_DIR_3 = 1;
var globalRotationXX_SPEED_3 = 1;

var globalRotationYY_ON_3 = 1;
var globalRotationYY_DIR_3 = 1;
var globalRotationYY_SPEED_3 = 1;

var globalRotationZZ_ON_3 = 0;
var globalRotationZZ_DIR_3 = 1;
var globalRotationZZ_SPEED_3 = 1;

var globalTranslationZZ_ON_3 = 0;
var globalTranslationZZ_DIR_3 = 1;
var globalTranslationZZ_SPEED_3 = 1;

// To allow choosing the way of drawing the model triangles
var primitiveType_3 = null;
 
// To allow choosing the projection type
var projectionType_3 = 0;

// The viewer position
var pos_Viewer_3 = [ 0.0, 0.0, 0.0, 1.0 ];


//------------------------------ The WebGL code ------------------------------

// Handling the Vertex Coordinates and the Vertex Normal Vectors
function initBuffers_3( model ) {		
	// Vertex Coordinates		
	triangleVertexPositionBuffer_3 = gl_3.createBuffer();
	gl_3.bindBuffer(gl_3.ARRAY_BUFFER, triangleVertexPositionBuffer_3);
	gl_3.bufferData(gl_3.ARRAY_BUFFER, new Float32Array(model.vertices_3), gl_3.STATIC_DRAW);
	triangleVertexPositionBuffer_3.itemSize = 3;
	triangleVertexPositionBuffer_3.numItems =  model.vertices_3.length / 3;			

	// Associating to the vertex shader	
	gl_3.vertexAttribPointer(shaderProgram_3.vertexPositionAttribute, 
			triangleVertexPositionBuffer_3.itemSize, 
			gl_3.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors		
	triangleVertexNormalBuffer_3 = gl_3.createBuffer();
	gl_3.bindBuffer(gl_3.ARRAY_BUFFER, triangleVertexNormalBuffer_3);
	gl_3.bufferData(gl_3.ARRAY_BUFFER, new Float32Array( model.normals_3), gl_3.STATIC_DRAW);
	triangleVertexNormalBuffer_3.itemSize = 3;
	triangleVertexNormalBuffer_3.numItems = model.normals_3.length / 3;			

	// Associating to the vertex shader	
	gl_3.vertexAttribPointer(shaderProgram_3.vertexNormalAttribute, 
			triangleVertexNormalBuffer_3.itemSize, 
			gl_3.FLOAT, false, 0, 0);	
}

//  Drawing the model
function drawModel_3( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx_3, model.ty_3, model.tz_3 ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ_3 ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY_3 ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX_3 ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx_3, model.sy_3, model.sz_3 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl_3.getUniformLocation(shaderProgram_3, "uMVMatrix");	
	gl_3.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader	
	initBuffers_3(model);
	
	// Material properties	
	gl_3.uniform3fv( gl_3.getUniformLocation(shaderProgram_3, "k_ambient"), 
		flatten(model.kAmbi_3) );    
    gl_3.uniform3fv( gl_3.getUniformLocation(shaderProgram_3, "k_diffuse"),
        flatten(model.kDiff_3) );   
    gl_3.uniform3fv( gl_3.getUniformLocation(shaderProgram_3, "k_specular"),
        flatten(model.kSpec_3) );
	gl_3.uniform1f( gl_3.getUniformLocation(shaderProgram_3, "shininess"), 
		model.nPhong_3 );

    // Light Sources	
	var numLights = lightSources.length;	
	gl_3.uniform1i( gl_3.getUniformLocation(shaderProgram_3, "numLights"), 
		numLights );

	//Light Sources	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl_3.uniform1i( gl_3.getUniformLocation(shaderProgram_3, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );   
		gl_3.uniform4fv( gl_3.getUniformLocation(shaderProgram_3, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );   
		gl_3.uniform3fv( gl_3.getUniformLocation(shaderProgram_3, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing - primitiveType allows drawing as filled triangles / wireframe / vertices	
	if( primitiveType == gl_3.LINE_LOOP ) {				
		var i;		
		for( i = 0; i < triangleVertexPositionBuffer_3.numItems / 3; i++ ) {		
			gl_3.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {				
		gl_3.drawArrays(primitiveType, 0, triangleVertexPositionBuffer_3.numItems); 		
	}	
}

//  Drawing the 3D scene
function drawScene_3() {	
	var pMatrix;	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer	
	gl_3.clear(gl_3.COLOR_BUFFER_BIT | gl_3.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType_3 == 0 ) {
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );	
		globalTz_3 = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer_3[0] = pos_Viewer_3[1] = pos_Viewer_3[3] = 0.0;
		pos_Viewer_3[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 45, 1, 0.05, 15 );
		globalTz_3 = -2.5;

		// The viewer is on (0,0,0)		
		pos_Viewer_3[0] = pos_Viewer_3[1] = pos_Viewer_3[2] = 0.0;		
		pos_Viewer_3[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl_3.getUniformLocation(shaderProgram_3, "uPMatrix");	
	gl_3.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	gl_3.uniform4fv( gl_3.getUniformLocation(shaderProgram_3, "viewerPosition"),
        flatten(pos_Viewer_3) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE	
	//mvMatrix = translationMatrix( 0, 0, globalTz );
	mvMatrix = mult(translationMatrix( 0, 0, globalTz_3),
	mult(mult(rotationXXMatrix( globalAngleXX_3 ), rotationYYMatrix( globalAngleYY_3 )),
			  rotationZZMatrix( globalAngleZZ_3)));

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
		var lsmUniform = gl_3.getUniformLocation(shaderProgram_3, "allLights["+ String(i) + "].lightSourceMatrix");
		gl_3.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models	
	for(var i = 0; i < sceneModels_3.length; i++ )
	{ 
		drawModel_3( sceneModels_3[i],
			   mvMatrix,
	           primitiveType_3 );
	}
}

//--------------------------------- Animation --------------------------------
var lastTime_3 = 0;

function animate_3() {	
	var timeNow = new Date().getTime();
	if( lastTime_3 != 0 ) {		
		var elapsed = timeNow - lastTime_3;		
		
		// Global rotation		
		if( globalRotationXX_ON_3 ) {
			globalAngleXX_3 += globalRotationXX_DIR_3 * globalRotationXX_SPEED_3 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationYY_ON_3 ) {
			globalAngleYY_3 += globalRotationYY_DIR_3 * globalRotationYY_SPEED_3 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationZZ_ON_3 ) {
			globalAngleZZ_3 += globalRotationZZ_DIR_3 * globalRotationZZ_SPEED_3 * (90 * elapsed) / 1000.0;
		}

		// Local rotations	
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			if( sceneModels_3[i].rotXXOn_3 ) {
				sceneModels_3[i].rotAngleXX_3 += sceneModels_3[i].rotXXDir_3 * sceneModels_3[i].rotXXSpeed_3 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_3[i].rotYYOn_3 ) {
				sceneModels_3[i].rotAngleYY_3 += sceneModels_3[i].rotYYDir_3 * sceneModels_3[i].rotYYSpeed_3 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels[i].rotZZOn_3 ) {
				sceneModels_3[i].rotAngleZZ_3 += sceneModels_3[i].rotZZDir_3 * sceneModels_3[i].rotZZSpeed_3 * (90 * elapsed) / 1000.0;
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
	lastTime_3 = timeNow;
}

// Timer
function tick_3() {	
	requestAnimFrame(tick_3);	
	drawScene_3();
	animate_3();
}

//----------------------------- User Interaction -----------------------------

function outputInfos_3(){
    
}

function setEventListeners_3(){
	
	// choose Molecule
	document.getElementById("water-button").onclick = function(){

	};
	
	document.getElementById("dioxide-button").onclick = function(){

	}; 
	
	// start/stop Molecule
	document.getElementById("start-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			sceneModels_3[i].rotXXOn_3 = true;
		}
		if(globalAngleXX_3 != 0){
			globalRotationXX_ON_3 = true;
			document.getElementById("XX-start-button_3").disabled = true;
			document.getElementById("XX-stop-button_3").disabled = false;
		}
		if(globalAngleYY_3 != 0){
			globalRotationYY_ON_3 = true;
			document.getElementById("YY-start-button_3").disabled = true;
			document.getElementById("YY-stop-button_3").disabled = false;
		}
		if(globalAngleZZ_3 != 0){
			globalRotationZZ_ON_3 = true;
			document.getElementById("ZZ-start-button_3").disabled = true;
			document.getElementById("ZZ-stop-button_3").disabled = false;
		}
	}; 

	document.getElementById("stop-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			sceneModels_3[i].rotXXOn_3 = false;
		}
		globalRotationXX_ON_3 = false;
		globalRotationYY_ON_3 = false;
		globalRotationZZ_ON_3 = false;
		document.getElementById("XX-start-button_3").disabled = false;
		document.getElementById("XX-stop-button_3").disabled = true;
		document.getElementById("YY-start-button_3").disabled = false;
		document.getElementById("YY-stop-button_3").disabled = true;
		document.getElementById("ZZ-start-button_3").disabled = false;
		document.getElementById("ZZ-stop-button_3").disabled = true;
	};

	// movement
	document.getElementById("XX-start-button_3").onclick = function(){
		globalRotationXX_ON_3 = true;
	};	
	
	document.getElementById("XX-stop-button_3").onclick = function(){
		globalRotationXX_ON_3 = false;
	};	
	
	document.getElementById("YY-start-button_3").onclick = function(){
		globalRotationYY_ON_3 = true;
	};

	document.getElementById("YY-stop-button_3").onclick = function(){
		globalRotationYY_ON_3 = false;
	};
	
	document.getElementById("ZZ-start-button_3").onclick = function(){
		globalRotationZZ_ON_3 = true;
	};

	document.getElementById("ZZ-stop-button_3").onclick = function(){
		globalRotationZZ_ON_3 = false;
	};	

	// direction
	document.getElementById("XX-direction-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			if( sceneModels_3[i].rotXXDir_3 == 1 ) {
				sceneModels_3[i].rotXXDir_3 = -1;
			}
			else {
				sceneModels_3[i].rotXXDir_3 = 1;
			}	
		}
	};
	
	document.getElementById("XX_direction_on_off_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			if( sceneModels_3[i].rotXXOn_3 ) {
				sceneModels_3[i].rotXXOn_3 = false;
			}
			else {
				sceneModels_3[i].rotXXOn_3 = true;
			}	
		}
	};   

	// shift
	document.getElementById("move-left-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			sceneModels_3[i].tx_3 -= 0.25;
		}
	};

	document.getElementById("move-right-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			sceneModels_3[i].tx_3 += 0.25;
		}		

	};      

	document.getElementById("move-up-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			sceneModels_3[i].ty_3 += 0.25;
		}

	};      

	document.getElementById("move-down-button_3").onclick = function(){
		for(var i = 0; i < sceneModels_3.length; i++ )
	    {
			sceneModels_3[i].ty_3 -= 0.25;
		}

	};

	// speed 
	document.getElementById("XX-slower-button_3").onclick = function(){
		
		globalRotationXX_SPEED_3 *= 0.75; 
		globalRotationYY_SPEED_3 *= 0.75;
		globalRotationZZ_SPEED_3 *= 0.75;
	};      

	document.getElementById("XX-faster-button_3").onclick = function(){
		
		globalRotationXX_SPEED_3 *= 1.25;
		globalRotationYY_SPEED_3 *= 1.25; 
		globalRotationZZ_SPEED_3 *= 1.25;
	};      

	// zoom 
	var countScale = 0;
	document.getElementById("scale-up-button_3").onclick = function(){ 
		if (countScale != 3){
			for(var i = 0; i < sceneModels_3.length; i++ )
			{
				if (i == 1 || i == 3){
					sceneModels_3[i].sx_3 *= 1.0;
				} else {
					sceneModels_3[i].sx_3 *= 1.1;
				} 
				sceneModels_3[i].sy_3 *= 1.1;
				sceneModels_3[i].sz_3 *= 1.1;	
			}
			countScale++;
		} 
		drawScene_3(); 
	};

	document.getElementById("scale-down-button_3").onclick = function(){
		if (countScale != -3){
			for(var i = 0; i < sceneModels_3.length; i++ )
			{
				if (i == 1 || i == 3){
					if (sceneModels_3[i].sx_3 <= 0.48)
					sceneModels_3[i].sx_3 *= 1.1;
				} else {
					sceneModels_3[i].sx_3 *= 0.9;
				}
				sceneModels_3[i].sy_3 *= 0.9;
				sceneModels_3[i].sz_3 *= 0.9;	
			}
			countScale--;
		} 
		drawScene_3(); 
	};

	// projection 	
	var projection = document.getElementById("projection-selection_3");	
	projection.addEventListener("click", function(){		
		var p = projection.selectedIndex;				
		switch(p){			
			case 0 : projectionType_3 = 0;
				break;			
			case 1 : projectionType_3 = 1;
				break;
		}  	
	});      

	// rendering	
	var list = document.getElementById("rendering-mode-selection_3");	
	list.addEventListener("click", function(){						
		var mode = list.selectedIndex;				
		switch(mode){
			case 0 : primitiveType_3 = gl_3.TRIANGLES;
				break;			
			case 1 : primitiveType_3 = gl_3.LINE_LOOP;
				break;			
			case 2 : primitiveType_3 = gl_3.POINTS;
				break;
		}
	});  

	document.getElementById("reset-button_3").onclick = function(){
		
		globalRotationXX_ON_3 = false;
		globalRotationYY_ON_3 = false;
		globalRotationZZ_ON_3 = false;
		globalAngleXX_3 = 0;
		globalAngleYY_3 = 0;
		globalAngleZZ_3 = 0;

		// left sphere
		sceneModels_3[0].tx_3 = -0.75; sceneModels_3[0].ty_3 = 0;
		sceneModels_3[0].sx_3 = 0.20; sceneModels_3[0].sy_3 = 0.20; sceneModels_3[0].sz_3 = 0.20;
		sceneModels_3[0].rotXXOn_3 = false;	
		sceneModels_3[0].rotYYOn_3 = false;
		sceneModels_3[0].rotZZOn_3 = false;
		sceneModels_3[0].rotXXSpeed_3 = 1.0;
		sceneModels_3[0].rotYYSpeed_3 = 1.0;
		sceneModels_3[0].rotZZSpeed_3 = 1.0;

		// left link
		sceneModels_3[1].tx_3 = -0.40; sceneModels_3[1].ty_3 = 0;
		sceneModels_3[1].sx_3 = 0.16; sceneModels_3[1].sy_3 = 0.05; sceneModels_3[1].sz_3 = 0.05;
		sceneModels_3[1].rotXXOn_3 = false;	
		sceneModels_3[1].rotYYOn_3 = false;
		sceneModels_3[1].rotZZOn_3 = false;
		sceneModels_3[1].rotXXSpeed_3 = 1.0;
		sceneModels_3[1].rotYYSpeed_3 = 1.0;
		sceneModels_3[1].rotZZSpeed_3 = 1.0;

		// middle sphere
		sceneModels_3[2].tx_3 = 0; sceneModels_3[2].ty_3 = 0;
		sceneModels_3[2].sx_3 = 0.25; sceneModels_3[2].sy_3 = 0.25; sceneModels_3[2].sz_3 = 0.25;
		sceneModels_3[2].rotXXOn_3 = false;	
		sceneModels_3[2].rotYYOn_3 = false;
		sceneModels_3[2].rotZZOn_3 = false;
		sceneModels_3[2].rotXXSpeed_3 = 1.0;
		sceneModels_3[2].rotYYSpeed_3 = 1.0;
		sceneModels_3[2].rotZZSpeed_3 = 1.0;

		// right link
		sceneModels_3[3].tx_3 = 0.40; sceneModels_3[3].ty_3 = 0;
		sceneModels_3[3].sx_3 = 0.16; sceneModels_3[3].sy_3 = 0.05; sceneModels_3[3].sz_3 = 0.05;
		sceneModels_3[3].rotXXOn_3 = false;	
		sceneModels_3[3].rotYYOn_3 = false;
		sceneModels_3[3].rotZZOn_3 = false;
		sceneModels_3[3].rotXXSpeed_3 = 1.0;
		sceneModels_3[3].rotYYSpeed_3 = 1.0;
		sceneModels_3[3].rotZZSpeed_3 = 1.0;

		// right sphere
		sceneModels_3[4].tx_3 = 0.75; sceneModels_3[4].ty_3 = 0;
		sceneModels_3[4].sx_3 = 0.20; sceneModels_3[4].sy_3 = 0.20; sceneModels_3[4].sz_3 = 0.20;
		sceneModels_3[4].rotXXOn_3 = false;	
		sceneModels_3[4].rotYYOn_3 = false;
		sceneModels_3[4].rotZZOn_3 = false;
		sceneModels_3[4].rotXXSpeed_3 = 1.0;
		sceneModels_3[4].rotYYSpeed_3 = 1.0;
		sceneModels_3[4].rotZZSpeed_3 = 1.0;

		document.getElementById("stop-button_3").disabled = true;
		document.getElementById("start-button_3").disabled = false;
		drawScene_3();  
	};
}

//--------------------------- WebGL Initialization ---------------------------

function initWebGL_3( canvas ) {
	try {
		gl_3 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
		primitiveType_3 = gl_3.TRIANGLES;	
		gl_3.enable( gl_3.CULL_FACE );	
		gl_3.cullFace( gl_3.BACK );
		gl_3.enable( gl_3.DEPTH_TEST ); 
	} catch (e) {
	}
	if (!gl_3) {
		alert("Could not initialise WebGL 1, sorry! :-(");
	}       
}

function runWebGL_3() {	
	var canvas = document.getElementById("my-canvas");	
	initWebGL_3( canvas );
	
	shaderProgram_3 = initShaders( gl_3 );	
	setEventListeners_3();	
	tick_3(); 
	outputInfos_3();
}