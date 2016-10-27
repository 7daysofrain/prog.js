define([
	"progjs/core/Router",
	"progjs/core/ContentWirer",
	"progjs/core/ContentLoader",
	"progjs/Preloader",
	"progjs/ViewModel",
	"progjs/transitioners/regularFlow",
	"signals",
], function(router,contentWirer,contentLoader,Preloader,ViewModel,transitioner,signals)
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
		sectionChanged: new signals.Signal(),
		init: function () {
			return new Promise(function (resolve, reject) {
				return router.init().then(function(){
					return contentWirer.init()
				})
				.then(function(){
					contentLoader.init(contentWirer);
					router.pathChanged.add(this._onPathChanged.bind(this));
					console.log("Section Loader ready");
					ViewModel.preloader = preloader;
					resolve();
				}.bind(this));
			}.bind(this))
		},
		start: function(){
			container = $("[data-pg-target]");
			currentUrl = router.currentPath;

			preloader.show();

			contentLoader.contentLoaded.add(function(data){
				currentViewModel = data.viewModel;
				container.empty().append(data.view);
				router.hashChanged.add(currentViewModel.onHashChanged.bind(currentViewModel));
				if($(data.loadedDocument).filter("title").text()){
					$(document).find("head title").text($(data.loadedDocument).filter("title").text())
				}
				this.sectionChanged.dispatch(data);
			}.bind(this))

			contentWirer.process($(document));

			contentLoader.local(document,currentUrl)
				.then(function(e){
					currentViewModel = e.viewModel;
					return currentViewModel.onAfterLoad();
				})
				.then(function(){
					return preloader.hide();
				})
				.then(function(){
					return currentViewModel.transitionIn();
				});
			;
		},
		addContentParser: function(w){
			contentWirer.registerParser(w);
		},
		setPreloader: function(pre){
			preloader = pre;
			ViewModel.preloader = preloader;
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
