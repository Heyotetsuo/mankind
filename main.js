var doc=document,win=window;
var rnd=Math.random,round=Math.round,max=Math.max,min=Math.min,PI=Math.PI;
var CVS=doc.querySelector("#comp1"),CVS2=doc.querySelector("#comp2");
var C=CVS.getContext("2d"),C2=CVS2.getContext("2d");
var SZ,nums,artObj;
function getNums(){
	var hashPairs=[],seed,rvs,j=0;
	seed = parseInt( tokenData.hash.slice(0,16), 16 );
	for(j=0;j<32;j++){
		hashPairs.push(
			tokenData.hash.slice( 2+(j*2),4+(j*2) )
		);
	}
	rvs = hashPairs.map(n=>parseInt(n,16));
	return rvs;
}
function clearC2(){ C2.clearRect( 0, 0, SZ, SZ ) }
function xhrIsReady( xhr ){ return xhr.readyState === 4 && xhr.status === 200; }
function xhrPOST( url, callback ){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if ( xhrIsReady(xhr) ){
			callback( xhr.response );
		}
	}
	xhr.open( "POST", url );
	xhr.send();
}
function canvasAction( callback ){
	C.save();
	C2.save();
	C.beginPath();
	callback( [].slice.call(arguments,1) );
	C.restore();
	C2.restore();
}
function transWithAnchor( x, y, C, callback ){
	C.translate( x, y );
	callback( [].slice.call(arguments,3) );
	C.translate( x*-1, y*-1 );
}
function addShape(shape,s,o,C){
	var vs=shape.verts, is=shape.ins||null, os=shape.outs||null;
	var x=(o?o[0]:SZ/2), y=(o?o[1]:SZ/2), l=vs.length,ax,ay,bx,by,cx,cy,i,j,k;
	C.beginPath();
	C.moveTo( x+vs[l-1][0]*s[0], y+vs[l-1][1]*s[1] );
	for( i=l; i<=l*2; i++ ){
		j=(i-1)%l, k=i%l;
		os ? ax = x+(vs[j][0]+os[j][0])*s[0]:null;
		os ? ay = y+(vs[j][1]+os[j][1])*s[1]:null;
		is ? bx = x+(vs[k][0]+is[k][0])*s[0]:null;
		is ? by = y+(vs[k][1]+is[k][1])*s[1]:null;
		cx = x+vs[k][0]*s[0];
		cy = y+vs[k][1]*s[1];
		if ( false && is && os ){
			C.bezierCurveTo( ax,ay,bx,by,cx,cy );
		} else {
			C.lineTo( cx,cy*-1 );
		}
	}
	// C.closePath();
}
function renderShape( shape, s, o, C ){
	addShape( shape, s, o, C );
	if ( shape.color.fillStyle ){
		C.fillStyle = shape.color.fillStyle;
		C.fill();
	}
	if ( shape.stroke ){
		C.lineWidth = shape.lineWidth;
		C.strokeStyle = shape.strokeStyle;
		C.stroke();
	}
}
function setSZ( w, h ){
	SZ = (w>h?w:h);
	CVS.setAttribute( "width", w );
	CVS.setAttribute( "height", h );
	CVS2.setAttribute( "width", w );
	CVS2.setAttribute( "height", h );
}
function init(){
	nums = getNums();
	setSZ( 800, 800 );
}
function handleKeyPress(){
	switch (event.charCode){
	case 32: // spacebar
		break;
	case 106: // j
		break;
	case 107: // k
		break;
	default:
		break;
	}
}
function render(){
	C.clearRect(0,0,SZ,SZ);
	xhrPOST( "forest-test.json", function(resp){
		artObj = JSON.parse(resp);
		var i=0, p;
		setSZ( 595, 841 );
		for( p in artObj ){
			if ( i>1 ) break;
			renderShape(
				artObj[p],
				[ 1, 1 ],
				[ 0, 0 ],
				C
			);
		}
	});
}
function main(){
	init();
	render();
}
main();
