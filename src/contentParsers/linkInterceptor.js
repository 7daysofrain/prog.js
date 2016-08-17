define(["progjs/core/Router"], function(router)
{
	var obj = {
		parse: function($content){
			$content.find("a:not([href^='http://']):not([href^='#'])").click(obj.handleLinkClick.bind(obj));
		},
		handleLinkClick: function(event){
			var a = $(event.target)[0];
			var url = $(event.currentTarget).attr("href");
			var parser = document.createElement("a");
			if(url && url.indexOf("://") == -1 ){
				console.log("Capturing link: " + url);
				router.handleLink(url);
				event.preventDefault();
			}
		},
	};
	return obj;
});
