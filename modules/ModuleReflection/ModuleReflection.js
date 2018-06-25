
class ModuleReflection {
	Setup(com, fun) {
		if (!("Image" in this.Par)) {
			this.Par.Image = {};
		}
		if ("SystemPid" in this.Par)
			this.Par.Image.SystemPid = this.Par.SystemPid;
		if ("ModuleType" in this.Par)
			this.Par.Image.ModuleType = this.Par.ModuleType;
		if ("Source" in this.Par)
			this.Par.Image.Source = this.Par.Source;
		this.save(_ => {
			fun(null, com);
		});
	}

	GetPar(com, fun) {
		if ("Key" in com) {
			if (typeof com.Key == "string") {
				com.Value = this.Par.Image.Par[com.Key] || null;
			} else if (Array.isArray(com.Key)) {
				com.Par = {};
				for (let par of com.Key) {
					com.Par[par] = this.Par.Image.Par[par] || null;
				}
			}
		} else {
			com.Par = this.Par.Image.Par;
		}
		fun(null, com);
	}

	SetPar(com, fun) {
		if (("Par" in com) && (typeof com.Par == "object")) {
			for (let par in com.Par) {
				this.Par.Image.Par[par] = com.Par[par];
			}
		}

		//Par pair {com.Key, com.Value} takes precedence over data in com.Par
		if (("Key" in com) && (typeof com.Key == "string")) {
			if (!("Value" in com) || (typeof com.Value == "undefined")) {
				delete this.Par.Image.Par[com.Key];
			} else
				this.Par.Image.Par[com.Key] = com.Value;
		}

		this.save(_ => {
			fun(null, com);
		});
	}

	GetSource(com, fun) {
		com.Source = this.Par.Image.Source;
		fun(null, com);
	}

	SetSource(com, fun) {
		if (typeof com.Source != "string") {
			fun(`Source ${com.Source} of type ${typeof com.Source} must be type string`, com);
			return;
		}
		this.Par.Image.Source = com.Source;

		this.save(_ => {
			fun(null, com);
		});
	}

	GetSystemPid(com, fun) {
		com.Pid = this.Par.Image.SystemPid;
		fun(null, com);
	}

	SetSystemPid(com, fun) {
		if (typeof com.Pid != "string" || (com.Pid.length != 32)) {
			fun(`Pid ${com.Pid} of type ${typeof com.Pid}, length ${com.Pid.length} must be a 32 character hexidecimal string`, com);
			return;
		}
		this.Par.Image.SystemPid = com.Pid;
		this.save(_ => {
			fun(null, com);
		});
	}

	GetModuleType(com, fun) {
		com.ModuleType = this.Par.Image.ModuleType;
		fun(null, com);
	}

	SetModuleType(com, fun) {
		if (typeof com.ModuleType != "string") {
			fun(`ModuleType ${com.ModuleType} of type ${typeof com.ModuleType} must be of type string`, com);
			return;
		}
		this.Par.Image.ModuleType = com.ModuleType;
		this.save(_ => {
			fun(null, com);
		});
	}
}
