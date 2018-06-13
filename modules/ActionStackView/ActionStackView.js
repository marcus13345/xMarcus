(function ActionStackView() {
	class ActionStackView {
		Start(com, fun) {
			await this.asuper(com)

			fun(null, com);
		}
	}

	return Viewify(ActionStackView, '4.0');
})();