
//----------------------------- Global Variables -----------------------------

var gl_5 = null; // WebGL context
var shaderProgram_5 = null;
var triangleVertexPositionBuffer_5 = null;	
var triangleVertexNormalBuffer_5 = null;	

// The GLOBAL transformation parameters
var globalAngleXX_5 = 0.0;
var globalAngleYY_5 = 0.0;
var globalAngleZZ_5 = 0.0;
var globalTz_5 = 0.0;

// GLOBAL Animation controls
var globalRotationXX_ON_5 = 1;
var globalRotationXX_DIR_5 = 1;
var globalRotationXX_SPEED_5 = 1;

var globalRotationYY_ON_5 = 1;
var globalRotationYY_DIR_5 = 1;
var globalRotationYY_SPEED_5 = 1;

var globalRotationZZ_ON_5 = 0;
var globalRotationZZ_DIR_5 = 1;
var globalRotationZZ_SPEED_5 = 1;

// To allow choosing the way of drawing the model triangles
var primitiveType_5 = null;
 
// To allow choosing the projection type
var projectionType_5 = 0;

// The viewer position
var pos_Viewer_5 = [ 0.0, 0.0, 0.0, 1.0 ];

var geralSave_5 = null;
var countScale = 0;


//------------------------------ The WebGL code ------------------------------

// Handling the Vertex Coordinates and the Vertex Normal Vectors
function initBuffers_5( model ) {		
	// Vertex Coordinates		
	triangleVertexPositionBuffer_5 = gl_5.createBuffer();
	gl_5.bindBuffer(gl_5.ARRAY_BUFFER, triangleVertexPositionBuffer_5);
	gl_5.bufferData(gl_5.ARRAY_BUFFER, new Float32Array(model.vertices_5), gl_5.STATIC_DRAW);
	triangleVertexPositionBuffer_5.itemSize = 3;
	triangleVertexPositionBuffer_5.numItems = model.vertices_5.length / 3;			

	// Associating to the vertex shader	
	gl_5.vertexAttribPointer(shaderProgram_5.vertexPositionAttribute, 
			triangleVertexPositionBuffer_5.itemSize, 
			gl_5.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors		
	triangleVertexNormalBuffer_5 = gl_5.createBuffer();
	gl_5.bindBuffer(gl_5.ARRAY_BUFFER, triangleVertexNormalBuffer_5);
	gl_5.bufferData(gl_5.ARRAY_BUFFER, new Float32Array( model.normals_5), gl_5.STATIC_DRAW);
	triangleVertexNormalBuffer_5.itemSize = 3;
	triangleVertexNormalBuffer_5.numItems = model.normals_5.length / 3;			

	// Associating to the vertex shader	
	gl_5.vertexAttribPointer(shaderProgram_5.vertexNormalAttribute, 
			triangleVertexNormalBuffer_5.itemSize, 
			gl_5.FLOAT, false, 0, 0);	
}

//  Drawing the model
function drawModel_5( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx_5, model.ty_5, model.tz_5 ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ_5 ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY_5 ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX_5 ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx_5, model.sy_5, model.sz_5 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl_5.getUniformLocation(shaderProgram_5, "uMVMatrix");	
	gl_5.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader	
	initBuffers_5(model);
	
	// Material properties	
	gl_5.uniform3fv( gl_5.getUniformLocation(shaderProgram_5, "k_ambient"), 
		flatten(model.kAmbi_5) );    
    gl_5.uniform3fv( gl_5.getUniformLocation(shaderProgram_5, "k_diffuse"),
        flatten(model.kDiff_5) );   
    gl_5.uniform3fv( gl_5.getUniformLocation(shaderProgram_5, "k_specular"),
        flatten(model.kSpec_5) );
	gl_5.uniform1f( gl_5.getUniformLocation(shaderProgram_5, "shininess"), 
		model.nPhong_5 );

    // Light Sources	
	var numLights = lightSources.length;	
	gl_5.uniform1i( gl_5.getUniformLocation(shaderProgram_5, "numLights"), 
		numLights );

	//Light Sources	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl_5.uniform1i( gl_5.getUniformLocation(shaderProgram_5, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );   
		gl_5.uniform4fv( gl_5.getUniformLocation(shaderProgram_5, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );   
		gl_5.uniform3fv( gl_5.getUniformLocation(shaderProgram_5, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing - primitiveType allows drawing as filled triangles / wireframe / vertices	
	if( primitiveType == gl_5.LINE_LOOP ) {				
		var i;		
		for( i = 0; i < triangleVertexPositionBuffer_5.numItems / 3; i++ ) {		
			gl_5.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {				
		gl_5.drawArrays(primitiveType, 0, triangleVertexPositionBuffer_5.numItems); 		
	}	
}

//  Drawing the 3D scene
function drawScene_5() {	
	var pMatrix;	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer	
	gl_5.clear(gl_5.COLOR_BUFFER_BIT | gl_5.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType_5 == 0 ) {
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );	
		globalTz_5 = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer_5[0] = pos_Viewer_5[1] = pos_Viewer_5[3] = 0.0;
		pos_Viewer_5[2] = 1.0;  
	}
	else {			
		pMatrix = perspective( 45, 1, 0.05, 15 );
		globalTz_5 = -2.5;

		// The viewer is on (0,0,0)		
		pos_Viewer_5[0] = pos_Viewer_5[1] = pos_Viewer_5[2] = 0.0;		
		pos_Viewer_5[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl_5.getUniformLocation(shaderProgram_5, "uPMatrix");	
	gl_5.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	gl_5.uniform4fv( gl_5.getUniformLocation(shaderProgram_5, "viewerPosition"),
        flatten(pos_Viewer_5) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE	
	mvMatrix = mult(translationMatrix( 0, 0, globalTz_5),
	mult(mult(rotationXXMatrix( globalAngleXX_5 ), rotationYYMatrix( globalAngleYY_5 )),
			  rotationZZMatrix( globalAngleZZ_5)));

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
		var lsmUniform = gl_5.getUniformLocation(shaderProgram_5, "allLights["+ String(i) + "].lightSourceMatrix");
		gl_5.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models	
	for(var i = 0; i < sceneModels_5.length; i++ )
	{ 
		drawModel_5( sceneModels_5[i],
			   mvMatrix,
	           primitiveType_5 );
	}
}

//--------------------------------- Animation --------------------------------
var lastTime_5 = 0;

function animate_5() {	
	var timeNow = new Date().getTime();
	if( lastTime_5 != 0 ) {		
		var elapsed = timeNow - lastTime_5;		
		
		// Global rotation		
		if( globalRotationXX_ON_5 ) {
			globalAngleXX_5 += globalRotationXX_DIR_5 * globalRotationXX_SPEED_5 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationYY_ON_5 ) {
			globalAngleYY_5 += globalRotationYY_DIR_5 * globalRotationYY_SPEED_5 * (90 * elapsed) / 1000.0;
		}
		if( globalRotationZZ_ON_5 ) {
			globalAngleZZ_5 += globalRotationZZ_DIR_5 * globalRotationZZ_SPEED_5 * (90 * elapsed) / 1000.0;
		}

		// Local rotations	
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			if( sceneModels_5[i].rotXXOn_5 ) {
				sceneModels_5[i].rotAngleXX_5 += sceneModels_5[i].rotXXDir_5 * sceneModels_5[i].rotXXSpeed_5 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels_5[i].rotYYOn_5 ) {
				sceneModels_5[i].rotAngleYY_5 += sceneModels_5[i].rotYYDir_5 * sceneModels_5[i].rotYYSpeed_5 * (90 * elapsed) / 1000.0;
			}
			if( sceneModels[i].rotZZOn_5 ) {
				sceneModels_5[i].rotAngleZZ_5 += sceneModels_5[i].rotZZDir_5 * sceneModels_5[i].rotZZSpeed_5 * (90 * elapsed) / 1000.0;
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
	lastTime_5 = timeNow;
}

// Timer
function tick_5() {	
	requestAnimFrame(tick_5);	
	drawScene_5();
	animate_5();
}

//----------------------------- User Interaction -----------------------------

function outputInfos_5(){
    
}

function checkMove_5(){
	var a=0, b=1;
	if ((globalRotationXX_ON_5 == false && globalRotationYY_ON_5 == false && globalRotationZZ_ON_5 == false) || (globalRotationXX_ON_5 == 0 && globalRotationYY_ON_5 == 0 && globalRotationZZ_ON_5 == 0)){
		a = 1;
	}
	for(var i = 0; i < sceneModels_5.length; i++ )
	{
		if( sceneModels_5[i].rotXXOn_5 ) {
			b = 0;
		}
	}
	if (a == 1 && b == 1){
		document.getElementById("start-button_5").disabled = false;
		document.getElementById("stop-button_5").disabled = true;
	} else {
		document.getElementById("start-button_5").disabled = true;
		document.getElementById("stop-button_5").disabled = false;
	}
}

var resetClick_5 = 0;

function setEventListeners_5(){
	
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
	
	var old_globalRotationXX_ON_5, old_globalRotationYY_ON_5, old_globalRotationZZ_ON_5, old_rotXXOn_5; 
	
	// start/stop Molecule
	document.getElementById("start-button_5").onclick = function(){
		if (old_rotXXOn_5 == 0 || old_rotXXOn_5 == false){
			document.getElementById("XX_direction_on_5").disabled = false;
			document.getElementById("XX_direction_off_5").disabled = true;
		} else {
			document.getElementById("XX_direction_on_5").disabled = true;
			document.getElementById("XX_direction_off_5").disabled = false;
			for(var i = 0; i < sceneModels_5.length; i++ )
			{
				sceneModels_5[i].rotXXOn_5 = true;
			}
		}
		
		if (old_globalRotationXX_ON_5 == 0 || old_globalRotationXX_ON_5 == false){
			document.getElementById("XX-start-button_5").disabled = false;
			document.getElementById("XX-stop-button_5").disabled = true;
		} else {
			document.getElementById("XX-start-button_5").disabled = true;
			document.getElementById("XX-stop-button_5").disabled = false;
			globalRotationXX_ON_5 = 1;
		}

		if (old_globalRotationYY_ON_5 == 0 || old_globalRotationYY_ON_5 == false){
			document.getElementById("YY-start-button_5").disabled = false;
			document.getElementById("YY-stop-button_5").disabled = true;
		} else {
			document.getElementById("YY-start-button_5").disabled = true;
			document.getElementById("YY-stop-button_5").disabled = false;
			globalRotationYY_ON_5 = 1;
		}

		if (old_globalRotationZZ_ON_5 == 0 || old_globalRotationZZ_ON_5 == false){
			document.getElementById("ZZ-start-button_5").disabled = false;
			document.getElementById("ZZ-stop-button_5").disabled = true;
		} else {
			if (resetClick_5 == 0){
				document.getElementById("ZZ-start-button_5").disabled = true;
				document.getElementById("ZZ-stop-button_5").disabled = false;
				globalRotationZZ_ON_5 = 1;
			} else {
				document.getElementById("ZZ-start-button_5").disabled = false;
				document.getElementById("ZZ-stop-button_5").disabled = true;
				globalRotationZZ_ON_5 = 0;
			}	
		}
		resetClick_5 = 0;
	}; 

	document.getElementById("stop-button_5").onclick = function(){
		old_globalRotationXX_ON_5 = globalRotationXX_ON_5;
		old_globalRotationYY_ON_5 = globalRotationYY_ON_5;
		old_globalRotationZZ_ON_5 = globalRotationZZ_ON_5;
		old_rotXXOn_5 = sceneModels_5[0].rotXXOn_5;
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].rotXXOn_5 = false;
		}
		globalRotationXX_ON_5 = false;
		globalRotationYY_ON_5 = false;
		globalRotationZZ_ON_5 = false;
		document.getElementById("XX-start-button_5").disabled = false;
		document.getElementById("XX-stop-button_5").disabled = true;
		document.getElementById("YY-start-button_5").disabled = false;
		document.getElementById("YY-stop-button_5").disabled = true;
		document.getElementById("ZZ-start-button_5").disabled = false;
		document.getElementById("ZZ-stop-button_5").disabled = true;
		document.getElementById("XX_direction_on_5").disabled = false;
		document.getElementById("XX_direction_off_5").disabled = true;
	};

	// movement
	document.getElementById("XX-start-button_5").onclick = function(){
		globalRotationXX_ON_5 = true;
		document.getElementById("stop-button_5").disabled = false;
		document.getElementById("start-button_5").disabled = true;
	};	
	
	document.getElementById("XX-stop-button_5").onclick = function(){
		globalRotationXX_ON_5 = false;
		checkMove_5();
	};	

	document.getElementById("XX-direction-button_5").onclick = function(){
		if(globalRotationXX_DIR_5 == -1){
			globalRotationXX_DIR_5 = 1;
		}else{
			globalRotationXX_DIR_5 = -1;
		}
	};
	
	document.getElementById("YY-start-button_5").onclick = function(){
		globalRotationYY_ON_5 = true;
		document.getElementById("stop-button_5").disabled = false;
		document.getElementById("start-button_5").disabled = true;
	};

	document.getElementById("YY-stop-button_5").onclick = function(){
		globalRotationYY_ON_5 = false;
		checkMove_5();
	};

	document.getElementById("YY-direction-button_5").onclick = function(){
		if(globalRotationYY_DIR_5 == -1){
			globalRotationYY_DIR_5 = 1;
		}else{
			globalRotationYY_DIR_5 = -1;
		}
	};
	
	document.getElementById("ZZ-start-button_5").onclick = function(){
		globalRotationZZ_ON_5 = true;
		document.getElementById("stop-button_5").disabled = false;
		document.getElementById("start-button_5").disabled = true;
	};

	document.getElementById("ZZ-stop-button_5").onclick = function(){
		globalRotationZZ_ON_5 = false;
		checkMove_5();
	};	

	document.getElementById("ZZ-direction-button_5").onclick = function(){
		if(globalRotationZZ_DIR_5 == -1){
			globalRotationZZ_DIR_5 = 1;
		}else{
			globalRotationZZ_DIR_5 = -1;
		}
	};

	// direction
	document.getElementById("XX-direction-rot-button_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			if( sceneModels_5[i].rotXXDir_5 == 1 ) {
				sceneModels_5[i].rotXXDir_5 = -1;
			}
			else {
				sceneModels_5[i].rotXXDir_5 = 1;
			}	
		}
	};
	
	document.getElementById("XX_direction_on_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].rotXXOn_5 = true;
		}
	};

	document.getElementById("XX_direction_off_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].rotXXOn_5 = false;
		}
		checkMove_5();
	};
 
	// shift
	document.getElementById("move-left-button_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].tx_5 -= 0.25;
		}
	};

	document.getElementById("move-right-button_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].tx_5 += 0.25;
		}		
	};      

	document.getElementById("move-up-button_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].ty_5 += 0.25;
		}
	};      

	document.getElementById("move-down-button_5").onclick = function(){
		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].ty_5 -= 0.25;
		}
	};

	// speed 
	document.getElementById("XX-slower-button_5").onclick = function(){
		globalRotationXX_SPEED_5 *= 0.75; 
		globalRotationYY_SPEED_5 *= 0.75;
		globalRotationZZ_SPEED_5 *= 0.75;
	};      

	document.getElementById("XX-faster-button_5").onclick = function(){
		globalRotationXX_SPEED_5 *= 1.25;
		globalRotationYY_SPEED_5 *= 1.25; 
		globalRotationZZ_SPEED_5 *= 1.25;
	};      

	// zoom 
	document.getElementById("scale-up-button_5").onclick = function(){ 
		if (countScale < 3){
			for(var i = 0; i < sceneModels_5.length; i++ )
			{
				sceneModels_5[i].sx_5 *= 1.1;
				sceneModels_5[i].sy_5 *= 1.1;
				sceneModels_5[i].sz_5 *= 1.1;	
			}
			countScale++;
		} 
		drawScene_5(); 
	};

	document.getElementById("scale-down-button_5").onclick = function(){
		if (countScale > -2){
			for(var i = 0; i < sceneModels_5.length; i++ )
			{
				if (countScale == 0){
					sceneModels_5[i].sx_5 = geralSave_5[i].sx_5;
					sceneModels_5[i].sy_5 = geralSave_5[i].sy_5;
					sceneModels_5[i].sz_5 = geralSave_5[i].sz_5;
				}else{
					sceneModels_5[i].sx_5 *= 0.9;
					sceneModels_5[i].sy_5 *= 0.9;
					sceneModels_5[i].sz_5 *= 0.9;	
				}
			}
			countScale--;
		} 
		drawScene_5(); 
	};

	// projection 	
	var projection = document.getElementById("projection-selection_5");	
	projection.addEventListener("click", function(){		
		var p = projection.selectedIndex;				
		switch(p){			
			case 0 : projectionType_5 = 0;
				break;			
			case 1 : projectionType_5 = 1;
				break;
		}  	
	});      

	// rendering	
	var list = document.getElementById("rendering-mode-selection_5");	
	list.addEventListener("click", function(){						
		var mode = list.selectedIndex;				
		switch(mode){
			case 0 : primitiveType_5 = gl_5.TRIANGLES;
				break;			
			case 1 : primitiveType_5 = gl_5.LINE_LOOP;
				break;			
			case 2 : primitiveType_5 = gl_5.POINTS;
				break;
		}
	});  

	document.getElementById("reset-button_5").onclick = function(){
		resetClick_5 = 1;

		document.getElementById("stop-button_5").disabled = true;
		document.getElementById("start-button_5").disabled = false;
		
		document.getElementById("XX-start-button_5").disabled = false;
		document.getElementById("XX-stop-button_5").disabled = true;
		document.getElementById("YY-start-button_5").disabled = false;
		document.getElementById("YY-stop-button_5").disabled = true;
		document.getElementById("ZZ-start-button_5").disabled = false;
		document.getElementById("ZZ-stop-button_5").disabled = true;
		document.getElementById("XX_direction_on_5").disabled = false;
		document.getElementById("XX_direction_off_5").disabled = true;

		globalRotationXX_ON_5 = false;
		globalRotationYY_ON_5 = false;
		globalRotationZZ_ON_5 = false;
		globalAngleXX_5 = 0;
		globalAngleYY_5 = 0;
		globalAngleZZ_5 = 0;

		for(var i = 0; i < sceneModels_5.length; i++ )
	    {
			sceneModels_5[i].tx_5 = geralSave_5[i].tx_5; sceneModels_5[i].ty_5 = geralSave_5[i].ty_5;
			sceneModels_5[i].sx_5 = geralSave_5[i].sx_5; sceneModels_5[i].sy_5 = geralSave_5[i].sy_5; sceneModels_5[i].sz_5 = geralSave_5[i].sz_5;
			sceneModels_5[i].rotXXOn_5 = false;	
			sceneModels_5[i].rotYYOn_5 = false;
			sceneModels_5[i].rotZZOn_5 = false;
			sceneModels_5[i].rotXXSpeed_5 = 1.0;
			sceneModels_5[i].rotYYSpeed_5 = 1.0;
			sceneModels_5[i].rotZZSpeed_5 = 1.0;
		}

		drawScene_5();  
	};

	document.getElementById("file").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		// reader.onload = function(){
			
		// 	var tokens = this.result;
    
		// 	// Array of values; each value is a string
			
			// var numVertices = parseInt( tokens[0] );
			// alert(numVertices);
		sceneModels_5 = [];
		reader.onload=function(){ 
			var theArray = reader.result.trim().split(/\s+/);
			var cor;
			num_sen = 0;
			for(let i=0; i< theArray.length; i++) {
				if(theArray[i] == "esfera"){
					sceneModels_5.push( new sphereModel_5( 6 ) );
					sceneModels_5[num_sen].rotZZOn_5 = false;
					sceneModels_5[num_sen].rotYYOn_5 = false;

					cor = theArray[i+1].split(",")
					sceneModels_5[num_sen].kDiff_5 = [ cor[0], cor[1], cor[2] ];

					sceneModels_5[num_sen].tx_5 = theArray[i+2]; sceneModels_5[num_sen].ty_5 =theArray[i+3];

					sceneModels_5[num_sen].sx_5 = theArray[i+4]; sceneModels_5[num_sen].sy_5 = theArray[i+4]; sceneModels_5[num_sen].sz_5 = theArray[i+4];
					num_sen++;
				}
				if(theArray[i] == "retangulo"){
					sceneModels_5.push( new simpleCubeModel_5() );
					sceneModels_5[num_sen].rotZZOn_5 = false;
					sceneModels_5[num_sen].rotYYOn_5 = false;

					cor = theArray[i+1].split(",")
					sceneModels_5[num_sen].kDiff_5 = [ cor[0], cor[1], cor[2] ];

					sceneModels_5[num_sen].tx_5 = theArray[i+2]; sceneModels_5[num_sen].ty_5 =theArray[i+3];

					sceneModels_5[num_sen].sx_5 = theArray[i+4]; sceneModels_5[num_sen].sy_5 = theArray[i+5]; sceneModels_5[num_sen].sz_5 = theArray[i+6];
					console.log(sceneModels_5[num_sen].sx_5);
					//sceneModels_5[num_sen].sx_5 = theArray[i+4]; sceneModels_5[num_sen].sy_5 = theArray[i+5]; sceneModels_5[num_sen].sz_5 = theArray[i+6];

					sceneModels_5[num_sen].rotAngleZZ_5 = theArray[i+7];
					num_sen++;
					
				}
				//console.log(sceneModels_5[i]);
			}
		}
		tick_5(); 
		
		geralSave_5 = Object.create(sceneModels_5);
		console.log(geralSave_5);
		console.log(geralSave_5[2]);
		for(let i=0; i<geralSave_5.length; i++){
			console.log(geralSave_5[i]);
		}
		// Entire file read as a string
			
		reader.readAsText( file );
	};
}

//--------------------------- WebGL Initialization ---------------------------

function initWebGL_5( canvas ) {
	try {
		gl_5 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
		primitiveType_5 = gl_5.TRIANGLES;	
		gl_5.enable( gl_5.CULL_FACE );	
		gl_5.cullFace( gl_5.BACK );
		gl_5.enable( gl_5.DEPTH_TEST ); 
	} catch (e) {
	}
	if (!gl_5) {
		alert("Could not initialise WebGL 1, sorry! :-(");
	}       
}

function runWebGL_5() {	
	var canvas = document.getElementById("my-canvas");	
	initWebGL_5( canvas );
	
	shaderProgram_5 = initShaders( gl_5 );	
	setEventListeners_5();	
	tick_5(); 
	outputInfos_5();
}