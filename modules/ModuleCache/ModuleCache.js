//# sourceURL=ModuleCache.js
(function ModuleCache() {
	class ModuleCache {
		Setup(com, fun) {

			if('Broker' in this.Par)
				return fun(null, com);

			this.genModule({
				Module: "WebSocketClientProxy",
				Par: {
					Host: this.Par.Host,
					Port: this.Par.Port
				}
			}, (err, apx) => {
				if(err) return fun(err, com);

				this.Par.Broker = apx;
				fun(null, com);
			});
		}

		Start(com, fun) {

			fun(null, com);
		}

		Delete(com, fun) {
			fun(null, com);
			// TODO make this actually delete
		}

		GetModules(com, fun) {
			this.send({
				Cmd: 'Query',
				Filters: {}
			}, this.Par.Broker, (err, cmd) => {
				if(err) {
					return fun(err, com);
				} else {
					com.Modules = [];
					for(let module of cmd.Info) {
						com.Modules.push({
							name: module.name,
							version: module.version
						});
					}
					fun(null, com);
				}
			});
		}

		GetFiles(com, fun) {
			com.Files = {
				"schema.json": true
			};
			fun(null, com);
		}
	}
	return {dispatch:ModuleCache.prototype}
})();