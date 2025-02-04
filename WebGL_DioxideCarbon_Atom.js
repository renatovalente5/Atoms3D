
//----------------------------- Global Variables -----------------------------

var gl_4 = null; // WebGL context
var shaderProgram_4 = null;
var triangleVertexPositionBuffer_4 = null;	
var triangleVertexNormalBuffer_4 = null;	

// The GLOBAL transformation parameters
var globalAngleXX_4 = 0.0;
var globalAngleYY_4 = 0.0;
var globalAngleZZ_4 = 0.0;
var globalTz_4 = 0.0;

// GLOBAL Animation controls
var globalRotationXX_ON_4 = 0;
var globalRotationXX_DIR_4 = 1;
var globalRotationXX_SPEED_4 = 0.4;

var globalRotationYY_ON_4 = 0;
var globalRotationYY_DIR_4 = 1;
var globalRotationYY_SPEED_4 = 0.4;

var globalRotationZZ_ON_4 = 1;
var globalRotationZZ_DIR_4 = 1;
var globalRotationZZ_SPEED_4 = 0.4;

// To allow choosing the way of drawing the model triangles
var primitiveType_4 = null;
 
// To allow choosing the projection type
var projectionType_4 = 0;

// The viewer position
var pos_Viewer_4 = [ 0.0, 0.0, 0.0, 1.0 ];

var randomDir_4 = 0;

//------------------------------ The WebGL code ------------------------------

// Handling the Vertex Coordinates and the Vertex Normal Vectors
function initBuffers_4( model ) {		
	// Vertex Coordinates		
	triangleVertexPositionBuffer_4 = gl_4.createBuffer();
	gl_4.bindBuffer(gl_4.ARRAY_BUFFER, triangleVertexPositionBuffer_4);
	gl_4.bufferData(gl_4.ARRAY_BUFFER, new Float32Array(model.vertices_4), gl_4.STATIC_DRAW);
	triangleVertexPositionBuffer_4.itemSize = 3;
	triangleVertexPositionBuffer_4.numItems =  model.vertices_4.length / 3;			

	// Associating to the vertex shader	
	gl_4.vertexAttribPointer(shaderProgram_4.vertexPositionAttribute, 
			triangleVertexPositionBuffer_4.itemSize, 
			gl_4.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors		
	triangleVertexNormalBuffer_4 = gl_4.createBuffer();
	gl_4.bindBuffer(gl_4.ARRAY_BUFFER, triangleVertexNormalBuffer_4);
	gl_4.bufferData(gl_4.ARRAY_BUFFER, new Float32Array( model.normals_4), gl_4.STATIC_DRAW);
	triangleVertexNormalBuffer_4.itemSize = 3;
	triangleVertexNormalBuffer_4.numItems = model.normals_4.length / 3;			

	// Associating to the vertex shader	
	gl_4.vertexAttribPointer(shaderProgram_4.vertexNormalAttribute, 
			triangleVertexNormalBuffer_4.itemSize, 
			gl_4.FLOAT, false, 0, 0);	
}

//  Drawing the model
function drawModel_4( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx_4, model.ty_4, model.tz_4 ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ_4 ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY_4 ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX_4 ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx_4, model.sy_4, model.sz_4 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl_4.getUniformLocation(shaderProgram_4, "uMVMatrix");	
	gl_4.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader	
	initBuffers_4(model);
	
	// Material properties	
	gl_4.uniform3fv( gl_4.getUniformLocation(shaderProgram_4, "k_ambient"), 
		flatten(model.kAmbi_4) );    
    gl_4.uniform3fv( gl_4.getUniformLocation(shaderProgram_4, "k_diffuse"),
        flatten(model.kDiff_4) );   
    gl_4.uniform3fv( gl_4.getUniformLocation(shaderProgram_4, "k_specular"),
        flatten(model.kSpec_4) );
	gl_4.uniform1f( gl_4.getUniformLocation(shaderProgram_4, "shininess"), 
		model.nPhong_4 );

    // Light Sources	
	var numLights = lightSources.length;	
	gl_4.uniform1i( gl_4.getUniformLocation(shaderProgram_4, "numLights"), 
		numLights );

	//Light Sources	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl_4.uniform1i( gl_4.getUniformLocation(shaderProgram_4, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );   
		gl_4.uniform4fv( gl_4.getUniformLocation(shaderProgram_4, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );   
		gl_4.uniform3fv( gl_4.getUniformLocation(shaderProgram_4, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing - primitiveType allows drawing as filled triangles / wireframe / vertices	
	if( primitiveType == gl_4.LINE_LOOP ) {				
		var i;		
		for( i = 0; i < triangleVertexPositionBuffer_4.numItems / 3; i++ ) {		
			gl_4.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {				
		gl_4.drawArrays(primitiveType, 0, triangleVertexPositionBuffer_4.numItems); 		
	}	
}

//  Drawing the 3D scene
function drawScene_4() {
	var pMatrix;	
	
	// Clearing the frame-buffer and the depth-buffer	
	gl_4.clear(gl_4.COLOR_BUFFER_BIT | gl_4.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType_4 == 0 ) {
		pMatrix = ortho( -1.5, 1.5, -1.5, 1.5, -1.5, 1.5 );	
		globalTz_4 = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer_4[0] = pos_Viewer_4[1] = pos_Viewer_4[3] = 0.0;
		pos_Viewer_4[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 65, 1, 0.05, 15 );
		globalTz_4 = -2.5;

		// The viewer is on (0,0,0)		
		pos_Viewer_4[0] = pos_Viewer_4[1] = pos_Viewer_4[2] = 0.0;		
		pos_Viewer_4[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl_4.getUniformLocation(shaderProgram_4, "uPMatrix");	
	gl_4.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	gl_4.uniform4fv( gl_4.getUniformLocation(shaderProgram_4, "viewerPosition"),
        flatten(pos_Viewer_4) );
	
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
		var lsmUniform = gl_4.getUniformLocation(shaderProgram_4, "allLights["+ String(i) + "].lightSourceMatrix");
		gl_4.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
	if(randomDir_4==0){

		// Instantianting all scene models	
		for(var i = 0; i < sceneModels_4.length; i++ )
		{
			if(i==0 || i==9 || i==18){
				drawModel_4( sceneModels_4[i],
					translationMatrix( 0, 0, globalTz_4 ),
					primitiveType_4 );
			}else if(i==1 || i== 2 || i==3 || i==4 || i==5 || i==6 || i==7 || i==8 ){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( -0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
					rotationZZMatrix( globalAngleZZ_4 ))),
					primitiveType_4 );
			}else if(i==10 || i==11 || i==12 || i==13 || i==14 || i==15 || i==16 || i==17){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
					rotationZZMatrix( globalAngleZZ_4))),
					primitiveType_4 );
			}else if(i==19 || i==20 || i==21 || i==22 || i==23 || i==24){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
					rotationZZMatrix( globalAngleZZ_4))),
					primitiveType_4 );
			}else{
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
						rotationZZMatrix( globalAngleZZ_4 ))),
					primitiveType_4 );
			}
		}
	}else{
		// Instantianting all scene models	
		for(var i = 0; i < sceneModels_4.length; i++ )
		{
			if(i==0 || i==9 || i==18){
				drawModel_4( sceneModels_4[i],
					translationMatrix( 0, 0, globalTz_4 ),
					primitiveType_4 );
			}else if(i==1 || i==3 || i==4 || i==6 || i==8 ){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( -0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 * (-1)), rotationYYMatrix( globalAngleYY_4 )),
					rotationZZMatrix( globalAngleZZ_4 * (-1) ))),
					primitiveType_4 );
			}else if(i== 2 || i==5 || i==7 ){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( -0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 * (-1) )),
					rotationZZMatrix( globalAngleZZ_4 ))),
					primitiveType_4 );
			}else if(i==10 || i==12 || i==14 || i==15 || i==17){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 * (-1) ), rotationYYMatrix( globalAngleYY_4 * (-1) )),
					rotationZZMatrix( globalAngleZZ_4))),
					primitiveType_4 );
			}else if(i==10 || i==11 || i==13 || i==14 || i==16 || i==17){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
					rotationZZMatrix( globalAngleZZ_4 * (-1)))),
					primitiveType_4 );
			}else if( i==12 || i==14 || i==15 || i==17){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0.70, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 * (-1) ), rotationYYMatrix( globalAngleYY_4 * (-1) )),
					rotationZZMatrix( globalAngleZZ_4))),
					primitiveType_4 );
			}else if(i==19 || i==21 || i==22 || i==24){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
					rotationZZMatrix( globalAngleZZ_4 * (-1)))),
					primitiveType_4 );
			}else if(i==20 || i==22 || i==23){
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 * (-1)), rotationYYMatrix( globalAngleYY_4 * (-1))),
					rotationZZMatrix( globalAngleZZ_4))),
					primitiveType_4 );
			}else{
				drawModel_4( sceneModels_4[i],
					mult(translationMatrix( 0, 0, globalTz_4),
					mult(mult(rotationXXMatrix( globalAngleXX_4 ), rotationYYMatrix( globalAngleYY_4 )),
						rotationZZMatrix( globalAngleZZ_4 * (-1) ))),
					primitiveType_4 );
			}
		}
	}
}

//--------------------------------- Animation --------------------------------
var lastTime_2 = 0;

function animate_4() {	
	var timeNow = new Date().getTime();
	if( lastTime_2 != 0 ) {		
		var elapsed = timeNow - lastTime_2;		
		
		// Global rotation		
		if( globalRotationXX_ON_4 ) {
			globalAngleXX_4 += globalRotationXX_DIR_4 * globalRotationXX_SPEED_4 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationYY_ON_4 ) {
			globalAngleYY_4 += globalRotationYY_DIR_4 * globalRotationYY_SPEED_4 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationZZ_ON_4 ) {
			globalAngleZZ_4 += globalRotationZZ_DIR_4 * globalRotationZZ_SPEED_4 * (90 * elapsed) / 1000.0;
		}

		// Local rotations	
		for(var i = 0; i < sceneModels_4.length; i++ )
	    {
			if( sceneModels_4[i].rotXXOn_4 ) {
				sceneModels_4[i].rotAngleXX_2 += sceneModels_4[i].rotXXDir_4 * sceneModels_4[i].rotXXSpeed_4 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_4[i].rotYYOn_4 ) {
				sceneModels_4[i].rotAngleYY_4 += sceneModels_4[i].rotYYDir_4 * sceneModels_4[i].rotYYSpeed_4 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_4[i].rotZZOn_4 ) {
				sceneModels_4[i].rotAngleZZ_4 += sceneModels_4[i].rotZZDir_4 * sceneModels_4[i].rotZZSpeed_4 * (90 * elapsed) / 1000.0;
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
function tick_4() {	
	requestAnimFrame(tick_4);	
	drawScene_4();
	animate_4();
}

//----------------------------- User Interaction -----------------------------

function outputInfos_4(){
    
}

function checkMove_4(){
	if ((globalRotationXX_ON_4 == false && globalRotationYY_ON_4 == false && globalRotationZZ_ON_4 == false) || (globalRotationXX_ON_4 == 0 && globalRotationYY_ON_4 == 0 && globalRotationZZ_ON_4 == 0)){
		document.getElementById("start-button_4").disabled = false;
		document.getElementById("stop-button_4").disabled = true;
		old_globalRotationZZ_ON_4 = 0;
		document.getElementById("XX-randomDir-button_on_4").disabled = false;
		document.getElementById("XX-randomDir-button_off_4").disabled = true;
		randomDir_4 = 0;
	} else {
		document.getElementById("start-button_4").disabled = true;
		document.getElementById("stop-button_4").disabled = false;
	}
}

var resetClick_4 = 0;
var old_globalRotationXX_ON_4 = 0, old_globalRotationYY_ON_4 = 0, old_globalRotationZZ_ON_4 = 0, old_random_4 = 0; 

function setEventListeners_4(){
	
	// start/stop Molecule
	document.getElementById("start-button_4").onclick = function(){
		
		if (resetClick_4 == 0){
			if (old_random_4 == 0 || old_random_4 == false){
				document.getElementById("XX-randomDir-button_on_4").disabled = false;
				document.getElementById("XX-randomDir-button_off_4").disabled = true;
				randomDir_4 = 0;
			} else {
				document.getElementById("XX-randomDir-button_on_4").disabled = true;
				document.getElementById("XX-randomDir-button_off_4").disabled = false;
				randomDir_4 = 1;
			}

			if (old_globalRotationXX_ON_4 == 0 || old_globalRotationXX_ON_4 == false){
				document.getElementById("XX-start-button_4").disabled = false;
				document.getElementById("XX-stop-button_4").disabled = true;
				globalRotationXX_ON_4 = 0;
			} else {
				document.getElementById("XX-start-button_4").disabled = true;
				document.getElementById("XX-stop-button_4").disabled = false;
				globalRotationXX_ON_4 = 1;
			}

			if (old_globalRotationYY_ON_4 == 0 || old_globalRotationYY_ON_4 == false){
				document.getElementById("YY-start-button_4").disabled = false;
				document.getElementById("YY-stop-button_4").disabled = true;
				globalRotationYY_ON_4 = 0;
			} else {
				document.getElementById("YY-start-button_4").disabled = true;
				document.getElementById("YY-stop-button_4").disabled = false;
				globalRotationYY_ON_4 = 1;
			}

			if (old_globalRotationZZ_ON_4 == 0 || old_globalRotationZZ_ON_4 == false){
				document.getElementById("ZZ-start-button_4").disabled = false;
				document.getElementById("ZZ-stop-button_4").disabled = true;
				globalRotationZZ_ON_4 = 0;
			} else {
				document.getElementById("ZZ-start-button_4").disabled = true;
				document.getElementById("ZZ-stop-button_4").disabled = false;
				globalRotationZZ_ON_4 = 1;
			}
		} else {
			document.getElementById("XX-randomDir-button_on_4").disabled = false;
			document.getElementById("XX-randomDir-button_off_4").disabled = true;
			randomDir_4 = 0;
			document.getElementById("XX-start-button_4").disabled = false;
			document.getElementById("XX-stop-button_4").disabled = true;
			globalRotationXX_ON_4 = 0;
			document.getElementById("YY-start-button_4").disabled = false;
			document.getElementById("YY-stop-button_4").disabled = true;
			globalRotationYY_ON_4 = 0;
			document.getElementById("ZZ-start-button_4").disabled = true;
			document.getElementById("ZZ-stop-button_4").disabled = false;
			globalRotationZZ_ON_4 = 1;
		}	

		resetClick_4 = 0;
	}; 

	document.getElementById("stop-button_4").onclick = function(){
		old_globalRotationXX_ON_4 = globalRotationXX_ON_4;
		old_globalRotationYY_ON_4 = globalRotationYY_ON_4;
		old_globalRotationZZ_ON_4 = globalRotationZZ_ON_4;
		old_random_4 = randomDir_4;
		globalRotationXX_ON_4 = 0;
		globalRotationYY_ON_4 = 0;
		globalRotationZZ_ON_4 = 0;
		randomDir_4 = 0;
		document.getElementById("XX-start-button_4").disabled = false;
		document.getElementById("XX-stop-button_4").disabled = true;
		document.getElementById("YY-start-button_4").disabled = false;
		document.getElementById("YY-stop-button_4").disabled = true;
		document.getElementById("ZZ-start-button_4").disabled = false;
		document.getElementById("ZZ-stop-button_4").disabled = true;
		document.getElementById("XX-randomDir-button_on_4").disabled = false;
		document.getElementById("XX-randomDir-button_off_4").disabled = true;
	};

	// movement
	document.getElementById("XX-start-button_4").onclick = function(){
		globalRotationXX_ON_4 = 1;
		document.getElementById("stop-button_4").disabled = false;
		document.getElementById("start-button_4").disabled = true;
	};	
	
	document.getElementById("XX-stop-button_4").onclick = function(){
		globalRotationXX_ON_4 = 0;
		old_globalRotationXX_ON_4 = 0;
		if (randomDir_4 == 0){
			document.getElementById("XX-randomDir-button_on_4").disabled = false;
			document.getElementById("XX-randomDir-button_off_4").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_4").disabled = true;
			document.getElementById("XX-randomDir-button_off_4").disabled = false;
		}	
		checkMove_4();		
	};	
	
	document.getElementById("XX-direction-button_4").onclick = function(){
		if(globalRotationXX_DIR_4 == -1){
			globalRotationXX_DIR_4 = 1;
		}else{
			globalRotationXX_DIR_4 = -1;
		}
	};

	document.getElementById("YY-start-button_4").onclick = function(){
		globalRotationYY_ON_4 = 1;
		document.getElementById("stop-button_4").disabled = false;
		document.getElementById("start-button_4").disabled = true;
	};

	document.getElementById("YY-stop-button_4").onclick = function(){
		globalRotationYY_ON_4 = 0;
		old_globalRotationYY_ON_4 = 0;
		if (randomDir_4 == 0){
			document.getElementById("XX-randomDir-button_on_4").disabled = false;
			document.getElementById("XX-randomDir-button_off_4").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_4").disabled = true;
			document.getElementById("XX-randomDir-button_off_4").disabled = false;
		}	
		checkMove_4();
	};
	
	document.getElementById("YY-direction-button_4").onclick = function(){
		if(globalRotationYY_DIR_4 == -1){
			globalRotationYYIR_4 = 1;
		}else{
			globalRotationYY_DIR_4 = -1;
		}
	};
	
	document.getElementById("ZZ-start-button_4").onclick = function(){
		globalRotationZZ_ON_4 = 1;
		document.getElementById("stop-button_4").disabled = false;
		document.getElementById("start-button_4").disabled = true;
	};

	document.getElementById("ZZ-stop-button_4").onclick = function(){
		globalRotationZZ_ON_4 = 0;
		old_globalRotationZZ_ON_4 = 0;
		if (randomDir_4 == 0){
			document.getElementById("XX-randomDir-button_on_4").disabled = false;
			document.getElementById("XX-randomDir-button_off_4").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_4").disabled = true;
			document.getElementById("XX-randomDir-button_off_4").disabled = false;
		}	
		checkMove_4();
	};
	
	document.getElementById("ZZ-direction-button_4").onclick = function(){
		if(globalRotationZZ_DIR_4 == -1){
			globalRotationZZ_DIR_4 = 1;
		}else{
			globalRotationZZ_DIR_4 = -1;
		}
	};	

	document.getElementById("XX-randomDir-button_on_4").onclick = function(){
		document.getElementById("stop-button_4").disabled = false;
		document.getElementById("start-button_4").disabled = true;

		document.getElementById("XX-start-button_4").disabled = true;
		document.getElementById("XX-stop-button_4").disabled = false;
		globalRotationXX_ON_4 = 1;
		document.getElementById("YY-start-button_4").disabled = true;
		document.getElementById("YY-stop-button_4").disabled = false;
		globalRotationYY_ON_4 = 1;
		document.getElementById("ZZ-start-button_4").disabled = true;
		document.getElementById("ZZ-stop-button_4").disabled = false;
		globalRotationZZ_ON_4 = 1;
		randomDir_4 = 1;
	};

	document.getElementById("XX-randomDir-button_off_4").onclick = function(){
		randomDir_4 = 0;
	};

	// speed 
	document.getElementById("XX-slower-button_4").onclick = function(){
		globalRotationXX_SPEED_4 *= 0.75; 
		globalRotationYY_SPEED_4 *= 0.75;
		globalRotationZZ_SPEED_4 *= 0.75;
	};      

	document.getElementById("XX-faster-button_4").onclick = function(){
		globalRotationXX_SPEED_4 *= 1.25;
		globalRotationYY_SPEED_4 *= 1.25; 
		globalRotationZZ_SPEED_4 *= 1.25;
	};      

	// zoom 
	var countScale_4 = 0;
	document.getElementById("scale-up-button_4").onclick = function(){ 
		if (countScale_4 != 3){
			for(var i = 0; i < sceneModels_4.length; i++ )
			{
				sceneModels_4[i].sx_4 *= 1.1;
				sceneModels_4[i].sy_4 *= 1.1;
				sceneModels_4[i].sz_4 *= 1.1;	
			}
			countScale_4++;
		} 
		drawScene_4(); 
	};

	document.getElementById("scale-down-button_4").onclick = function(){
		if (countScale_4 != -3){
			for(var i = 0; i < sceneModels_4.length; i++ )
			{
				sceneModels_4[i].sx_4 *= 0.9;
				sceneModels_4[i].sy_4 *= 0.9;
				sceneModels_4[i].sz_4 *= 0.9;	
			}
			countScale_4--;
		} 
		drawScene_4(); 
	};
	
	// projection 	
	var projection = document.getElementById("projection-selection_4");	
	projection.addEventListener("click", function(){		
		var p = projection.selectedIndex;				
		switch(p){			
			case 0 : projectionType_4 = 0;
				break;			
			case 1 : projectionType_4 = 1;
				break;
		}  		
	});      

	// rendering	
	var list = document.getElementById("rendering-mode-selection_4");	
	list.addEventListener("click", function(){						
		var mode = list.selectedIndex;				
		switch(mode){
			case 0 : primitiveType_4 = gl_4.TRIANGLES;
				break;			
			case 1 : primitiveType_4 = gl_4.LINE_LOOP;
				break;			
			case 2 : primitiveType_4 = gl_4.POINTS;
				break;
		}
	});  
	
	document.getElementById("reset-button_4").onclick = function(){
		resetClick_4 = 1;

		document.getElementById("stop-button_4").disabled = true;
		document.getElementById("start-button_4").disabled = false;
		
		document.getElementById("XX-start-button_4").disabled = false;
		document.getElementById("XX-stop-button_4").disabled = true;
		document.getElementById("YY-start-button_4").disabled = false;
		document.getElementById("YY-stop-button_4").disabled = true;
		document.getElementById("ZZ-start-button_4").disabled = false;
		document.getElementById("ZZ-stop-button_4").disabled = true;
		document.getElementById("XX-randomDir-button_on_4").disabled = false;
		document.getElementById("XX-randomDir-button_off_4").disabled = true;
		
		globalRotationXX_ON_2 = 0;
		globalRotationYY_ON_2 = 0;
		globalRotationZZ_ON_2 = 0;
		globalAngleXX_4 = 0;
		globalAngleYY_4 = 0;
		globalAngleZZ_4 = 0;
		randomDir_4 = 0;

		globalRotationXX_SPEED_4 = 0.4;
		globalRotationYY_SPEED_4 = 0.4;
		globalRotationZZ_SPEED_4 = 0.4;

		// NUCLEO O-1 (ESQUERDA)
		sceneModels_4[0].tx_4 = -0.70; sceneModels_4[0].ty_4 = 0;
		sceneModels_4[0].sx_4 = 0.1; sceneModels_4[0].sy_4 = 0.1; sceneModels_4[0].sz_4 = 0.1;

		// ELETRAO 1 DENTRO NUCLEO O-1 
		sceneModels_4[1].tx_4 = 0; sceneModels_4[1].ty_4 = 0.35;
		sceneModels_4[1].sx_4 = 0.03; sceneModels_4[1].sy_4 = 0.03; sceneModels_4[1].sz_4 = 0.03;

		// ELETRAO 2 DENTRO NUCLEO O-1
		sceneModels_4[2].tx_4 = -0.25; sceneModels_4[2].ty_4 = 0.25;
		sceneModels_4[2].sx_4 = 0.03; sceneModels_4[2].sy_4 = 0.03; sceneModels_4[2].sz_4 = 0.03;

		// ELETRAO 1 FORA NUCLEO O-1 
		sceneModels_4[3].tx_4 = -0.25; sceneModels_4[3].ty_4 = -0.25;
		sceneModels_4[3].sx_4 = 0.03; sceneModels_4[3].sy_4 = 0.03; sceneModels_4[3].sz_4 = 0.03;

		// ELETRAO 2 FORA NUCLEO O-1
		sceneModels_4[4].tx_4 = 0; sceneModels_4[4].ty_4 = -0.30;
		sceneModels_4[4].sx_4 = 0.03; sceneModels_4[4].sy_4 = 0.03; sceneModels_4[4].sz_4 = 0.03;

		// ELETRAO 3 FORA NUCLEO O-1
		sceneModels_4[5].tx_4 = 0.25; sceneModels_4[5].ty_4 = -0.25;
		sceneModels_4[5].sx_4 = 0.03; sceneModels_4[5].sy_4 = 0.03; sceneModels_4[5].sz_4 = 0.03;

		// ELETRAO 4 FORA NUCLEO O-1
		sceneModels_4[6].tx_4 = 0.25; sceneModels_4[6].ty_4 = 0.25;
		sceneModels_4[6].sx_4 = 0.03; sceneModels_4[6].sy_4 = 0.03; sceneModels_4[6].sz_4 = 0.03;

		// ELETRAO 5 DENTRO NUCLEO O-1
		sceneModels_4[7].tx_4 = 0.15; sceneModels_4[7].ty_4 = 0;
		sceneModels_4[7].sx_4 = 0.03; sceneModels_4[7].sy_4 = 0.03; sceneModels_4[7].sz_4 = 0.03;

		// ELETRAO 6 DENTRO NUCLEO O-1 
		sceneModels_4[8].tx_4 = -0.15; sceneModels_4[8].ty_4 = 0;
		sceneModels_4[8].sx_4 = 0.03; sceneModels_4[8].sy_4 = 0.03; sceneModels_4[8].sz_4 = 0.03;

		// NUCLEO O-2 (DIREITO)
		sceneModels_4[9].tx_4 = 0.70; sceneModels_4[9].ty_4 = 0;
		sceneModels_4[9].sx_4 = 0.1; sceneModels_4[9].sy_4 = 0.1; sceneModels_4[9].sz_4 = 0.1;

		// ELETRAO 1 DENTRO NUCLEO O-2 
		sceneModels_4[10].tx_4 = 0; sceneModels_4[10].ty_4 = 0.35;
		sceneModels_4[10].sx_4 = 0.03; sceneModels_4[10].sy_4 = 0.03; sceneModels_4[10].sz_4 = 0.03;

		// ELETRAO 2 FORA NUCLEO O-2
		sceneModels_4[11].tx_4 = -0.25; sceneModels_4[11].ty_4 = 0.25;
		sceneModels_4[11].sx_4 = 0.03; sceneModels_4[11].sy_4 = 0.03; sceneModels_4[11].sz_4 = 0.03;

		// ELETRAO 1 FORA NUCLEO O-2 
		sceneModels_4[12].tx_4 = -0.25; sceneModels_4[12].ty_4 = -0.25;
		sceneModels_4[12].sx_4 = 0.03; sceneModels_4[12].sy_4 = 0.03; sceneModels_4[12].sz_4 = 0.03;

		// ELETRAO 2 FORA NUCLEO O-2
		sceneModels_4[13].tx_4 = 0; sceneModels_4[13].ty_4 = -0.30;
		sceneModels_4[13].sx_4 = 0.03; sceneModels_4[13].sy_4 = 0.03; sceneModels_4[13].sz_4 = 0.03;

		// ELETRAO 3 FORA NUCLEO O-2
		sceneModels_4[14].tx_4 = 0.25; sceneModels_4[14].ty_4 = -0.25;
		sceneModels_4[14].sx_4 = 0.03; sceneModels_4[14].sy_4 = 0.03; sceneModels_4[14].sz_4 = 0.03;

		// ELETRAO 4 FORA NUCLEO O-2
		sceneModels_4[15].tx_4 = 0.25; sceneModels_4[15].ty_4 = 0.25;
		sceneModels_4[15].sx_4 = 0.03; sceneModels_4[15].sy_4 = 0.03; sceneModels_4[15].sz_4 = 0.03;

		// ELETRAO 5 DENTRO NUCLEO O-2
		sceneModels_4[16].tx_4 = 0.15; sceneModels_4[16].ty_4 = 0;
		sceneModels_4[16].sx_4 = 0.03; sceneModels_4[16].sy_4 = 0.03; sceneModels_4[16].sz_4 = 0.03;

		// ELETRAO 6 DENTRO NUCLEO O-2 
		sceneModels_4[17].tx_4 = -0.15; sceneModels_4[17].ty_4 = 0;
		sceneModels_4[17].sx_4 = 0.03; sceneModels_4[17].sy_4 = 0.03; sceneModels_4[17].sz_4 = 0.03;

		// NUCLEO C (DIREITO)
		sceneModels_4[18].tx_4 = 0; sceneModels_4[18].ty_4 = 0;
		sceneModels_4[18].sx_4 = 0.1; sceneModels_4[18].sy_4 = 0.1; sceneModels_4[18].sz_4 = 0.1;

		// ELETRAO 1 FORA NUCLEO C
		sceneModels_4[19].tx_4 = 0.15; sceneModels_4[19].ty_4 = 0;
		sceneModels_4[19].sx_4 = 0.03; sceneModels_4[19].sy_4 = 0.03; sceneModels_4[19].sz_4 = 0.03;

		// ELETRAO 2 FORA NUCLEO C
		sceneModels_4[20].tx_4 = -0.25; sceneModels_4[20].ty_4 = 0.25;
		sceneModels_4[20].sx_4 = 0.03; sceneModels_4[20].sy_4 = 0.03; sceneModels_4[20].sz_4 = 0.03;

		// ELETRAO 1 FORA NUCLEO C
		sceneModels_4[21].tx_4 = -0.25; sceneModels_4[21].ty_4 = -0.25;
		sceneModels_4[21].sx_4 = 0.03; sceneModels_4[21].sy_4 = 0.03; sceneModels_4[21].sz_4 = 0.03;

		// ELETRAO 2 FORA NUCLEO C
		sceneModels_4[22].tx_4 = -0.15; sceneModels_4[22].ty_4 = 0;
		sceneModels_4[22].sx_4 = 0.03; sceneModels_4[22].sy_4 = 0.03; sceneModels_4[22].sz_4 = 0.03;

		// ELETRAO 3 DENTRO NUCLEO C
		sceneModels_4[23].tx_4 = 0.25; sceneModels_4[23].ty_4 = -0.25;
		sceneModels_4[23].sx_4 = 0.03; sceneModels_4[23].sy_4 = 0.03; sceneModels_4[23].sz_4 = 0.03;

		// ELETRAO 4 DENTRO NUCLEO C
		sceneModels_4[24].tx_4 = 0.25; sceneModels_4[24].ty_4 = 0.25;
		sceneModels_4[24].sx_4 = 0.03; sceneModels_4[24].sy_4 = 0.03; sceneModels_4[24].sz_4 = 0.03;

		for(var i = 0; i < sceneModels_4.length; i++ )
		{
			sceneModels_4[i].rotXXOn_4 = false;	
			sceneModels_4[i].rotYYOn_4 = false;
			sceneModels_4[i].rotZZOn_4 = false;
			sceneModels_4[i].rotXXSpeed_4 = 1;
			sceneModels_4[i].rotYYSpeed_4 = 1;
			sceneModels_4[i].rotZZSpeed_4 = 1;
		}

		drawScene();  
	};
}

//--------------------------- WebGL Initialization ---------------------------

function initWebGL_4( canvas ) {
	try {
		gl_4 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
		primitiveType_4 = gl_4.TRIANGLES;	
		gl_4.enable( gl_4.CULL_FACE );	
		gl_4.cullFace( gl_4.BACK );
		gl_4.enable( gl_4.DEPTH_TEST ); 
	} catch (e) {
	}
	if (!gl_4) {
		alert("Could not initialise WebGL 4, sorry! :-(");
	}
}

function runWebGL_4() {	
	var canvas = document.getElementById("my-canvas-2");	
	initWebGL_4( canvas );
	shaderProgram_4 = initShaders( gl_4 );	
	setEventListeners_4();	
	tick_4(); 
	outputInfos_4();
}
