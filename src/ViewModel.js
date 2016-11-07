define(["object.assing"], function(oa)
{
	var obj = {
		create: function(def){
			var vm = {
				transitionIn: function(){
					console.log("Transitioned in");
					return new Promise(function (resolve, reject) {
						resolve();
					});
				},
				transitionOut: function(){
					console.log("Transitioned out");
					return new Promise(function (resolve, reject) {
						resolve();
					});
				},
				onAfterLoad: function(){
					console.log("After load");
					return new Promise(function (resolve, reject) {
						resolve();
					});
				},
				onBeforeUnload: function(){
					console.log("Before unload");
					return new Promise(function (resolve, reject) {
						resolve();
					});
				},
				onHashChanged: function(){},
				preloader: this.preloader,
			};
			Object.assign(vm,def);
			return vm;
		}
	};
	return obj;
});
