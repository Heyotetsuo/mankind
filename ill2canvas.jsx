(function(){
	var logf,doc,data;
	function getWorkDir(){ return app.activeDocument.path }
	function printf(s,a){
		var s2=s,i;
		for(i=0;i<a.length;i++){
			s2 = s2.replace("%s",a[i]);
		}
		return s2;
	}
	function debugLog( msg ){
		logf.open('a');
		logf.writeln( msg.toString() );
		logf.close();
	}
	function debugLogObj( obj, values ){
		var s = "", p;
		if ( typeof values !== "undefined" ){
			for (p in obj) s += (p+": "+obj[p]+'\n');
		} else {
			for (p in obj) s += (p+", ");
		}
		debugLog( s );
	}
	function saveData( data, fname ){
		var f = new File(
			printf(
				"%s/%s.json",
				[getWorkDir(),fname]
			)
		);
		f.open( 'w' );
		f.write( JSON.stringify(data) );
		f.close();
		f.parent.execute();
	}
	function arrDiff( a, b ){
		var c=[], i;
		for( i=0; i<a.length; i++ ){
			c.push( a[i] - b[i] );
		}
		return c;
	}
	function numToHexByte( n ){ return ( "00"+n.toString(16) ).slice(-2) }
	function rgbToHex( rgb ){
		return String(
			'#' +
			numToHexByte( rgb.red ) +
			numToHexByte( rgb.green ) +
			numToHexByte( rgb.blue )

		);
	}
	function getColors( path ){
		var colors = {};
		if ( path.filled ) colors.fillStyle = rgbToHex( path.fillColor );
		if ( path.stroked ) colors.stroke = {
			lineWidth: path.strokeWidth,
			strokeStyle: rgbToHex( path.strokeColor )
		}
		return colors;
	}
	function init(){
		try {
			app.activeDocument.path
		} catch(e){
			debugLog( e );
			alert( "Project file must be saved first" );
			return 1;
		}
		$.evalFile( "~/Desktop/mine/proj/cryptoart/lib/json2.js" );
		doc = app.activeDocument;
		logf = new File( "~/Desktop/mine/proj/eng/ailog.txt" );
		logf.encoding = "BINARY";
		data = {};
		return 0;
	}
	function main(){
		if ( init() === 1 ) return;

		var layer = doc.activeLayer;
		var fname = (
			doc.name.replace(/\.[^.]*$/,'') +
			'-' +
			layer.name
		);
		var paths = layer.pathItems;
		var data={}, sName="";
		var colors, points, part, i, j;
		data.width = doc.width;
		data.height = doc.height;
		debugLog( (new Date()) + ": parsing paths..." );
		for(i=0;i<paths.length;i++){
			debugLog( "path: " + (i+1) );
			sName = paths[i].name;
			points = paths[i].pathPoints;
			part = { verts:[], ins:[], outs:[] };
			for( j=0; j<points.length; j++ ){
				part.verts.push( points[j].anchor );
				part.ins.push( arrDiff(
					points[j].leftDirection,
					points[j].anchor
				));
				part.outs.push( arrDiff(
					points[j].rightDirection,
					points[j].anchor
				));
			}
			part.color = getColors( paths[i] );
			if ( sName.length === 0 ){
				data["_"+i] = part;
			} else {
				data[sName] = part;
			}
		}
		debugLog( (new Date()) + ": saving..." );
		saveData( data, fname );
		debugLog( (new Date()) + ": finished!" );
	}
	main();
}());
