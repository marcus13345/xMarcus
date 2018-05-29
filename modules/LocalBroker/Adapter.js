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
					try{
						let filepath = path.join(modulePath, file);
						module[file] = fs.readFileSync(filepath).toString();
					} catch (e) {
						log.w(e);
					}
				}
			}

			// log.d(JSON.stringify(this.Vlt.cache, null, 2));
			fun(null, com);
		}

		GetModules(com, fun) {
			com.Modules = Object.keys(this.Vlt.cache);
			fun(null, com);
		}

		GetFiles(com, fun) {
			let module = this.Vlt.cache[com.Module];
			com.Files = Object.keys(module);
			fun(null, com);
		}

		GetFileContents(com, fun) {
			let module = this.Vlt.cache[com.Module];
			com.File = module[com.Filepath];
			fun(null, com);
		}

		UpdateFile(com, fun) {
			let module = this.Vlt.cache[com.DocumentId.Module];
			module[com.DocumentId.Filepath] = com.File || com.Contents;
			let {fs, path} = this.Vlt;
			fs.writeFileSync(path.join(this.Par.BrokerPath, com.DocumentId.Module, com.DocumentId.Filepath), module[com.DocumentId.Filepath]);
			fun(null, com);
		}
	}

	return {dispatch: Adapter.prototype};
})();