/**
 * Created by 7daysofrain on 17/8/16.
 */
define([], function()
{
	var obj = {
		mobileSizeThreshold: 500
	};
	Object.defineProperty(obj,"isMobileSize",{
		get: function(){
			return $(window).width() <= this.mobileSizeThreshold;
		}
	})
	return obj;
});
