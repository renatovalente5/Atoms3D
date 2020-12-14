
//----------------------------- Global Variables -----------------------------

var gl_6 = null; // WebGL context
var shaderProgram_6 = null;
var triangleVertexPositionBuffer_6 = null;	
var triangleVertexNormalBuffer_6 = null;	

// The GLOBAL transformation parameters
var globalAngleXX_6 = 0.0;
var globalAngleYY_6 = 0.0;
var globalAngleZZ_6 = 0.0;
var globalTz_6 = 0.0;

// GLOBAL Animation controls
var globalRotationXX_ON_6 = 0;
var globalRotationXX_DIR_6 = 1;
var globalRotationXX_SPEED_6 = 0.4;

var globalRotationYY_ON_6 = 0;
var globalRotationYY_DIR_6 = 1;
var globalRotationYY_SPEED_6 = 0.4;

var globalRotationZZ_ON_6 = 1;
var globalRotationZZ_DIR_6 = 1;
var globalRotationZZ_SPEED_6 = 0.4;

// To allow choosing the way of drawing the model triangles
var primitiveType_6 = null;
 
// To allow choosing the projection type
var projectionType_6 = 0;

// The viewer position
var pos_Viewer_6 = [ 0.0, 0.0, 0.0, 1.0 ];

var randomDir = 0;
var stopped = 0;
var aux = []
var geralSave_6 = null;
var ii = 0;

//------------------------------ The WebGL code ------------------------------

// Handling the Vertex Coordinates and the Vertex Normal Vectors
function initBuffers_6( model ) {		
	// Vertex Coordinates		
	triangleVertexPositionBuffer_6 = gl_6.createBuffer();
	gl_6.bindBuffer(gl_6.ARRAY_BUFFER, triangleVertexPositionBuffer_6);
	gl_6.bufferData(gl_6.ARRAY_BUFFER, new Float32Array(model.vertices_6), gl_6.STATIC_DRAW);
	triangleVertexPositionBuffer_6.itemSize = 3;
	triangleVertexPositionBuffer_6.numItems =  model.vertices_6.length / 3;			

	// Associating to the vertex shader	
	gl_6.vertexAttribPointer(shaderProgram_6.vertexPositionAttribute, 
			triangleVertexPositionBuffer_6.itemSize, 
			gl_6.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors		
	triangleVertexNormalBuffer_6 = gl_6.createBuffer();
	gl_6.bindBuffer(gl_6.ARRAY_BUFFER, triangleVertexNormalBuffer_6);
	gl_6.bufferData(gl_6.ARRAY_BUFFER, new Float32Array( model.normals_6), gl_6.STATIC_DRAW);
	triangleVertexNormalBuffer_6.itemSize = 3;
	triangleVertexNormalBuffer_6.numItems = model.normals_6.length / 3;			

	// Associating to the vertex shader	
	gl_6.vertexAttribPointer(shaderProgram_6.vertexNormalAttribute, 
			triangleVertexNormalBuffer_6.itemSize, 
			gl_6.FLOAT, false, 0, 0);	
}

//  Drawing the model
function drawModel_6( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx_6, model.ty_6, model.tz_6 ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ_6 ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY_6 ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX_6 ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx_6, model.sy_6, model.sz_6 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl_6.getUniformLocation(shaderProgram_6, "uMVMatrix");	
	gl_6.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader	
	initBuffers_6(model);
	
	// Material properties	
	gl_6.uniform3fv( gl_6.getUniformLocation(shaderProgram_6, "k_ambient"), 
		flatten(model.kAmbi_6) );    
    gl_6.uniform3fv( gl_6.getUniformLocation(shaderProgram_6, "k_diffuse"),
        flatten(model.kDiff_6) );   
    gl_6.uniform3fv( gl_6.getUniformLocation(shaderProgram_6, "k_specular"),
        flatten(model.kSpec_6) );
	gl_6.uniform1f( gl_6.getUniformLocation(shaderProgram_6, "shininess"), 
		model.nPhong_6 );

    // Light Sources	
	var numLights = lightSources.length;	
	gl_6.uniform1i( gl_6.getUniformLocation(shaderProgram_6, "numLights"), 
		numLights );

	//Light Sources	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl_6.uniform1i( gl_6.getUniformLocation(shaderProgram_6, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );   
		gl_6.uniform4fv( gl_6.getUniformLocation(shaderProgram_6, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );   
		gl_6.uniform3fv( gl_6.getUniformLocation(shaderProgram_6, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing - primitiveType allows drawing as filled triangles / wireframe / vertices	
	if( primitiveType == gl_6.LINE_LOOP ) {				
		var i;		
		for( i = 0; i < triangleVertexPositionBuffer_6.numItems / 3; i++ ) {		
			gl_6.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {				
		gl_6.drawArrays(primitiveType, 0, triangleVertexPositionBuffer_6.numItems); 		
	}	
}

//  Drawing the 3D scene
function drawScene_6() {
	var pMatrix;	
	
	// Clearing the frame-buffer and the depth-buffer	
	gl_6.clear(gl_6.COLOR_BUFFER_BIT | gl_6.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType_6 == 0 ) {
		pMatrix = ortho( -1.5, 1.5, -1.5, 1.5, -1.5, 1.5 );	
		globalTz_6 = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer_6[0] = pos_Viewer_6[1] = pos_Viewer_6[3] = 0.0;
		pos_Viewer_6[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 65, 1, 0.05, 15 );
		globalTz_6 = -2.5;

		// The viewer is on (0,0,0)		
		pos_Viewer_6[0] = pos_Viewer_6[1] = pos_Viewer_6[2] = 0.0;		
		pos_Viewer_6[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl_6.getUniformLocation(shaderProgram_6, "uPMatrix");	
	gl_6.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	gl_6.uniform4fv( gl_6.getUniformLocation(shaderProgram_6, "viewerPosition"),
		flatten(pos_Viewer_6) );
		
	// mvMatrix = mult(translationMatrix( 0, 0, globalTz_6),
	// mult(mult(rotationXXMatrix( globalAngleXX_6 ), rotationYYMatrix( globalAngleYY_6 )),
	// 		  rotationZZMatrix( globalAngleZZ_6)));
	
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
		var lsmUniform = gl_6.getUniformLocation(shaderProgram_6, "allLights["+ String(i) + "].lightSourceMatrix");
		gl_6.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
	if(randomDir==1){

		var count = 0;
		ii = 0;
		// Instantianting all scene models	
		for(var i = 0; i < sceneModels_6.length; i++ )
		{	
			if(i < stopped){
				drawModel_6( sceneModels_6[i],
					translationMatrix( 0, 0, globalTz_6 ),
					primitiveType_6 );
			}else{
				//alert(sceneModels_6[i].tx_6 + " "+ sceneModels_6[i].ty_6)
				//alert("count " + count);
				if(count < aux[ii]){
					if(count % 3 == 0){
					drawModel_6( sceneModels_6[i],
						mult(translationMatrix( sceneModels_6[ii].tx_6, sceneModels_6[ii].ty_6, globalTz_6),
						mult(mult(rotationXXMatrix( globalAngleXX_6 *(-1)), rotationYYMatrix( globalAngleYY_6 )),
						rotationZZMatrix( globalAngleZZ_6 *(-1)))),
						primitiveType_6 );
					
					}else{
					drawModel_6( sceneModels_6[i],
						mult(translationMatrix( sceneModels_6[ii].tx_6, sceneModels_6[ii].ty_6, globalTz_6),
						mult(mult(rotationXXMatrix( globalAngleXX_6 ), rotationYYMatrix( globalAngleYY_6 *(-1))),
						rotationZZMatrix( globalAngleZZ_6 ))),
						primitiveType_6 );
					}
					count++;
				}else{
					ii++;
					if(count % 3 == 0){
					drawModel_6( sceneModels_6[i],
						mult(translationMatrix( sceneModels_6[ii].tx_6, sceneModels_6[ii].ty_6, globalTz_6),
						mult(mult(rotationXXMatrix( globalAngleXX_6 *(-1)), rotationYYMatrix( globalAngleYY_6 )),
						rotationZZMatrix( globalAngleZZ_6 *(-1)))),
						primitiveType_6 );
					}else{
					drawModel_6( sceneModels_6[i],
						mult(translationMatrix( sceneModels_6[ii].tx_6, sceneModels_6[ii].ty_6, globalTz_6),
						mult(mult(rotationXXMatrix( globalAngleXX_6 ), rotationYYMatrix( globalAngleYY_6 *(-1))),
						rotationZZMatrix( globalAngleZZ_6 ))),
						primitiveType_6 );
					}
					count = 1;
				}
			}
		}
	}else{

		var count = 0;
		ii = 0;
		// Instantianting all scene models	
		for(var i = 0; i < sceneModels_6.length; i++ )
		{	
			if(i < stopped){
				drawModel_6( sceneModels_6[i],
					translationMatrix( 0, 0, globalTz_6 ),
					primitiveType_6 );
			}else{
				//alert(sceneModels_6[i].tx_6 + " "+ sceneModels_6[i].ty_6)
				//alert("count " + count);
				if(count < aux[ii]){
					drawModel_6( sceneModels_6[i],
						mult(translationMatrix( sceneModels_6[ii].tx_6, sceneModels_6[ii].ty_6, globalTz_6),
						mult(mult(rotationXXMatrix( globalAngleXX_6 ), rotationYYMatrix( globalAngleYY_6 )),
						rotationZZMatrix( globalAngleZZ_6 ))),
						primitiveType_6 );
					count++;
				}else{
					ii++;
					drawModel_6( sceneModels_6[i],
						mult(translationMatrix( sceneModels_6[ii].tx_6, sceneModels_6[ii].ty_6, globalTz_6),
						mult(mult(rotationXXMatrix( globalAngleXX_6 ), rotationYYMatrix( globalAngleYY_6 )),
						rotationZZMatrix( globalAngleZZ_6 ))),
						primitiveType_6 );
					count = 1;
				}
			}
		}
	}

	// // Instantianting all scene models	
	// for(var i = 0; i < sceneModels_6.length; i++ )
	// { 
	// 	drawModel_6( sceneModels_6[i],
	// 		mult(translationMatrix( sceneModels_6[i].tx_6, sceneModels_6[i].ty_6, globalTz_6),
	// 		mult(mult(rotationXXMatrix( globalAngleXX_6 ), rotationYYMatrix( globalAngleYY_6 )),
	// 				  rotationZZMatrix( globalAngleZZ_6))),
	// 			primitiveType_6 );
	// }
}

//--------------------------------- Animation --------------------------------
var lastTime_6 = 0;

function animate_6() {	
	var timeNow = new Date().getTime();
	if( lastTime_6 != 0 ) {		
		var elapsed = timeNow - lastTime_6;		
		
		// Global rotation		
		if( globalRotationXX_ON_6 ) {
			globalAngleXX_6 += globalRotationXX_DIR_6 * globalRotationXX_SPEED_6 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationYY_ON_6 ) {
			globalAngleYY_6 += globalRotationYY_DIR_6 * globalRotationYY_SPEED_6 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationZZ_ON_6 ) {
			globalAngleZZ_6 += globalRotationZZ_DIR_6 * globalRotationZZ_SPEED_6 * (90 * elapsed) / 1000.0;
		}

		// Local rotations	
		for(var i = 0; i < sceneModels_6.length; i++ )
	    {
			if( sceneModels_6[i].rotXXOn_6 ) {
				sceneModels_6[i].rotAngleXX_6 += sceneModels_6[i].rotXXDir_6 * sceneModels_6[i].rotXXSpeed_6 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_6[i].rotYYOn_6 ) {
				sceneModels_6[i].rotAngleYY_6 += sceneModels_6[i].rotYYDir_6 * sceneModels_6[i].rotYYSpeed_6 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_6[i].rotZZOn_6 ) {
				sceneModels_6[i].rotAngleZZ_6 += sceneModels_6[i].rotZZDir_6 * sceneModels_6[i].rotZZSpeed_6 * (90 * elapsed) / 1000.0;
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
	lastTime_6 = timeNow;
}

// Timer
function tick_6() {	
	requestAnimFrame(tick_6);	
	drawScene_6();
	animate_6();
}

//----------------------------- User Interaction -----------------------------

function outputInfos_6(){
    
}

function checkMove_6(){
	if ((globalRotationXX_ON_6 == false && globalRotationYY_ON_6 == false && globalRotationZZ_ON_6 == false) || (globalRotationXX_ON_6 == 0 && globalRotationYY_ON_6 == 0 && globalRotationZZ_ON_6 == 0)){
		document.getElementById("start-button_6").disabled = false;
		document.getElementById("stop-button_6").disabled = true;
	} else {
		document.getElementById("start-button_6").disabled = true;
		document.getElementById("stop-button_6").disabled = false;
	}
}

var resetClick_6 = 0;

function setEventListeners_6(){
	
	var old_globalRotationXX_ON_6, old_globalRotationYY_ON_6, old_globalRotationZZ_ON_6, old_random; 

	// start/stop Molecule
	document.getElementById("start-button_6").onclick = function(){

		if (old_random == 0 || old_random == false){
			document.getElementById("XX-randomDir-button_on_6").disabled = false;
			document.getElementById("XX-randomDir-button_off_6").disabled = true;
		} else{
			if (resetClick_6 == 0){
				document.getElementById("XX-randomDir-button_on_6").disabled = true;
				document.getElementById("XX-randomDir-button_off_6").disabled = false;
				randomDir = 1;
			} else {
				document.getElementById("XX-randomDir-button_on_6").disabled = false;
				document.getElementById("XX-randomDir-button_off_6").disabled = true;
				randomDir = 0;
			}	
		}

		if (old_globalRotationXX_ON_6 == 0 || old_globalRotationXX_ON_6 == false){
			document.getElementById("XX-start-button_6").disabled = false;
			document.getElementById("XX-stop-button_6").disabled = true;
		} else {
			if (resetClick_6 == 0){
				document.getElementById("XX-start-button_6").disabled = true;
				document.getElementById("XX-stop-button_6").disabled = false;
				globalRotationXX_ON_6 = 1;
			} else {
				document.getElementById("XX-start-button_6").disabled = false;
				document.getElementById("XX-stop-button_6").disabled = true;
				globalRotationXX_ON_6 = 0;
			}	
		}

		if (old_globalRotationYY_ON_6 == 0 || old_globalRotationYY_ON_6 == false){
			document.getElementById("YY-start-button_6").disabled = false;
			document.getElementById("YY-stop-button_6").disabled = true;
		} else {
			if (resetClick_6 == 0){
				document.getElementById("YY-start-button_6").disabled = true;
				document.getElementById("YY-stop-button_6").disabled = false;
				globalRotationYY_ON_6 = 1;
			} else {
				document.getElementById("YY-start-button_6").disabled = false;
				document.getElementById("YY-stop-button_6").disabled = true;
				globalRotationYY_ON_6 = 0;
			}
		}

		if (old_globalRotationZZ_ON_6 == 0 || old_globalRotationZZ_ON_6 == false){
			document.getElementById("ZZ-start-button_6").disabled = false;
			document.getElementById("ZZ-stop-button_6").disabled = true;
		} else {
			document.getElementById("ZZ-start-button_6").disabled = true;
			document.getElementById("ZZ-stop-button_6").disabled = false;
			globalRotationZZ_ON_6 = 1;
		}

		resetClick_6 = 0;
	}; 

	document.getElementById("stop-button_6").onclick = function(){
		old_globalRotationXX_ON_6 = globalRotationXX_ON_6;
		old_globalRotationYY_ON_6 = globalRotationYY_ON_6;
		old_globalRotationZZ_ON_6 = globalRotationZZ_ON_6;
		old_random = randomDir;
		globalRotationXX_ON_6 = false;
		globalRotationYY_ON_6 = false;
		globalRotationZZ_ON_6 = false;
		document.getElementById("XX-start-button_6").disabled = false;
		document.getElementById("XX-stop-button_6").disabled = true;
		document.getElementById("YY-start-button_6").disabled = false;
		document.getElementById("YY-stop-button_6").disabled = true;
		document.getElementById("ZZ-start-button_6").disabled = false;
		document.getElementById("ZZ-stop-button_6").disabled = true;
		document.getElementById("XX-randomDir-button_on_6").disabled = false;
		document.getElementById("XX-randomDir-button_off_6").disabled = true;
	};

	// movement
	document.getElementById("XX-start-button_6").onclick = function(){
		globalRotationXX_ON_6 = true;
		document.getElementById("stop-button_6").disabled = false;
		document.getElementById("start-button_6").disabled = true;
		if (randomDir == 0){
			document.getElementById("XX-randomDir-button_on_6").disabled = false;
			document.getElementById("XX-randomDir-button_off_6").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_6").disabled = true;
			document.getElementById("XX-randomDir-button_off_6").disabled = false;
		}
	};	
	
	document.getElementById("XX-stop-button_6").onclick = function(){
		globalRotationXX_ON_6 = false;
		if (randomDir == 0){
			document.getElementById("XX-randomDir-button_on_6").disabled = false;
			document.getElementById("XX-randomDir-button_off_6").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_6").disabled = true;
			document.getElementById("XX-randomDir-button_off_6").disabled = false;
		}
		checkMove_6();
	};	

	document.getElementById("XX-direction-button_6").onclick = function(){
		if(globalRotationXX_DIR_6 == -1){
			globalRotationXX_DIR_6 = 1;
		}else{
			globalRotationXX_DIR_6 = -1;
		}
	};
	
	document.getElementById("YY-start-button_6").onclick = function(){
		globalRotationYY_ON_6 = true;
		document.getElementById("stop-button_6").disabled = false;
		document.getElementById("start-button_6").disabled = true;
	};

	document.getElementById("YY-stop-button_6").onclick = function(){
		globalRotationYY_ON_6 = false;
		if (randomDir == 0){
			document.getElementById("XX-randomDir-button_on_6").disabled = false;
			document.getElementById("XX-randomDir-button_off_6").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_6").disabled = true;
			document.getElementById("XX-randomDir-button_off_6").disabled = false;
		}
		checkMove_6();	
	};

	document.getElementById("YY-direction-button_6").onclick = function(){
		if(globalRotationYY_DIR_6 == -1){
			globalRotationYY_DIR_6 = 1;
		}else{
			globalRotationYY_DIR_6 = -1;
		}
	};
	
	document.getElementById("ZZ-start-button_6").onclick = function(){
		globalRotationZZ_ON_6 = true;
		document.getElementById("stop-button_6").disabled = false;
		document.getElementById("start-button_6").disabled = true;
	};

	document.getElementById("ZZ-stop-button_6").onclick = function(){
		globalRotationZZ_ON_6 = false;
		if (randomDir == 0){
			document.getElementById("XX-randomDir-button_on_6").disabled = false;
			document.getElementById("XX-randomDir-button_off_6").disabled = true;
		} else {
			document.getElementById("XX-randomDir-button_on_6").disabled = true;
			document.getElementById("XX-randomDir-button_off_6").disabled = false;
		}
		checkMove_6();
	};	

	document.getElementById("ZZ-direction-button_6").onclick = function(){
		if(globalRotationZZ_DIR_6 == -1){
			globalRotationZZ_DIR_6 = 1;
		}else{
			globalRotationZZ_DIR_6 = -1;
		}
	};

	document.getElementById("XX-randomDir-button_on_6").onclick = function(){
		document.getElementById("stop-button_6").disabled = false;
		document.getElementById("start-button_6").disabled = true;

		document.getElementById("XX-start-button_6").disabled = true;
		document.getElementById("XX-stop-button_6").disabled = false;
		globalRotationXX_ON_6 = 1;
		document.getElementById("YY-start-button_6").disabled = true;
		document.getElementById("YY-stop-button_6").disabled = false;
		globalRotationYY_ON_6 = 1;
		document.getElementById("ZZ-start-button_6").disabled = true;
		document.getElementById("ZZ-stop-button_6").disabled = false;
		globalRotationZZ_ON_6 = 1;
		randomDir = 1;
	};

	document.getElementById("XX-randomDir-button_off_6").onclick = function(){
		randomDir = 0;
	};

	// speed 
	document.getElementById("XX-slower-button_6").onclick = function(){
		globalRotationXX_SPEED_6 *= 0.75; 
		globalRotationYY_SPEED_6 *= 0.75;
		globalRotationZZ_SPEED_6 *= 0.75;
	};      

	document.getElementById("XX-faster-button_6").onclick = function(){
		globalRotationXX_SPEED_6 *= 1.25;
		globalRotationYY_SPEED_6 *= 1.25; 
		globalRotationZZ_SPEED_6 *= 1.25;
	};      

	// zoom 
	var countScale_6 = 0;
	document.getElementById("scale-up-button_6").onclick = function(){ 
		if (countScale_6 != 3){
			for(var i = 0; i < sceneModels_6.length; i++ )
			{
				sceneModels_6[i].sx_6 *= 1.1;
				sceneModels_6[i].sy_6 *= 1.1;
				sceneModels_6[i].sz_6 *= 1.1;	
			}
			countScale_6++;
		} 
		drawScene_6(); 
	};

	document.getElementById("scale-down-button_6").onclick = function(){
		if (countScale_6 != -3){
			for(var i = 0; i < sceneModels_6.length; i++ )
			{
				sceneModels_6[i].sx_6 *= 0.9;
				sceneModels_6[i].sy_6 *= 0.9;
				sceneModels_6[i].sz_6 *= 0.9;	
			}
			countScale_6--;
		} 
		drawScene_6(); 
	};
	
	// projection 	
	var projection = document.getElementById("projection-selection_6");	
	projection.addEventListener("click", function(){		
		var p = projection.selectedIndex;				
		switch(p){			
			case 0 : projectionType_6 = 0;
				break;			
			case 1 : projectionType_6 = 1;
				break;
		}  		
	});      

	// rendering	
	var list = document.getElementById("rendering-mode-selection_6");	
	list.addEventListener("click", function(){						
		var mode = list.selectedIndex;				
		switch(mode){
			case 0 : primitiveType_6 = gl_6.TRIANGLES;
				break;			
			case 1 : primitiveType_6 = gl_6.LINE_LOOP;
				break;			
			case 2 : primitiveType_6 = gl_6.POINTS;
				break;
		}
	});   

	document.getElementById("reset-button_6").onclick = function(){
		resetClick_6 = 1;

		document.getElementById("stop-button_6").disabled = true;
		document.getElementById("start-button_6").disabled = false;
		
		document.getElementById("XX-start-button_6").disabled = false;
		document.getElementById("XX-stop-button_6").disabled = true;
		document.getElementById("YY-start-button_6").disabled = false;
		document.getElementById("YY-stop-button_6").disabled = true;
		document.getElementById("ZZ-start-button_6").disabled = false;
		document.getElementById("ZZ-stop-button_6").disabled = true;
		document.getElementById("XX-randomDir-button_on_6").disabled = false;
		document.getElementById("XX-randomDir-button_off_6").disabled = true;
		
		globalRotationXX_ON_6 = false;
		globalRotationYY_ON_6 = false;
		globalRotationZZ_ON_6 = false;
		globalAngleXX_6 = 0;
		globalAngleYY_6 = 0;
		globalAngleZZ_6 = 0;
		randomDir = 0;
		globalRotationXX_SPEED_6 = 0.4;
		globalRotationYY_SPEED_6 = 0.4;
		globalRotationZZ_SPEED_6 = 0.4;

		for(var i = 0; i < sceneModels_6.length; i++ )
		{
			sceneModels_6[i].tx_6 = geralSave_6[i].tx_6; sceneModels_6[i].ty_6 = geralSave_6[i].ty_6;
			sceneModels_6[i].sx_6 = geralSave_6[i].sx_6; sceneModels_6[i].sy_6 = geralSave_6[i].sy_6; sceneModels_6[i].sz_6 = geralSave_6[i].sz_6;
		
			sceneModels_6[i].rotXXOn_6 = false;	
			sceneModels_6[i].rotYYOn_6 = false;
			sceneModels_6[i].rotZZOn_6 = false;
			sceneModels_6[i].rotXXSpeed_6 = 1;
			sceneModels_6[i].rotYYSpeed_6 = 1;
			sceneModels_6[i].rotZZSpeed_6 = 1;
			
		}

		drawScene();  
	};

	document.getElementById("file2").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		// reader.onload = function(){
			
		// 	var tokens = this.result;
    
		// 	// Array of values; each value is a string
			
			// var numVertices = parseInt( tokens[0] );
			// alert(numVertices);
		sceneModels_6 = [];
		reader.onload=function(){ 
			var theArray = reader.result.trim().split(/\s+/);
			var cor;
			stopped = 0;
			num_sen = 0;
			for(let i=0; i< theArray.length; i++) {
				if(theArray[i] == "stopped"){
					sceneModels_6.push( new sphereModel_6( 4 ) );
					sceneModels_6[num_sen].rotZZOn_6 = false;
					sceneModels_6[num_sen].rotYYOn_6 = false;

					cor = theArray[i+1].split(",")
					sceneModels_6[num_sen].kDiff_6 = [ cor[0], cor[1], cor[2] ];

					sceneModels_6[num_sen].tx_6 = theArray[i+2]; sceneModels_6[num_sen].ty_6 =theArray[i+3];

					sceneModels_6[num_sen].sx_6 = theArray[i+4]; sceneModels_6[num_sen].sy_6 = theArray[i+4]; sceneModels_6[num_sen].sz_6 = theArray[i+4];
					num_sen++;
					stopped++;
				}
				if(theArray[i] == "rotate"){
					sceneModels_6.push( new sphereModel_6( 4 ) );
					sceneModels_6[num_sen].rotZZOn_6 = false;
					sceneModels_6[num_sen].rotYYOn_6 = false;

					cor = theArray[i+1].split(",")
					sceneModels_6[num_sen].kDiff_6 = [ cor[0], cor[1], cor[2] ];

					sceneModels_6[num_sen].tx_6 = theArray[i+2]; sceneModels_6[num_sen].ty_6 =theArray[i+3];

					sceneModels_6[num_sen].sx_6 = theArray[i+4]; sceneModels_6[num_sen].sy_6 = theArray[i+4]; sceneModels_6[num_sen].sz_6 = theArray[i+4];
					num_sen++;
				}

				if(theArray[i] == "aux"){
					aux = theArray[i+1].split(",");
				}
				
			}
		}
		tick_6(); 
		geralSave_6 = Object.create(sceneModels_6);


		// Entire file read as a string
			
		reader.readAsText( file );
	};
}

//--------------------------- WebGL Initialization ---------------------------

function initWebGL_6( canvas ) {
	try {
		gl_6 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
		primitiveType_6 = gl_6.TRIANGLES;	
		gl_6.enable( gl_6.CULL_FACE );	
		gl_6.cullFace( gl_6.BACK );
		gl_6.enable( gl_6.DEPTH_TEST ); 
	} catch (e) {
	}
	if (!gl_6) {
		alert("Could not initialise WebGL 2, sorry! :-(");
	}
}

function runWebGL_6() {	
	var canvas = document.getElementById("my-canvas-2");	
	initWebGL_6( canvas );
	shaderProgram_6 = initShaders( gl_6 );	
	setEventListeners_6();	
	tick_6(); 
	outputInfos_6();
}
