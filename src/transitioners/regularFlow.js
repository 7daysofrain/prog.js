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
					newVM = e.viewModel;
					return preloader.hide();
				})
				.then(function(){
					return newVM.onAfterLoad();
				})
				.then(function(){
					return newVM.transitionIn();
				});
		}
	};
	return obj;
});
