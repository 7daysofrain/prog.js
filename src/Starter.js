define(["progjs/ProgApp"], function(app)
{
	var obj = {
		getApp: function(pathToFramework){
			return new Promise(function (resolve, reject) {
				// Esto no funciona todavia, es como si estuviera en un sandbox diferente
				/*window.require.config({
					paths: {
						"__progjs": pathToFramework,
						"object.assing" : pathToFramework + "/../node_modules/es6-object-assign/dist/object-assign",
						"waitForImages": pathToFramework + "/../node_modules/jquery.waitforimages/dist/jquery.waitforimages"
					}
				});
				require(["__progjs/ProgApp"],function(app){
					app.init().then(function(){
						resolve(app);
					})
				})*/
				app.init().then(function(){
					resolve(app);
				})
			});
		}
	};
	return obj;
});
