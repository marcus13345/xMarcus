//# sourceURL=Test
(function Test() {
	class Test {
		async Start(com, fun) {
			com = await this.asuper(com);
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
})()