
//  Recursive triangle subdivision, using the midpoints of edges
function recSubdivisionMidPoint( v1, v2, v3, 
								 coordsArray,
								 recursionDepth ) {

	if( recursionDepth == 0 ) {		
        coordsArray.push( v1[0], v1[1], v1[2] );		
		coordsArray.push( v2[0], v2[1], v2[2] );		
		coordsArray.push( v3[0], v3[1], v3[2] );
	}
	else {			
        var mid12 = computeMidPoint( v1, v2 );
        var mid23 = computeMidPoint( v2, v3 );       
        var mid31 = computeMidPoint( v3, v1 );
        recSubdivisionMidPoint( v1, mid12, mid31,
                                coordsArray, recursionDepth - 1 );
        recSubdivisionMidPoint( v2, mid23, mid12,
                                coordsArray, recursionDepth - 1 );
        recSubdivisionMidPoint( v3, mid31, mid23,
                                coordsArray, recursionDepth - 1 );
        recSubdivisionMidPoint( mid12, mid23, mid31,
                                coordsArray, recursionDepth - 1 );
	}
}

function midPointRefinement( coordsArray, 
						     recursionDepth ) {	

    var origArrayLength = coordsArray.length;
    var origCoords = coordsArray.slice();
    coordsArray.splice( 0, origArrayLength );
    var origIndex;
    for( origIndex = 0; origIndex < origArrayLength; origIndex += 9 )
    {
        recSubdivisionMidPoint( origCoords.slice( origIndex, origIndex + 3 ),
								origCoords.slice( origIndex + 3, origIndex + 6 ),
								origCoords.slice( origIndex + 6, origIndex + 9 ),
								coordsArray,
								recursionDepth );
    }
}

// Recursive triangle subdivision, using the triangle centroid
function recSubdivisionCentroid( v1, v2, v3, 
								 coordsArray,
								 recursionDepth ) {
	
	if( recursionDepth == 0 ) {
        coordsArray.push( v1[0], v1[1], v1[2] );
		coordsArray.push( v2[0], v2[1], v2[2] );		
		coordsArray.push( v3[0], v3[1], v3[2] );
	}
	else {
        var centroid = computeCentroid( v1, v2, v3 );

        recSubdivisionCentroid( v1, v2, centroid,
                                coordsArray, recursionDepth - 1 );
        recSubdivisionCentroid( v2, v3, centroid,
                                coordsArray, recursionDepth - 1 );
        recSubdivisionCentroid( v3, v1, centroid,
                                coordsArray, recursionDepth - 1 );
    }
}

function centroidRefinement( coordsArray, 
						     recursionDepth ) {
    var origArrayLength = coordsArray.length;
    var origCoords = coordsArray.slice();
    coordsArray.splice( 0, origArrayLength );
    var origIndex;
    for( origIndex = 0; origIndex < origArrayLength; origIndex += 9 )
    {
        recSubdivisionCentroid( origCoords.slice( origIndex, origIndex + 3 ),
								origCoords.slice( origIndex + 3, origIndex + 6 ),
								origCoords.slice( origIndex + 6, origIndex + 9 ),
								coordsArray,
								recursionDepth );
    }
}

//  Moving vertices to the spherical surface of radius 1
function moveToSphericalSurface( coordsArray ) {
    var arrayLength = coordsArray.length; 
    for( origIndex = 0; origIndex < arrayLength; origIndex += 3 )
    {
        var v =  coordsArray.slice( origIndex, origIndex + 3 );      
        normalize( v );       
        var i;       
        for( i = 0; i < 3; i++ ) {            
            coordsArray[origIndex + i] = v[i];
        }
    }
}

//  Computing the triangle unit normal vector and associating to every vertex
function computeVertexNormals( coordsArray, normalsArray ) {
	normalsArray.splice( 0, normalsArray.length );
    for( var index = 0; index < coordsArray.length; index += 9 )
    {
        var normalVector = computeNormalVector( coordsArray.slice(index, index + 3),
												coordsArray.slice(index + 3, index + 6),
												coordsArray.slice(index + 6, index + 9) );
        for( var j = 0; j < 3; j++ )
        {
            normalsArray.push( normalVector[0], normalVector[1], normalVector[2] ); 
		}
	}
}

