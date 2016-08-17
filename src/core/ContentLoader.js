define([
	"progjs/Enviornment",
	"progjs/core/StylesManager",
	"signals",
	"waitForImages",
], function(Enviornment,stylesManager,signals)
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

	var currentViewModel,contentWirer,newContent;
	var obj = {
		contentLoaded: new signals.Signal(),
		init: function(_contentWirer){
			contentWirer = _contentWirer;
		},
		remote: function(currentUrl){
			return new Promise(function (resolve, reject) {
				console.log("Start fetch");
				httpget(currentUrl)
				.then(function (content) {
					console.log("URL Loaded");
					newContent = content;
					return stylesManager.loadFromDocument(content)
				})
				.then(function() {
					console.log("Styles Loaded");
					return waitForImages(newContent);
				})
				.then(function () {
					console.log("Images loaded");
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

				if ($(document).filter('meta[name="pg:viewModel"]').length > 0) {
					var vmname = "/" + $(document).filter('meta[name="pg:viewModel"]').attr("content");
				}

				if ($(document).filter('meta[name="pg:viewModel:mobile"]').length > 0 && Enviorment.isMobileSize) {
					var vmname = "/" + $(document).filter('meta[name="pg:viewModel:mobile"]').attr("content");
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
						currentViewModel = viewModel;
						var payload = {view: newContent, viewModel: viewModel};
						this.contentLoaded.dispatch(payload);
						resolve(payload);
					}.bind(this),
					function () {
						console.log("ViewModel load error", arguments);
					}.bind(this)
				)
			}.bind(this));
		}
	};
	return obj;
});
