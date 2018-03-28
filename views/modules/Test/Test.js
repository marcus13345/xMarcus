//# sourceURL=Test
(function Test() {
	class Test {
		async Start(com, fun) {
			com = await this.asuper(com);
		}

		async DarkMode(com, fun) {
			this.Par.$.root.attr('dark', com.Checked ? '' : null);
			fun(null, com);
		}

		async RunSystem(com, fun) {
			this.Par.$.root.attr('running', '');
			fun(null, com);
		}
		
		async StopSystem(com, fun) {
			this.Par.$.root.attr('running', null)
			fun(null, com);
		}
	}

	return Viewify(Test, "4.0");
})();