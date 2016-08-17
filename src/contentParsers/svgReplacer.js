define([], function()
{

	var loadsLeft = 0;
	return {
		parse: function ($content) {
			$content.find("[data-svg-replace]").each(function (i, el) {
				this.replace(el);
			}.bind(this));
		},
		replace: function(el){
			loadsLeft++;
			$.ajax(el.src || $(el).attr("srcset")).done(function (result, status, xhr) {
				loadsLeft--;
				if(!$(el).parent()[0]){
					console.log(el)
				}
				else if($(el).parent()[0].tagName == "PICTURE"){
					$(el).parent().replaceWith(xhr.responseText);
				}
				else{
					$(el).replaceWith(xhr.responseText);
				}
				if (loadsLeft == 0) {
					console.log("SVG <img> replacement done");
				}
			}).error(function (err) {
				console.log(err);
			});
		}
	}
});
