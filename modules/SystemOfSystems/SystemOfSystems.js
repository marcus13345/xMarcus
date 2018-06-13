(function SystemOfSystems() {
	class SystemOfSystems {
		Start(com, fun) {
			this.Par.Sources = this.Par.Sources || []
			fun(null, com);
		}

		GetSources(com, fun) {
			com.Sources = this.Par.Sources;
			fun(null, com);
		}

		AddSource(com, fun) {
			
		}
	}

	return {dispatch: SystemOfSystems.prototype};
})();