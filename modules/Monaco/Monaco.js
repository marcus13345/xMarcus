//# sourceURL=Monaco
(function Monaco() {
	class Monaco {
		Start(com, fun) {
			var targetNode = document.body;
			var config = { attributes: true };
			this.Vlt.observer = new MutationObserver((mutationsList) => {
				for(var mutation of mutationsList) {
					let attr = mutation.attributeName;
					let val = $(document.body).attr(attr);
					if(attr === 'dark') {
						let theme = val !== undefined ? 'vs-dark' : 'vs';
						this.Par.$.Monaco.attr('theme', theme);
					}
				}
			});
			this.Vlt.observer.observe(targetNode, config);
			fun(null, com);
		}

		Deconstruct() {
			this.Vlt.observer.disconnect();
		}
	}

	return Viewify(Monaco, '4.0');
})();