define([], function()
{

	function loadStyleSheet( path, fn, scope ) {
		var head = document.getElementsByTagName( 'head' )[0], // reference to document.head for appending/ removing link nodes
			link = document.createElement( 'link' );           // create the link node
		link.setAttribute( 'href', path );
		link.setAttribute( 'rel', 'stylesheet' );
		link.setAttribute( 'type', 'text/css' );

		var sheet, cssRules;
		// get the correct properties to check for depending on the browser
		if ( 'sheet' in link ) {
			sheet = 'sheet'; cssRules = 'cssRules';
		}
		else {
			sheet = 'styleSheet'; cssRules = 'rules';
		}

		var interval_id = setInterval( function() {                     // start checking whether the style sheet has successfully loaded
				try {
					if ( link[sheet] && link[sheet][cssRules].length ) { // SUCCESS! our style sheet has loaded
						clearInterval( interval_id );                      // clear the counters
						clearTimeout( timeout_id );
						fn.call( scope || window, true, link );           // fire the callback with success == true
					}
				} catch( e ) {} finally {}
			}, 10 ),                                                   // how often to check if the stylesheet is loaded
			timeout_id = setTimeout( function() {       // start counting down till fail
				clearInterval( interval_id );             // clear the counters
				clearTimeout( timeout_id );
				head.removeChild( link );                // since the style sheet didn't load, remove the link node from the DOM
				fn.call( scope || window, false, link ); // fire the callback with success == false
			}, 15000 );                                 // how long to wait before failing

		head.appendChild( link );  // insert the link node into the DOM and start loading the style sheet

		return link; // return the link node;
	}

	var head,permCSSs, tempCSSs;
	var obj = {
		init: function(){
			return new Promise(function (resolve, reject) {
				head = $("head");
				permCSSs = $("link[rel=stylesheet][data-pg-locked]").toArray();
				tempCSSs = $("link[rel=stylesheet]:not([data-pg-locked])").toArray();
				resolve();
			});
		},
		clearTemp: function(){
			$(tempCSSs).remove();
		},
		// TODO soporte de multiples hojas de estilo en un documento
		loadFromDocument: function(document){
			var links = $(document).filter("link[rel=stylesheet]:not([data-pg-locked])");
			if(links.length > 0){
				return this.loadCSS(links.eq(0).attr("href"));
			}
			else{
				return new Promise(function (resolve, reject) {
					resolve(document);
				});
			}
		},
		loadCSS: function(url){
			return new Promise(function (resolve, reject) {
				loadStyleSheet( url, function( success, link ) {
					if ( success ) {
						resolve();
					}
					else {
						reject();
					}
				} );
			});
		}
	};
	return obj;
});
