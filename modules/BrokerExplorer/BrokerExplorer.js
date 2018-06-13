//# sourceURL=BrokerExplorer
(function BrokerExplorer() {
	class BrokerExplorer {
		async DOMLoaded(com, fun) {
			// debugger;
			this.Par.Brokers = this.Par.Brokers || {};

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

			//ask system of systems about the sources, then genmod
			try {
				let sourcesRequest = this.ascend('GetSources', {}, this.Par.SystemOfSystems);
				let sources = (await sourcesRequest).Sources;
				
				for(let name in sources) {
					await this.ascend('AddBroker', {
						Host: sources[name].Host,
						Port: sources[name].Port,
						Name: name
					});
				}

			} catch(e) {
				this.Par.modules.append($(`<pre>${e.toString()}</pre>`))
			}
			
			com = await this.asuper(com);
			fun(null, com);
		}

		async RemoveBroker(com, fun) {

			let name = com.Name;
			
			if(!(name in this.Par.Brokers))
				return fun(new Error('ERR_BROKER_NOT_FOUND'), com);

			let host = this.Par.Brokers[name].Host;
			let port = this.Par.Brokers[name].Port;
			let moduleCachePid = this.Par.Brokers[name].Pid;

			this.ascend('Delete', {}, moduleCachePid);

			this.Par.Brokers[name] = undefined;

			let deleteElems = this.Vlt.div.find(`*[modulecache=${moduleCachePid}]`);
			deleteElems.remove();

			// add this action to the action stack for undoability
			// so long as this action didnt come from the action stack
			// for the purpose of undoing.
			if(!com.SkipHistory) {
				this.ascend('AddAction', {
					Undo: {
						Cmd: 'RemoveBroker',
						Name: name
					},
					Redo: com,
					To: this.Par.Pid,
					Description: `Add Broker ${host}:${port}`
				}, this.Par.ActionStack);
			}


			fun(null, com);
		}

		async AddBroker(com, fun) {

			let host = com.Host;
			let port = com.Port;
			let name = com.Name;
			
			//Create the broker cache
			let moduleCache = await this.genModuleAsync({
				Module: 'ModuleCache',
				Par: {
					Host: host,
					Port: port
				}
			});

			// keep a reference to all the broker caches we have.
			this.Par.Brokers[name] = ({
				Name: name,
				Host: host,
				Port: port,
				Pid: moduleCache
			});

			// render the root for this broker
			let brokerRootElems = await this.partial('broker', {
				host, port, name, moduleCache
			});
			this.Par.$.modules.append(brokerRootElems);

			// add this action to the action stack for undoability
			// so long as this action didnt come from the action stack
			// for the purpose of undoing.
			if(!com.SkipHistory) {
				this.ascend('AddAction', {
					Undo: {
						Cmd: 'RemoveBroker',
						Name: name
					},
					Redo: com,
					To: this.Par.Pid,
					Description: `Add Broker ${host}:${port}`
				}, this.Par.ActionStack);
			}

			// at this point, were done with the command, but
			// well keep this thread going for a minute so we can try to
			// populate the broker
			fun(null, com);


			//populate modules list
			// get modules from the cache (will trigger its first query)
			let modules = this.ascend('GetModules', {}, moduleCache);
			try{
				modules = await modules;
			}catch([err, cmd]) {
				modules = {Modules: []};
				log.w(err);
				log.w('loading empty array of modules instead');
			}
			modules = modules.Modules;
			for(let module of modules) {
				let moduleName = module.name;
				let moduleVersion = module.version;
				let elems = await this.partial('moduleListing', {
					moduleName: moduleName,
					moduleCache
				});
				this.Par.$.modules.append(elems);
				// let files = (await this.ascend('GetFiles', {Module: moduleName}, this.Par.Broker)).Files
				// for(let filename of files) {
				// 	let fileItem = await this.partial('file', {fileName: filename, module: moduleName});
				// 	elems.find('.fileList').append(fileItem);
				// }
			}


		}

		async AddBrokerPrompt(com, fun) {
			let host = prompt('Enter Host (ex, modulebroker.xgraphdev.com)', 'modulebroker.xgraphdev.com');
			let port = prompt('Enter Port (ex, 27000)', '27000');
			let name = prompt('Enter a name for the Broker (ex, Core)', 'Core');

			this.ascend('AddBroker', {
				Host: host,
				Port: port,
				Name: name
			});

			fun(null, com);
		}

		async SelectModule(com, fun) {
			let li = $(com.Element);
			let moduleName = li.attr('moduleType');
			let moduleCache = li.attr('moduleCache');
			let files = [];

			try {
				let filesRequest = this.ascend('GetFiles', {
					Module: moduleName
				}, moduleCache);
				files = (await filesRequest).Files;
			} catch([err, cmd]) {
				log.w(err);
				return fun(err, com);
			}

			// this listing should be recursive when we need it, but whatever.
			for(let file in files) {
				let fileElems = await this.partial('file', {
					moduleCache,
					moduleName,
					file,
					depth: 2
				});
				fileElems.insertAfter(li);
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