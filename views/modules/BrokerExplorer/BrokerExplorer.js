//# sourceURL=BrokerExplorer
(function BrokerExplorer() {
	class BrokerExplorer {
		async DOMLoaded(com, fun) {
			// debugger;
			await this.cdnImportJs("https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js");
			let that = this;
			$(document).ready(_ => {
				that.Vlt.div.find('.collapsible').collapsible();
			});
			this.ascend('LoadModules');
			fun(null, com);
		}

		async LoadModules(com, fun) {
			// debugger;
			let modules = this.ascend('GetModules', {}, this.Par.Broker);
			try{
				modules = await modules;
			}catch(e) {
				modules = {Modules: []};
				log.w(e);
				log.w('loading empty array of modules instead');
			}
			modules = modules.Modules;
			for(let module of modules) {
				let elems = await this.partial('moduleListing', {moduleName: module});
				this.Par.$.modules.append(elems);
				let files = (await this.ascend('GetFiles', {Module: module}, this.Par.Broker)).Files
				for(let filename of files) {
					let fileItem = await this.partial('file', {fileName: filename});
					elems.find('.fileList').append(fileItem);
				}
			}
			fun(null, com);
		}
	}
	// debugger;

	return Viewify(BrokerExplorer, '4.0');
})();