define([
	"progjs/core/Router",
	"progjs/core/ContentWirer",
	"progjs/core/ContentLoader",
	"progjs/Preloader",
	"progjs/transitioners/regularFlow",
	"signals",
], function(router,contentWirer,contentLoader,Preloader,transitioner,signals)
{
	var container;
	var currentUrl;
	var currentViewModel;
	var preloader = Preloader.create({});

	function getPath(url){
		var parser = document.createElement('a');
		parser.href = url;
		var result = parser.pathname.indexOf("/") == 0 ? parser.pathname : "/" + parser.pathname;
		return result;
	}
	var obj = {
		loaded: new signals.Signal(),
		init: function () {
			return new Promise(function (resolve, reject) {
				return router.init().then(function(){
					return contentWirer.init()
				})
				.then(function(){
					contentLoader.init(contentWirer);
					router.pathChanged.add(this._onPathChanged.bind(this));
					console.log("Section Loader ready");
					resolve();
				}.bind(this));
			}.bind(this))
		},
		start: function(){
			container = $("[data-pg-target]");
			currentUrl = router.currentPath;

			contentLoader.contentLoaded.add(function(data){
				currentViewModel = data.viewModel;
				container.empty().append(data.view);
			}.bind(this))

			contentLoader.local(document,currentUrl);
		},
		addContentParser: function(w){
			contentWirer.registerParser(w);
		},
		setPreloader: function(pre){
			preloader = pre;
		},
		load: function(url){
			url = getPath(url);
			console.log("Load URL: " + url);
			if(url == currentUrl){
				console.log("Same path, aborting...");
				return false;
			}
			currentUrl = url;
			transitioner.start(currentViewModel,url,preloader);
			return true;
		},
		_onPathChanged: function(e){
			this.load(e.path);
		},

	};
	return obj;
});
