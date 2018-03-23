//# sourceURL=RepositoryAdapter
(function Adapter() {
	class Adapter {
		Setup(com, fun) {
			this.Vlt.fs = this.require('fs');
			this.Vlt.path = this.require('path');
			this.dispatch({Cmd: "UpdateCache"}, _ => {
				fun(null, com);
			});
		}

		GetModules() {

		}

		UpdateCache(com, fun) {
			let {fs, path} = this.Vlt;
			let modules = this.Vlt.cache = {};
			if(!('BrokerPath' in this.Par)) {
				log.w("BrokerPath not present in Repository Adapter");
				return fun(null, com);
			}
			for(let moduleFolder of fs.readdirSync(this.Par.BrokerPath)) {
				let module = modules[moduleFolder] = {};
				let modulePath = path.join(this.Par.BrokerPath, moduleFolder);
				for(let file of fs.readdirSync(modulePath)) {
					let filepath = path.join(modulePath, file);
					module[file] = fs.readFileSync(filepath).toString();
				}
			}

			// log.d(JSON.stringify(this.Vlt.cache, null, 2));
			fun(null, com);
		}

		GetModules(com, fun) {
			com.Module = Object.keys(this.Vlt.cache);
			fun(null, com);
		}

		GetFiles(com, fun) {
			let module = this.Vlt.cache[com.Module];
			com.Files = Object.keys(module);
			fun(null, com);
		}

		GetFile(com, fun) {
			let module = this.Vlt.cache[com.Module];
			com.File = module[com.Filepath];
			fun(null, com);
		}

		UpdateFile(com, fun) {
			let module = this.Vlt.cache[com.Module];
			module[com.Filepath] = com.File || com.Contents;
			fun(null, com);
		}
	}

	return {dispatch: Adapter.prototype};
})();