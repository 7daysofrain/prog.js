define([
	"progjs/Enviornment",
	"progjs/ViewModel",
	"progjs/core/StylesManager",
	"signals",
	"waitForImages",
], function(Enviornment,ViewModel,stylesManager,signals)
{

	function httpget(url) {
		return new Promise(function (resolve, reject) {
			$.get(url).done(resolve).fail(reject);
		});
	}
	function waitForImages(content) {
		return new Promise(function (resolve, reject) {
			$(content).find("[data-pg-content]").waitForImages(true).done(function(){
				resolve();
			});
		});
	}
	var cache = {};
	var currentViewModel,contentWirer,newContent;
	var obj = {
		useCache: true,
		contentLoaded: new signals.Signal(),
		init: function(_contentWirer){
			contentWirer = _contentWirer;
		},
		remote: function(currentUrl,useCache){
			return new Promise(function (resolve, reject) {
				console.log("Start fetch");
				httpget(currentUrl)
				.then(function (content) {
					console.log("URL Loaded");
					newContent = content;
					stylesManager.clearUnlocked();
					return stylesManager.loadFromDocument(content)
				})
				.then(function() {
					console.log("Styles Loaded");
					return waitForImages(newContent);
				})
				.then(function () {
					console.log("Images loaded");
					if(obj.useCache || useCache){
						cache[currentUrl] = newContent;
					}
					return obj.local(newContent,currentUrl);
				})
				.then(function(payload){
					resolve(payload);
				})
			});
		},
		local: function(document,currentUrl){
			return new Promise(function (resolve, reject) {
				var newContent = $(document).find("[data-pg-content]");
				newContent.remove();
				contentWirer.process(newContent);
				var meta = $(document).filter('meta[name="pg:viewModel"]').length > 0 ? $(document).filter('meta[name="pg:viewModel"]') : $(document).find('meta[name="pg:viewModel"]')
				if (meta.length > 0) {
					var vmname = "/" + meta.attr("content");
				}

				var meta = $(document).filter('meta[name="pg:viewModel:mobile"]').length > 0 ? $(document).filter('meta[name="pg:viewModel:mobile"]') : $(document).find('meta[name="pg:viewModel"]')
				if (meta.length > 0 && Enviornment.isMobileSize) {
					var vmname = "/" + meta.attr("content");
				}
				var prefix = "/content/script/";
				var path = "app/viewModel";
				var moduleName = vmname || (currentUrl == "/" || currentUrl.indexOf("/#") == 0 ? "/index" : currentUrl.replace('.html', ''));
				var module = path + moduleName;
				console.log("Module to load: " + module);
				require(
					[module],
					function (viewModel) {
						console.log("View model loaded");
						var payload = this.prepareViewModel(viewModel,newContent,document);
						resolve(payload);
					}.bind(this),
					function () {
						console.log("ViewModel load error, creating one", arguments);
						var viewModel = ViewModel.create({});
						var payload = this.prepareViewModel(viewModel,newContent,document);
						resolve(payload);
					}.bind(this)
				)
			}.bind(this));
		},
		prepareViewModel: function(viewModel,newContent,document){
			currentViewModel = viewModel;
			viewModel.view = newContent;
			newContent.addClass("pg-loaded");
			var payload = {view: newContent, viewModel: viewModel,loadedDocument: document};
			this.contentLoaded.dispatch(payload);
			return payload;
		},
		isCached: function(url){
			return cache[url] == null;
		}
	};
	return obj;
});
