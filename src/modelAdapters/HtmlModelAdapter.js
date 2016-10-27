define([], function()
{
	var obj = {

	};
	return obj;
});

/*

Los models adapter parsean el modelo y lo insertan en el viewModel.
Este sería el default que tendría que trabajar con el documento actual y sacar un modelo usando atributos data-
Pero puede haber mas, como de fichero json externo, llamada a api y cosas así.

Yo lo configuraría via metadata <meta name="pg-model-adapter" value="JsonFileAdapter">

 */
