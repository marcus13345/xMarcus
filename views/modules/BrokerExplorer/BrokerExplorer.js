//# sourceURL=BrokerExplorer
// test
(function BrokerExplorer() {
	class BrokerExplorer {
		async DOMLoaded(com, fun) {
			// debugger;

			this.Vlt.div.on('click', '.root', function() {
				let content = $(this).nextUntil('.root');
				if($(this).attr('open') != null) {
					// hide everything
					$(this).attr('open', null);
					content.attr('hidden', true);
				}else {
					// show everything
					$(this).attr('open', true);
					content.attr('hidden', null);
				}
			});

			this.ascend('LoadModules');

			
			com = await this.asuper(com);
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
					let fileItem = await this.partial('file', {fileName: filename, module: module});
					elems.find('.fileList').append(fileItem);
				}
			}
			fun(null, com);
		}

		async SelectFile(com, fun) {
			let module = $(com.Element).attr('module').trim();
			let fileName = $(com.Element).attr('fileName').trim();
			let contents = (await this.ascend('GetFileContents', {
				Module: module,
				Filepath: fileName
			}, this.Par.Broker)).File;
			await this.ascend('SetText', {Value: contents, DocumentId: {Module: module, Filepath: fileName}}, this.Par.Editor);
			fun(null, com);
		}
	}
	// debugger;

	return Viewify(BrokerExplorer, '4.0');
})();