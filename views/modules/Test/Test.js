(function Test() {
	class Test {
		Submit(com, fun) {
			alert(`you said ${this.Vlt.input.val()}`)
		}
		Render(com, fun) {
			this.Vlt.div.append($('RENDAAAAAA'));
		}
	}

	return Viewify(Test, "4.0");
})()