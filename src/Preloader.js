define(["object.assing"], function(oa)
{
	oa.polyfill();
	var obj = {
		create: function(def){
			var vm = {
				show: function(){
					console.log("Preloader show");
					return new Promise(function (resolve, reject) {
						resolve();
					});
				},
				hide: function(){
					console.log("Preloader hide");
					return new Promise(function (resolve, reject) {
						resolve();
					});
				},
			};
			Object.assign(vm,def);
			return vm;
		}
	};
	return obj;
});
