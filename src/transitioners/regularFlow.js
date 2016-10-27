define(["progjs/core/ContentLoader"], function(contentLoader)
{
	var newVM;
	var obj = {
		start: function(vm,nextUrl,preloader){
			newVM = null;
			vm.transitionOut()
				.then(function(){
					return vm.onBeforeUnload()
				})
				.then(function(){
					return preloader.show();
				})
				.then(function(){
					return contentLoader.remote(nextUrl);
				})
				.then(function(e){
					$(window).scrollTop(0);
					newVM = e.viewModel;
					return newVM.onAfterLoad();
				})
				.then(function(){
					return preloader.hide();
				})
				.then(function(){
					return newVM.transitionIn();
				});
		}
	};
	return obj;
});
