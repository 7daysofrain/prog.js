define([
	'signals',
], function(signals)
{
	var forwardStack = [];
	var backStack = [location.pathname + location.hash];

	function getPath(url){
		var parser = document.createElement('a');
		parser.href = url;
		return parser.pathname;
	}
	function getHash(url){
		var parser = document.createElement('a');
		parser.href = url;
		return parser.hash;
	}
	var obj = {
		pathChanged: new signals.Signal(),
		hashChanged: new signals.Signal(),
		_currentPath: "",
		_currentHash: "",
		init: function(){
			this._currentPath = location.pathname || "/";
			this._currentHash = location.hash;
			return new Promise(function(resolve, reject) {
				try{
					$(window).bind('hashchange', obj._handleHashChange.bind(obj));
					$(window).bind("popstate",obj._handlePopState.bind(obj));
					obj._currentPath = location.pathname || "/";
					obj._currentHash = location.hash;
					history.replaceState({url:"/"}, "", location.href);
				}
				catch(error){
					console.error(error);
				}
				console.log("Router ready, started in: " + backStack[0]);
				resolve();
			});
		},
		handleLink: function(url,backNav){
			if(this._currentPath != getPath(url)){
				this._currentPath = getPath(url);
				this.pathChanged.dispatch({path:url,isBack:backNav});
			}
			else{
				location.hash = getHash(url);
				return;
			}
			if(!backNav){
				history.pushState({url:url}, "", url);
			}
		},
		back: function(){
			history.back();
		},
		_handlePopState: function(event){
			console.log("location: " + document.location + ", current: ",this._currentPath);
			if(document.location.pathname != this._currentPath){
				console.log("Found backward navigation:",document.location.pathname);
				this.handleLink(document.location.pathname,true);
			}
		},
		_handleHashChange: function(){
			var hash = location.hash || "#home";
			console.log("Navigating to: " + hash);
			this._currentHash = hash;
			this.hashChanged.dispatch({hash:hash});
		},
	};
	Object.defineProperty(obj,"currentPath",{
		get: function(){
			return this._currentPath;
		}
	});
	Object.defineProperty(obj,"currentHash",{
		get: function(){
			return this._currentHash;
		}
	});
	return obj;
});
