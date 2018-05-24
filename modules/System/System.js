(function System() {
	class System {

		Ping(com, fun) {
			fun(null, com);
		}

		GetDetails(com, fun) {
			com.Name = this.Par.Name;
			fun(null, com);
		}

		RestartSystem(com, fun) {
			fun(null, com);
			this.exit(72);
		}

		StopSystem(com, fun) {
			fun(null, com);
			process.exit(com.Code || com.ExitCode || 0);
		}

	}

	return {dispatch: System.prototype};
})();