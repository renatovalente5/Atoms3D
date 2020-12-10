
//----------------------------- Global Variables -----------------------------

var gl_2 = null; // WebGL context
var shaderProgram_2 = null;
var triangleVertexPositionBuffer_2 = null;	
var triangleVertexNormalBuffer_2 = null;	

// The GLOBAL transformation parameters
var globalAngleXX_2 = 0.0;
var globalAngleYY_2 = 0.0;
var globalAngleZZ_2 = 0.0;
var globalTz_2 = 0.0;

// GLOBAL Animation controls
var globalRotationXX_ON_2 = 0;
var globalRotationXX_DIR_2 = 1;
var globalRotationXX_SPEED_2 = 1;

var globalRotationYY_ON_2 = 0;
var globalRotationYY_DIR_2 = 1;
var globalRotationYY_SPEED_2 = 1;

var globalRotationZZ_ON_2 = 0;
var globalRotationZZ_DIR_2 = 1;
var globalRotationZZ_SPEED_2 = 1;

// var globalTranslationZZ_ON_2 = 0;
// var globalTranslationZZ_DIR_2 = 1;
// var globalTranslationZZ_SPEED_2 = 1;

// To allow choosing the way of drawing the model triangles
var primitiveType_2 = null;
 
// To allow choosing the projection type
var projectionType_2 = 0;

// The viewer position
var pos_Viewer_2 = [ 0.0, 0.0, 0.0, 1.0 ];

var randomDir = 0;


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
		pMatrix = ortho( -1.5, 1.5, -1.5, 1.5, -1.5, 1.5 );	
		globalTz_2 = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer_2[0] = pos_Viewer_2[1] = pos_Viewer_2[3] = 0.0;
		pos_Viewer_2[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 65, 1, 0.05, 15 );
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
	//mvMatrix = translationMatrix( 0, 0, globalTz );
	// mvMatrix = mult(translationMatrix( 0, 0, globalTz),
	// mult(mult(rotationXXMatrix( globalAngleXX ), rotationYYMatrix( globalAngleYY )),
	// 		  rotationZZMatrix( globalAngleZZ)));


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
	if(randomDir==1){

		// Instantianting all scene models	
		for(var i = 0; i < sceneModels_2.length; i++ )
		{
			if(i==0 || i==1 || i==4){
				drawModel_2( sceneModels_2[i],
					translationMatrix( 0, 0, globalTz_2 ),
					primitiveType_2 );
			}else if(i==3){
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( -0.45, 0.85, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 ), rotationYYMatrix( globalAngleYY_2 )),
					rotationZZMatrix( globalAngleZZ_2 * (-1) ))),
					primitiveType_2 );
			}else if(i==2){
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( 0.45, 0.85, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 * (-1) ), rotationYYMatrix( globalAngleYY_2 * (-1) )),
					rotationZZMatrix( globalAngleZZ_2))),
					primitiveType_2 );
			}else if(i==5 || i==10 || i==12){
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( 0, 0, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 * (-1) ), rotationYYMatrix( globalAngleYY_2 * (-1))),
					rotationZZMatrix( globalAngleZZ_2 ))),
					primitiveType_2 );
			}else{
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( 0, 0, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 ), rotationYYMatrix( globalAngleYY_2 )),
						rotationZZMatrix( globalAngleZZ_2 * (-1) ))),
					primitiveType_2 );
			}
		}
	}else{
		// Instantianting all scene models	
		for(var i = 0; i < sceneModels_2.length; i++ )
		{
			if(i==0 || i==1 || i==4){
				drawModel_2( sceneModels_2[i],
					translationMatrix( 0, 0, globalTz_2 ),
					primitiveType_2 );
			}else if(i==3){
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( -0.45, 0.85, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 ), rotationYYMatrix( globalAngleYY_2 )),
					rotationZZMatrix( globalAngleZZ_2 ))),
					primitiveType_2 );
			}else if(i==2){
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( 0.45, 0.85, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 ), rotationYYMatrix( globalAngleYY_2 )),
					rotationZZMatrix( globalAngleZZ_2 ))),
					primitiveType_2 );
			}else{
				drawModel_2( sceneModels_2[i],
					mult(translationMatrix( 0, 0, globalTz_2),
					mult(mult(rotationXXMatrix( globalAngleXX_2 ), rotationYYMatrix( globalAngleYY_2 )),
						rotationZZMatrix( globalAngleZZ_2 ))),
					primitiveType_2 );
			}
		}
	}
}

//--------------------------------- Animation --------------------------------
var lastTime_2 = 0;

function animate_2() {	
	var timeNow = new Date().getTime();
	if( lastTime_2 != 0 ) {		
		var elapsed = timeNow - lastTime_2;		
		
		// Global rotation		
		if( globalRotationXX_ON_2 ) {
			globalAngleXX_2 += globalRotationXX_DIR_2 * globalRotationXX_SPEED_2 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationYY_ON_2 ) {
			globalAngleYY_2 += globalRotationYY_DIR_2 * globalRotationYY_SPEED_2 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationZZ_ON_2 ) {
			globalAngleZZ_2 += globalRotationZZ_DIR_2 * globalRotationZZ_SPEED_2 * (90 * elapsed) / 1000.0;
		}

		// if( globalTranslationZZ_ON_2 ) {
		// 	globalAngleZZ_2 += globalTranslationZZ_DIR_2 * globalTranslationZZ_SPEED_2 * (90 * elapsed) / 1000.0;
	    // }

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

function checkMove_2(){
	var a=0, b=1;
	if ((globalRotationXX_ON_2 == false && globalRotationYY_ON_2 == false && globalRotationZZ_ON_2 == false) || (globalRotationXX_ON_2 == 0 && globalRotationYY_ON_2 == 0 && globalRotationZZ_ON_2 == 0)){
		a = 1;
	}
	for(var i = 0; i < sceneModels_2.length; i++ )
	{
		if( sceneModels_2[i].rotXXOn_2 ) {
			b = 0;
		}
	}
	if (a == 1 && b == 1){
		document.getElementById("start-button_2").disabled = false;
		document.getElementById("stop-button_2").disabled = true;
	} else {
		document.getElementById("start-button_2").disabled = true;
		document.getElementById("stop-button_2").disabled = false;
	}
}

function setEventListeners_2(){
	
	var old_globalRotationXX_ON_2, old_globalRotationYY_ON_2, old_globalRotationZZ_ON_2, old_rotXXOn_2, old_random; 

	// start/stop Molecule
	document.getElementById("start-button_2").onclick = function(){

		if (old_random == 0 || old_random == false){
			document.getElementById("XX-randomDir-button_on_2").disabled = false;
			document.getElementById("XX-randomDir-button_off_2").disabled = true;
		} else{
			document.getElementById("XX-randomDir-button_on_2").disabled = true;
			document.getElementById("XX-randomDir-button_off_2").disabled = false;
		}

		// if (old_rotXXOn_2 == 0 || old_rotXXOn_2 == false){
		// 	document.getElementById("XX_direction_on_2").disabled = false;
		// 	document.getElementById("XX_direction_off_2").disabled = true;
		// } else {
		// 	document.getElementById("XX_direction_on_2").disabled = true;
		// 	document.getElementById("XX_direction_off_2").disabled = false;
		// 	for(var i = 0; i < sceneModels_2.length; i++ )
		// 	{
		// 		sceneModels_2[i].rotXXOn_2 = true;
		// 	}
		// }

		if (old_globalRotationXX_ON_2 == 0 || old_globalRotationXX_ON_2 == false){
			document.getElementById("XX-start-button_2").disabled = false;
			document.getElementById("XX-stop-button_2").disabled = true;
		} else {
			document.getElementById("XX-start-button_2").disabled = true;
			document.getElementById("XX-stop-button_2").disabled = false;
			globalRotationXX_ON_2 = 1;
		}

		if (old_globalRotationYY_ON_2 == 0 || old_globalRotationYY_ON_2 == false){
			document.getElementById("YY-start-button_2").disabled = false;
			document.getElementById("YY-stop-button_2").disabled = true;
		} else {
			document.getElementById("YY-start-button_2").disabled = true;
			document.getElementById("YY-stop-button_2").disabled = false;
			globalRotationYY_ON_2 = 1;
		}

		if (old_globalRotationZZ_ON_2 == 0 || old_globalRotationZZ_ON_2 == false){
			document.getElementById("ZZ-start-button_2").disabled = false;
			document.getElementById("ZZ-stop-button_2").disabled = true;
		} else {
			document.getElementById("ZZ-start-button_2").disabled = true;
			document.getElementById("ZZ-stop-button_2").disabled = false;
			globalRotationZZ_ON_2 = 1;
		}
	}; 

	document.getElementById("stop-button_2").onclick = function(){
		old_globalRotationXX_ON_2 = globalRotationXX_ON_2;
		old_globalRotationYY_ON_2 = globalRotationYY_ON_2;
		old_globalRotationZZ_ON_2 = globalRotationZZ_ON_2;
		old_random = randomDir;
		for(var i = 0; i < sceneModels_2.length; i++ )
	    {
			sceneModels_2[i].rotXXOn_2 = false;
		}
		globalRotationXX_ON_2 = false;
		globalRotationYY_ON_2 = false;
		globalRotationZZ_ON_2 = false;
		//globalTranslationZZ_ON_2 = false;
		document.getElementById("XX-start-button_2").disabled = false;
		document.getElementById("XX-stop-button_2").disabled = true;
		document.getElementById("YY-start-button_2").disabled = false;
		document.getElementById("YY-stop-button_2").disabled = true;
		document.getElementById("ZZ-start-button_2").disabled = false;
		document.getElementById("ZZ-stop-button_2").disabled = true;
		// document.getElementById("XX_direction_on_2").disabled = false;
		// document.getElementById("XX_direction_off_2").disabled = true;
		document.getElementById("XX-randomDir-button_on_2").disabled = false;
		document.getElementById("XX-randomDir-button_off_2").disabled = true;
	};

	// movement
	document.getElementById("XX-start-button_2").onclick = function(){
		globalRotationXX_ON_2 = true;
		document.getElementById("stop-button_2").disabled = false;
		document.getElementById("start-button_2").disabled = true;
	};	
	
	document.getElementById("XX-stop-button_2").onclick = function(){
		globalRotationXX_ON_2 = false;
		checkMove_2();
	};	

	document.getElementById("XX-direction-button_2").onclick = function(){
		if(globalRotationXX_DIR_2 == -1){
			globalRotationXX_DIR_2 = 1;
		}else{
			globalRotationXX_DIR_2 = -1;
		}
	};
	
	document.getElementById("YY-start-button_2").onclick = function(){
		globalRotationYY_ON_2 = true;
		document.getElementById("stop-button_2").disabled = false;
		document.getElementById("start-button_2").disabled = true;
	};

	document.getElementById("YY-stop-button_2").onclick = function(){
		globalRotationYY_ON_2 = false;
		checkMove_2();
	};

	document.getElementById("YY-direction-button_2").onclick = function(){
		if(globalRotationYY_DIR_2 == -1){
			globalRotationYY_DIR_2 = 1;
		}else{
			globalRotationYY_DIR_2 = -1;
		}
	};
	
	document.getElementById("ZZ-start-button_2").onclick = function(){
		globalRotationZZ_ON_2 = true;
		document.getElementById("stop-button_2").disabled = false;
		document.getElementById("start-button_2").disabled = true;
	};

	document.getElementById("ZZ-stop-button_2").onclick = function(){
		globalRotationZZ_ON_2 = false;
		checkMove_2();
	};	

	document.getElementById("ZZ-direction-button_2").onclick = function(){
		if(globalRotationZZ_DIR_2 == -1){
			globalRotationZZ_DIR_2 = 1;
		}else{
			globalRotationZZ_DIR_2 = -1;
		}
	};

	document.getElementById("XX-randomDir-button_on_2").onclick = function(){
		randomDir = 1;
		document.getElementById("stop-button_2").disabled = false;
		document.getElementById("start-button_2").disabled = true;
	};

	document.getElementById("XX-randomDir-button_off_2").onclick = function(){
		randomDir = 0;
	};

	// direction
	// document.getElementById("XX-direction-button_2").onclick = function(){
	// 	if(globalTranslationZZ_DIR_2 == 1){
	// 		globalTranslationZZ_DIR_2 = -1;
	// 	}else{
	// 		globalTranslationZZ_DIR_2 = 1;
	// 	}
	// };

	// document.getElementById("XX-direction-button_2").onclick = function(){
	// 	for(var i = 0; i < sceneModels_2.length; i++ )
	//     {
	// 		if( sceneModels_2[i].rotXXDir_2 == 1 ) {
	// 			sceneModels_2[i].rotXXDir_2 = -1;
	// 		}
	// 		else {
	// 			sceneModels_2[i].rotXXDir_2 = 1;
	// 		}	
	// 	}
	// };

	// document.getElementById("XX_direction_on_2").onclick = function(){
	// 	for(var i = 0; i < sceneModels_2.length; i++ )
	//     {
	// 		sceneModels_2[i].rotXXOn_2 = true;
	// 	}
	// };

	// document.getElementById("XX_direction_off_2").onclick = function(){
	// 	for(var i = 0; i < sceneModels_2.length; i++ )
	//     {
	// 		sceneModels_2[i].rotXXOn_2 = false;
	// 	}
	// 	checkMove();
	// };
		
	// document.getElementById("XX_direction_on_off_2").onclick = function(){
	// 	if(globalTranslationZZ_ON_2 == 1){
	// 		globalTranslationZZ_ON_2 = 0;
	// 	}else{
	// 		globalTranslationZZ_ON_2 = 1;
	// 	}
	// };   

	// speed 
	document.getElementById("XX-slower-button_2").onclick = function(){
		// globalTranslationZZ_SPEED_2 *= 0.75; 
		globalRotationXX_SPEED_2 *= 0.75; 
		globalRotationYY_SPEED_2 *= 0.75;
		globalRotationZZ_SPEED_2 *= 0.75;
	};      

	document.getElementById("XX-faster-button_2").onclick = function(){
		// globalTranslationZZ_SPEED_2 *= 1.25; 
		globalRotationXX_SPEED_2 *= 1.25;
		globalRotationYY_SPEED_2 *= 1.25; 
		globalRotationZZ_SPEED_2 *= 1.25;
	};      

	// zoom 
	var countScale_2 = 0;
	document.getElementById("scale-up-button_2").onclick = function(){ 
		if (countScale_2 != 3){
			for(var i = 0; i < sceneModels_2.length; i++ )
			{
				sceneModels_2[i].sx_2 *= 1.1;
				sceneModels_2[i].sy_2 *= 1.1;
				sceneModels_2[i].sz_2 *= 1.1;	
			}
			countScale_2++;
		} 
		drawScene_2(); 
	};

	document.getElementById("scale-down-button_2").onclick = function(){
		if (countScale_2 != -3){
			for(var i = 0; i < sceneModels_2.length; i++ )
			{
				sceneModels_2[i].sx_2 *= 0.9;
				sceneModels_2[i].sy_2 *= 0.9;
				sceneModels_2[i].sz_2 *= 0.9;	
			}
			countScale_2--;
		} 
		drawScene_2(); 
	};
	
	// projection 	
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

	// rendering	
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

	document.getElementById("reset-button_2").onclick = function(){

		document.getElementById("stop-button_2").disabled = true;
		document.getElementById("start-button_2").disabled = false;
		
		document.getElementById("XX-start-button_2").disabled = false;
		document.getElementById("XX-stop-button_2").disabled = true;
		document.getElementById("YY-start-button_2").disabled = false;
		document.getElementById("YY-stop-button_2").disabled = true;
		document.getElementById("ZZ-start-button_2").disabled = false;
		document.getElementById("ZZ-stop-button_2").disabled = true;

		// globalRotationXX_ON_2 = false;
		// globalRotationYY_ON_2 = false;
		// globalRotationZZ_ON_2 = false;
		//globalTranslationZZ_ON_2 = false;
		globalAngleXX_2 = 0;
		globalAngleYY_2 = 0;
		globalAngleZZ_2 = 0;
		randomDir = 0;

		// NUCLEO H1
		sceneModels_2[0].tx_2 = -0.50; sceneModels_2[0].ty_2 = 0.84;
		sceneModels_2[0].sx_2 = 0.06; sceneModels_2[0].sy_2 = 0.06; sceneModels_2[0].sz_2 = 0.06;
		
		// NUCLEO H2
		sceneModels_2[1].tx_2 = 0.50; sceneModels_2[1].ty_2 = 0.84;
		sceneModels_2[1].sx_2 = 0.06; sceneModels_2[1].sy_2 = 0.06; sceneModels_2[1].sz_2 = 0.06;
		
		// ELETRAO NUCLEO H1
		sceneModels_2[2].tx_2 = 0.25; sceneModels_2[2].ty_2 = 0.43;
		sceneModels_2[2].sx_2 = 0.03; sceneModels_2[2].sy_2 = 0.03; sceneModels_2[2].sz_2 = 0.03;

		// ELETRAO NUCLEO H2
		sceneModels_2[3].tx_2 = -0.25; sceneModels_2[3].ty_2 = 0.43; 
		sceneModels_2[3].sx_2 = 0.03; sceneModels_2[3].sy_2 = 0.03; sceneModels_2[3].sz_2 = 0.03;

		// NUCLEO O
		sceneModels_2[4].tx_2 = 0; sceneModels_2[4].ty_2 = 0;
		sceneModels_2[4].sx_2 = 0.1; sceneModels_2[4].sy_2 = 0.1; sceneModels_2[4].sz_2 = 0.1;

		// ELETRAO 1 DENTRO NUCLEO O 
		sceneModels_2[5].tx_2 = 0; sceneModels_2[5].ty_2 = 0.25;
		sceneModels_2[5].sx_2 = 0.03; sceneModels_2[5].sy_2 = 0.03; sceneModels_2[5].sz_2 = 0.03;

		// ELETRAO 2 DENTRO NUCLEO O 
		sceneModels_2[6].tx_2 = 0; sceneModels_2[6].ty_2 = -0.25;
		sceneModels_2[6].sx_2 = 0.03; sceneModels_2[6].sy_2 = 0.03; sceneModels_2[6].sz_2 = 0.03;

		// ELETRAO 1 FORA NUCLEO O 
		sceneModels_2[7].tx_2 = 0.5; sceneModels_2[7].ty_2 = 0;
		sceneModels_2[7].sx_2 = 0.03; sceneModels_2[7].sy_2 = 0.03; sceneModels_2[7].sz_2 = 0.03;
		
		// ELETRAO 2 FORA NUCLEO O 
		sceneModels_2[8].tx_2 = -0.50; sceneModels_2[8].ty_2 = 0;
		sceneModels_2[8].sx_2 = 0.03; sceneModels_2[8].sy_2 = 0.03; sceneModels_2[8].sz_2 = 0.03;

		// ELETRAO 3 FORA NUCLEO O 
		sceneModels_2[9].tx_2 = 0.25; sceneModels_2[9].ty_2 = 0.43;
		sceneModels_2[9].sx_2 = 0.03; sceneModels_2[9].sy_2 = 0.03; sceneModels_2[9].sz_2 = 0.03;

		// ELETRAO 4 DENTRO NUCLEO O 
		sceneModels_2[10].tx_2 = -0.25; sceneModels_2[10].ty_2 = 0.43;
		sceneModels_2[10].sx_2 = 0.03; sceneModels_2[10].sy_2 = 0.03; sceneModels_2[10].sz_2 = 0.03;

		// ELETRAO 5 FORA NUCLEO O 
		sceneModels_2[11].tx_2 = 0.25; sceneModels_2[11].ty_2 = -0.43;
		sceneModels_2[11].sx_2 = 0.03; sceneModels_2[11].sy_2 = 0.03; sceneModels_2[11].sz_2 = 0.03;
		
		// ELETRAO 6 FORA NUCLEO O 
		sceneModels_2[12].tx_2 = -0.25; sceneModels_2[12].ty_2 = -0.43;
		sceneModels_2[12].sx_2 = 0.03; sceneModels_2[12].sy_2 = 0.03; sceneModels_2[12].sz_2 = 0.03;

		for(var i = 0; i < sceneModels_2.length; i++ )
		{
			sceneModels_2[i].rotXXOn_2 = false;	
			sceneModels_2[i].rotYYOn_2 = false;
			sceneModels_2[i].rotZZOn_2 = false;
			sceneModels_2[i].rotXXSpeed_2 = 1.0;
			sceneModels_2[i].rotYYSpeed_2 = 1.0;
			sceneModels_2[i].rotZZSpeed_2 = 1.0;
		}

		drawScene();  
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
