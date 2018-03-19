(function Test() {
	class Test {
		async Start(com, fun) {
			com = await this.asuper(com);
		}
	}

	return Viewify(Test, "4.0");
})()