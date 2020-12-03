
//----------------------------- Global Variables -----------------------------

var gl = null; // WebGL context
var shaderProgram = null;
var triangleVertexPositionBuffer = null;
var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters
var globalAngleYY = 0.0;
var globalTz = 0.0;

// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors
var sx = 0.5;
var sy = 0.5;
var sz = 0.5;

// GLOBAL Animation controls
var globalRotationYY_ON = 1;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;

// Local Animation controls
var rotationXX_ON = 1;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;
var rotationYY_ON = 1;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
var rotationZZ_ON = 1;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles
var primitiveType = null;
 
// To allow choosing the projection type
var projectionType = 0;

// Ambient coef.
var kAmbi = [ 0.2, 0.2, 0.2 ];

// Difuse coef.
var kDiff = [ 0.7, 0.7, 0.7 ];

// Specular coef.
var kSpec = [ 0.7, 0.7, 0.7 ];

// Phong coef.
var nPhong = 100;

// Initial model (2 cubos)
var vertices = [
		// FRONT FACE		 
		-0.25, -0.25,  0.25,		 
		 0.25, -0.25,  0.25,		 
		 0.25,  0.25,  0.25,
		 
		 0.25,  0.25,  0.25,		 
		-0.25,  0.25,  0.25,		 
		-0.25, -0.25,  0.25,
		
		// TOP FACE		
		-0.25,  0.25,  0.25,		 
		 0.25,  0.25,  0.25,		 
		 0.25,  0.25, -0.25,
		 
		 0.25,  0.25, -0.25,		 
		-0.25,  0.25, -0.25,		 
		-0.25,  0.25,  0.25,
		
		// BOTTOM FACE 		
		-0.25, -0.25, -0.25,		 
		 0.25, -0.25, -0.25,		 
		 0.25, -0.25,  0.25,
		 
		 0.25, -0.25,  0.25,		 
		-0.25, -0.25,  0.25,		 
		-0.25, -0.25, -0.25,
		
		// LEFT FACE 		
		-0.25,  0.25,  0.25,		 
		-0.25, -0.25, -0.25,
		-0.25, -0.25,  0.25,
		 		 
		-0.25,  0.25,  0.25,		 
		-0.25,  0.25, -0.25,		 
		-0.25, -0.25, -0.25,
		
		// RIGHT FACE 		
		 0.25,  0.25, -0.25,		 
		 0.25, -0.25,  0.25,
		 0.25, -0.25, -0.25,
		 	 
		 0.25,  0.25, -0.25,		 
		 0.25,  0.25,  0.25,		 
		 0.25, -0.25,  0.25,
		
		// BACK FACE 		
		-0.25,  0.25, -0.25,		 
		 0.25, -0.25, -0.25,
		-0.25, -0.25, -0.25,
		 		 
		-0.25,  0.25, -0.25,		 
		 0.25,  0.25, -0.25,		 
		 0.25, -0.25, -0.25,
];

var normals = [
		// FRONTAL TRIANGLE		 
		 0.0,  0.0,  1.0,		 
		 0.0,  0.0,  1.0,		 
		 0.0,  0.0,  1.0,
];

var colors = [
		 // FRONT FACE		 	
		 1.00,  0.00,  0.00,		 
		 1.00,  0.00,  0.00,		 
		 1.00,  0.00,  0.00,
		 	
		 1.00,  1.00,  0.00,		 
		 1.00,  1.00,  0.00,		 
		 1.00,  1.00,  0.00,
		 			 
		 // TOP FACE		 	
		 0.00,  0.00,  0.00,		 
		 0.00,  0.00,  0.00,		 
		 0.00,  0.00,  0.00,
		 	
		 0.50,  0.50,  0.50,		 
		 0.50,  0.50,  0.50,		 
		 0.50,  0.50,  0.50,
		 			 
		 // BOTTOM FACE		 	
		 0.00,  1.00,  0.00,		 
		 0.00,  1.00,  0.00,		 
		 0.00,  1.00,  0.00,
		 	
		 0.00,  1.00,  1.00,		 
		 0.00,  1.00,  1.00,		 
		 0.00,  1.00,  1.00,
		 			 
		 // LEFT FACE		 	
		 0.00,  0.00,  1.00,		 
		 0.00,  0.00,  1.00,		 
		 0.00,  0.00,  1.00,
		 	
		 1.00,  0.00,  1.00,		 
		 1.00,  0.00,  1.00,		 
		 1.00,  0.00,  1.00,
		 			 
		 // RIGHT FACE		 	
		 0.25,  0.50,  0.50,		 
		 0.25,  0.50,  0.50,		 
		 0.25,  0.50,  0.50,
		 	
		 0.50,  0.25,  0.00,		 
		 0.50,  0.25,  0.00,		 
		 0.50,  0.25,  0.00,		 			 
		 			 
		 // BACK FACE		 	
		 0.25,  0.00,  0.75,		 
		 0.25,  0.00,  0.75,		 
		 0.25,  0.00,  0.75,
		 	
		 0.50,  0.35,  0.35,	 
		 0.50,  0.35,  0.35,		 
		 0.50,  0.35,  0.35,
];

//------------------------------ The WebGL code ------------------------------

function initBuffers() {	
	
	// Coordinates	
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	// Associating to the vertex shader	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors	
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

function computeIllumination( mvMatrix ) {

	// Clearing the colors array	
	for( var i = 0; i < colors.length; i++ )
	{
		colors[i] = 0.0;
	}
	
    // SMOOTH-SHADING 
    for( var vertIndex = 0; vertIndex < vertices.length; vertIndex += 3 )
    {	
		// GET COORDINATES AND NORMAL VECTOR
		var auxP = vertices.slice( vertIndex, vertIndex + 3 );		
		var auxN = normals.slice( vertIndex, vertIndex + 3 );

        // CONVERT TO HOMOGENEOUS COORDINATES
		auxP.push( 1.0 );		
		auxN.push( 0.0 );
		
        // APPLY CURRENT TRANSFORMATION
        var pointP = multiplyPointByMatrix( mvMatrix, auxP );
        var vectorN = multiplyVectorByMatrix( mvMatrix, auxN );     
        normalize( vectorN );

		// VIEWER POSITION		
		var vectorV = vec3();		
		if( projectionType == 0 ) {		
			vectorV[2] = 1.0;	// Orthogonal 	
		}	
		else {			
			vectorV = symmetric( pointP );	// Perspective
		}		
        normalize( vectorV );

	    // FOR EACH LIGHT SOURCE	    
	    for(var l = 0; l < lightSources.length; l++ )
	    {
			if( lightSources[l].isOff() ) {			
				continue;
			}
			
	        // INITIALIZE EACH COMPONENT, with the constant terms
		    var ambientTerm = vec3();		
		    var diffuseTerm = vec3();		
		    var specularTerm = vec3();
		
		    // For the current light source		
		    ambient_Illumination = lightSources[l].getAmbIntensity();		
		    int_Light_Source = lightSources[l].getIntensity();		
		    pos_Light_Source = lightSources[l].getPosition();		    
			
			// Animating the light source, if defined		    
		    var lightSourceMatrix = mat4();

		    if( lightSources[l].isRotYYOn() ) 
		    {
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[l].getRotAngleYY() ) );
			}			
	        for( var i = 0; i < 3; i++ )
	        {
			    // AMBIENT ILLUMINATION --- Constant for every vertex	   
			    ambientTerm[i] = ambient_Illumination[i] * kAmbi[i];	
	            diffuseTerm[i] = int_Light_Source[i] * kDiff[i];	
	            specularTerm[i] = int_Light_Source[i] * kSpec[i];
	        }
	    
	        // DIFFUSE ILLUMINATION	        
	        var vectorL = vec4();	
	        if( pos_Light_Source[3] == 0.0 )
	        {
	            // DIRECTIONAL Light Source	            
	            vectorL = multiplyVectorByMatrix( 
							lightSourceMatrix,
							pos_Light_Source );
	        }
	        else
	        {
	            // POINT Light Source
	            vectorL = multiplyPointByMatrix( 
							lightSourceMatrix,
							pos_Light_Source );
				
				for( var i = 0; i < 3; i++ )
	            {
	                vectorL[ i ] -= pointP[ i ];
	            }
	        }
	
			// Back to Euclidean coordinates		
			vectorL = vectorL.slice(0,3);			
	        normalize( vectorL );	
	        var cosNL = dotProduct( vectorN, vectorL );	
	        if( cosNL < 0.0 )
	        {
				// No direct illumination !!				
				cosNL = 0.0;
	        }
	
	        // SEPCULAR ILLUMINATION 	
	        var vectorH = add( vectorL, vectorV );	
	        normalize( vectorH );	
	        var cosNH = dotProduct( vectorN, vectorH );
	
			// No direct illumination or viewer not in the right direction		
	        if( (cosNH < 0.0) || (cosNL <= 0.0) )
	        {
	            cosNH = 0.0;
	        }
	
	        // Compute the color values and store in the colors array	        
	        var tempR = ambientTerm[0] + diffuseTerm[0] * cosNL + specularTerm[0] * Math.pow(cosNH, nPhong);
	        var tempG = ambientTerm[1] + diffuseTerm[1] * cosNL + specularTerm[1] * Math.pow(cosNH, nPhong);
	        var tempB = ambientTerm[2] + diffuseTerm[2] * cosNL + specularTerm[2] * Math.pow(cosNH, nPhong);
			colors[vertIndex] += tempR;
	        
	        // Avoid exceeding 1.0
			if( colors[vertIndex] > 1.0 ) {				
				colors[vertIndex] = 1.0;
			}
	        
	        // Avoid exceeding 1.0	        
			colors[vertIndex + 1] += tempG;			
			if( colors[vertIndex + 1] > 1.0 ) {				
				colors[vertIndex + 1] = 1.0;
			}			
			colors[vertIndex + 2] += tempB;
	        
	        // Avoid exceeding 1.0	        
			if( colors[vertIndex + 2] > 1.0 ) {				
				colors[vertIndex + 2] = 1.0;
			}
	    }	
	}
}

function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, ) {

	// The the global model transformation is an input   
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// Aux. Function for computing the illumination	
	computeIllumination( mvMatrix );
	
	// Associating the data to the vertex shader
	initBuffers();
	
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

// Drawing the 3D scene
function drawScene() {
	var pMatrix;
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix	
	if( projectionType == 0 ) {				
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		globalTz = 0.0;
	}
	else {			
		pMatrix = perspective( 45, 1, 0.05, 15 );		
		globalTz = -2.5;
	}
	
	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	
	
	// Instantianting the current model	
	// Instance 1 --- RIGHT	
	drawModel( -angleXX, angleYY, angleZZ, 
	           sx, sy, sz,
	           tx + 0.5, ty, tz,
	           mvMatrix,
			   primitiveType );
	
	// Instance 2 --- LEFT
	drawModel( -angleXX, angleYY, angleZZ, 
				sx, sy, sz,
				tx - 0.5, ty, tz,
				mvMatrix,
				primitiveType );

	// Instance 3 --- CENTER
	drawModel( -angleXX, angleYY, angleZZ, 
		sx, sy, sz,
		tx , ty, tz,
		mvMatrix,
		primitiveType );
}

//--------------------------------- Animation --------------------------------
var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();	
	if( lastTime != 0 ) {		
		var elapsed = timeNow - lastTime;

		// Global rotation		
		if( globalRotationYY_ON ) {
			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// Local rotations		
		if( rotationXX_ON ) {
			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }
		if( rotationYY_ON ) {
			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }
		if( rotationZZ_ON ) {
			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
	    }

		// Rotating the light sources	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {
				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;	
				lightSources[i].setRotAngleYY( angle );
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
	
	document.getElementById("move-left-button").onclick = function(){
		tx -= 0.25;
		drawScene();  
	};

	document.getElementById("move-right-button").onclick = function(){
		tx += 0.25;
		drawScene();  
	};      

	document.getElementById("move-up-button").onclick = function(){
		ty += 0.25;
		drawScene();  
	};      

	document.getElementById("move-down-button").onclick = function(){
		ty -= 0.25;
		drawScene();  
	};

	document.getElementById("scale-up-button").onclick = function(){
		sx *= 1.1;		
		sy *= 1.1;		
		sz *= 1.1;
		drawScene();  
	};      

	document.getElementById("scale-down-button").onclick = function(){
		sx *= 0.9;		
		sy *= 0.9;		
		sz *= 0.9;
		drawScene();  
	};      

	document.getElementById("text-file").onchange = function(){		
		var file = this.files[0];		
		var reader = new FileReader();		
		reader.onload = function( progressEvent ){
			var tokens = this.result.split(/\s\s*/);
			var numVertices = parseInt( tokens[0] );
			var i, j;
			var aux = 1;			
			var newVertices = [];			
			for( i = 0; i < numVertices; i++ ) {			
				for( j = 0; j < 3; j++ ) {					
					newVertices[ 3 * i + j ] = parseFloat( tokens[ aux++ ] );
				}
			}
					
			// Assigning to the current model		
			vertices = newVertices.slice();
			
			// Computing the triangle normal vector for every vertex	
			computeVertexNormals( vertices, normals );
			
			// To render the model just read
			initBuffers();

			// RESET the transformations
			tx = ty = tz = 0.0;						
			angleXX = angleYY = angleZZ = 0.0;			
			sx = sy = sz = 0.5;
		};
		
		// Entire file read as a string			
		reader.readAsText( file );		
	}

    // Dropdown list
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

	// Dropdown list
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

	// Button events	
	document.getElementById("XX-on-off-button").onclick = function(){
		if( rotationXX_ON ) {			
			rotationXX_ON = 0;
		}
		else {			
			rotationXX_ON = 1;
		}  
	};

	document.getElementById("XX-direction-button").onclick = function(){
		if( rotationXX_DIR == 1 ) {			
			rotationXX_DIR = -1;
		}
		else {		
			rotationXX_DIR = 1;
		}  
	};      

	document.getElementById("XX-slower-button").onclick = function(){		
		rotationXX_SPEED *= 0.75;  
	};      

	document.getElementById("XX-faster-button").onclick = function(){		
		rotationXX_SPEED *= 1.25;  
	};      

	document.getElementById("YY-on-off-button").onclick = function(){
		if( rotationYY_ON ) {		
			rotationYY_ON = 0;
		}
		else {			
			rotationYY_ON = 1;
		}  
	};

	document.getElementById("YY-direction-button").onclick = function(){
		if( rotationYY_DIR == 1 ) {			
			rotationYY_DIR = -1;
		}
		else {		
			rotationYY_DIR = 1;
		}  
	};      

	document.getElementById("YY-slower-button").onclick = function(){		
		rotationYY_SPEED *= 0.75;  
	};      

	document.getElementById("YY-faster-button").onclick = function(){		
		rotationYY_SPEED *= 1.25;  
	};      

	document.getElementById("ZZ-on-off-button").onclick = function(){
		if( rotationZZ_ON ) {			
			rotationZZ_ON = 0;
		}
		else {			
			rotationZZ_ON = 1;
		}  
	};

	document.getElementById("ZZ-direction-button").onclick = function(){
		if( rotationZZ_DIR == 1 ) {			
			rotationZZ_DIR = -1;
		}
		else {
			rotationZZ_DIR = 1;
		}  
	};      

	document.getElementById("ZZ-slower-button").onclick = function(){		
		rotationZZ_SPEED *= 0.75;  
	};      

	document.getElementById("ZZ-faster-button").onclick = function(){		
		rotationZZ_SPEED *= 1.25;  
	};      

	document.getElementById("reset-button").onclick = function(){
		angleXX = 0.0;
		angleYY = 0.0;
		angleZZ = 0.0;

		rotationXX_ON = 0;		
		rotationXX_DIR = 1;		
		rotationXX_SPEED = 1;
		rotationYY_ON = 0;		
		rotationYY_DIR = 1;		
		rotationYY_SPEED = 1;
		rotationZZ_ON = 0;		
		rotationZZ_DIR = 1;		
		rotationZZ_SPEED = 1;
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
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function runWebGL() {	
	var canvas = document.getElementById("my-canvas");	
	initWebGL( canvas );
	shaderProgram = initShaders( gl );	
	setEventListeners();
	initBuffers();	
	tick();    
	outputInfos();
}
