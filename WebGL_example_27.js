
//----------------------------- Global Variables -----------------------------

var gl_2 = null; // WebGL context
var shaderProgram_2 = null;
var triangleVertexPositionBuffer_2 = null;	
var triangleVertexNormalBuffer_2 = null;	

// The GLOBAL transformation parameters
var globalAngleYY_2 = 0.0;
var globalAngleZZ_2 = 0.0;
var globalTz_2 = 0.0;

// GLOBAL Animation controls
var globalRotationYY_ON_2 = 0;
var globalRotationYY_DIR_2 = 1;
var globalRotationYY_SPEED_2 = 0;

var globalTranslationZZ_ON_2 = 1;
var globalTranslationZZ_DIR_2 = 1;
var globalTranslationZZ_SPEED_2 = 1;

// To allow choosing the way of drawing the model triangles
var primitiveType_2 = null;
 
// To allow choosing the projection type
var projectionType_2 = 0;

// The viewer position
var pos_Viewer_2 = [ 0.0, 0.0, 0.0, 1.0 ];


//------------------------------ The WebGL code ------------------------------

// Handling the Vertex Coordinates and the Vertex Normal Vectors
function initBuffers_2( model ) {		
	// Vertex Coordinates		
	triangleVertexPositionBuffer_2 = gl_2.createBuffer();
	gl_2.bindBuffer(gl_2.ARRAY_BUFFER, triangleVertexPositionBuffer_2);
	gl_2.bufferData(gl_2.ARRAY_BUFFER, new Float32Array(model.vertices_2), gl_2.STATIC_DRAW);
	triangleVertexPositionBuffer_2.itemSize = 3;
	triangleVertexPositionBuffer_2.numItems =  model.vertices_2.length / 3;			

	// Associating to the vertex shader	
	gl_2.vertexAttribPointer(shaderProgram_2.vertexPositionAttribute, 
			triangleVertexPositionBuffer_2.itemSize, 
			gl_2.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors		
	triangleVertexNormalBuffer_2 = gl_2.createBuffer();
	gl_2.bindBuffer(gl_2.ARRAY_BUFFER, triangleVertexNormalBuffer_2);
	gl_2.bufferData(gl_2.ARRAY_BUFFER, new Float32Array( model.normals_2), gl_2.STATIC_DRAW);
	triangleVertexNormalBuffer_2.itemSize = 3;
	triangleVertexNormalBuffer_2.numItems = model.normals_2.length / 3;			

	// Associating to the vertex shader	
	gl_2.vertexAttribPointer(shaderProgram_2.vertexNormalAttribute, 
			triangleVertexNormalBuffer_2.itemSize, 
			gl_2.FLOAT, false, 0, 0);	
}

//  Drawing the model
function drawModel_2( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx_2, model.ty_2, model.tz_2 ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ_2 ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY_2 ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX_2 ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx_2, model.sy_2, model.sz_2 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl_2.getUniformLocation(shaderProgram_2, "uMVMatrix");	
	gl_2.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader	
	initBuffers_2(model);
	
	// Material properties	
	gl_2.uniform3fv( gl_2.getUniformLocation(shaderProgram_2, "k_ambient"), 
		flatten(model.kAmbi_2) );    
    gl_2.uniform3fv( gl_2.getUniformLocation(shaderProgram_2, "k_diffuse"),
        flatten(model.kDiff_2) );   
    gl_2.uniform3fv( gl_2.getUniformLocation(shaderProgram_2, "k_specular"),
        flatten(model.kSpec_2) );
	gl_2.uniform1f( gl_2.getUniformLocation(shaderProgram_2, "shininess"), 
		model.nPhong_2 );

    // Light Sources	
	var numLights = lightSources.length;	
	gl_2.uniform1i( gl_2.getUniformLocation(shaderProgram_2, "numLights"), 
		numLights );

	//Light Sources	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl_2.uniform1i( gl_2.getUniformLocation(shaderProgram_2, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );   
		gl_2.uniform4fv( gl_2.getUniformLocation(shaderProgram_2, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );   
		gl_2.uniform3fv( gl_2.getUniformLocation(shaderProgram_2, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing - primitiveType allows drawing as filled triangles / wireframe / vertices	
	if( primitiveType == gl_2.LINE_LOOP ) {				
		var i;		
		for( i = 0; i < triangleVertexPositionBuffer_2.numItems / 3; i++ ) {		
			gl_2.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {				
		gl_2.drawArrays(primitiveType, 0, triangleVertexPositionBuffer_2.numItems); 		
	}	
}

//  Drawing the 3D scene
function drawScene_2() {
	var pMatrix;	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer	
	gl_2.clear(gl_2.COLOR_BUFFER_BIT | gl_2.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType_2 == 0 ) {
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );	
		globalTz_2 = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer_2[0] = pos_Viewer_2[1] = pos_Viewer_2[3] = 0.0;
		pos_Viewer_2[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 45, 1, 0.05, 15 );
		globalTz_2 = -2.5;

		// The viewer is on (0,0,0)		
		pos_Viewer_2[0] = pos_Viewer_2[1] = pos_Viewer_2[2] = 0.0;		
		pos_Viewer_2[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl_2.getUniformLocation(shaderProgram_2, "uPMatrix");	
	gl_2.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	gl_2.uniform4fv( gl_2.getUniformLocation(shaderProgram_2, "viewerPosition"),
        flatten(pos_Viewer_2) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE	
	mvMatrix = translationMatrix( 0, 0, globalTz_2 );
		
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
		var lsmUniform = gl_2.getUniformLocation(shaderProgram_2, "allLights["+ String(i) + "].lightSourceMatrix");
		gl_2.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
	
	// Instantianting all scene models	
	for(var i = 0; i < sceneModels_2.length; i++ )
	{ 
		drawModel_2( sceneModels_2[i],
			   mvMatrix,
	           primitiveType_2 );
	}
}

//--------------------------------- Animation --------------------------------
var lastTime_2 = 0;

function animate_2() {	
	var timeNow = new Date().getTime();
	if( lastTime_2 != 0 ) {		
		var elapsed = timeNow - lastTime_2;		
		
		// Global rotation		
		if( globalRotationYY_ON_2 ) {
			globalAngleYY_2 += globalRotationYY_DIR_2 * globalRotationYY_SPEED_2 * (90 * elapsed) / 1000.0;
		}
		
		if( globalTranslationZZ_ON_2 ) {
			globalAngleZZ_2 += globalTranslationZZ_DIR_2 * globalTranslationZZ_SPEED_2 * (90 * elapsed) / 1000.0;
	    }

		// Local rotations	
		for(var i = 0; i < sceneModels_2.length; i++ )
	    {
			if( sceneModels_2[i].rotXXOn_2 ) {
				sceneModels_2[i].rotAngleXX_2 += sceneModels_2[i].rotXXDir_2 * sceneModels_2[i].rotXXSpeed_2 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_2[i].rotYYOn_2 ) {
				sceneModels_2[i].rotAngleYY_2 += sceneModels_2[i].rotYYDir_2 * sceneModels_2[i].rotYYSpeed_2 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_2[i].rotZZOn_2 ) {
				sceneModels_2[i].rotAngleZZ_2 += sceneModels_2[i].rotZZDir_2 * sceneModels_2[i].rotZZSpeed_2 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_2[i].traZZOn_2 ) {
				sceneModels_2[i].traAngleZZ_2 += sceneModels_2[i].traZZDir_2 * sceneModels_2[i].traZZSpeed_2 * (90 * elapsed) / 1000.0;
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
	lastTime_2 = timeNow;
}

// Timer
function tick_2() {	
	requestAnimFrame(tick_2);	
	drawScene_2();
	animate_2();
}

//----------------------------- User Interaction -----------------------------

function outputInfos_2(){
    
}

function setEventListeners_2(){
	
    // Dropdown list	
	var projection = document.getElementById("projection-selection_2");	
	projection.addEventListener("click", function(){		
		var p = projection.selectedIndex;				
		switch(p){			
			case 0 : projectionType_2 = 0;
				break;			
			case 1 : projectionType_2 = 1;
				break;
		}  	
	});      

	// Dropdown list	
	var list = document.getElementById("rendering-mode-selection_2");	
	list.addEventListener("click", function(){						
		var mode = list.selectedIndex;				
		switch(mode){
			case 0 : primitiveType_2 = gl_2.TRIANGLES;
				break;			
			case 1 : primitiveType_2 = gl_2.LINE_LOOP;
				break;			
			case 2 : primitiveType_2 = gl_2.POINTS;
				break;
		}
	});      

	// Button events
	document.getElementById("XX-on-off-button_2").onclick = function(){	
		for(var i = 0; i < sceneModels_2.length; i++ )
	    {
			if( sceneModels_2[i].rotXXOn_2 ) {
				sceneModels_2[i].rotXXOn_2 = false;
			}
			else {
				sceneModels_2[i].rotXXOn_2 = true;
			}	
		}
	};

	document.getElementById("XX-direction-button_2").onclick = function(){
		for(var i = 0; i < sceneModels_2.length; i++ )
	    {
			if( sceneModels_2[i].rotXXDir_2 == 1 ) {
				sceneModels_2[i].rotXXDir_2 = -1;
			}
			else {
				sceneModels_2[i].rotXXDir_2 = 1;
			}	
		}
	};      

	document.getElementById("XX-slower-button_2").onclick = function(){
		for(var i = 0; i < sceneModels_2.length; i++ )
	    {
			sceneModels_2[i].rotXXSpeed_2 *= 0.75; 
		}
	};      

	document.getElementById("XX-faster-button_2").onclick = function(){
		for(var i = 0; i < sceneModels_2.length; i++ )
	    {
			sceneModels_2[i].rotXXSpeed_2 *= 1.25; 
		}
	};  
}

//--------------------------- WebGL Initialization ---------------------------

function initWebGL_2( canvas ) {
	try {
		gl_2 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
		primitiveType_2 = gl_2.TRIANGLES;	
		gl_2.enable( gl_2.CULL_FACE );	
		gl_2.cullFace( gl_2.BACK );
		gl_2.enable( gl_2.DEPTH_TEST ); 
	} catch (e) {
	}
	if (!gl_2) {
		alert("Could not initialise WebGL 2, sorry! :-(");
	}
}

function runWebGL_2() {	
	var canvas = document.getElementById("my-canvas-2");	
	initWebGL_2( canvas );
	shaderProgram_2 = initShaders( gl_2 );	
	setEventListeners_2();	
	tick_2(); 
	outputInfos_2();
}
