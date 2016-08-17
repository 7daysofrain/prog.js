/**
 * Created by 7daysofrain on 9/3/16.
 */
define([
	'../contentParsers/linkInterceptor'
], function(linkInterceptor)
{
	var parsers = new Array();
	var obj = {
		init: function(){
			return new Promise(function(resolve, reject) {
				obj.registerParser(linkInterceptor);
				console.log("Content wirer ready");
				resolve();
			});
		},
		registerParser: function(parser){
			if(typeof parser.parse != "function"){
				throw new Error("Cant register a parser without a parse(content) method");
			}
			parsers.push(parser);
		},
		process: function($content){
			parsers.forEach(function(parser){
				parser.parse($content);
			});
		}
	};
	return obj;
});
