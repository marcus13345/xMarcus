//# sourceURL=Monaco
(function Monaco() {
	class Monaco {
		async Start(com, fun) {
			com = await this.asuper(com);
			var targetNode = document.body;
			var config = { attributes: true };
			//for theme changes
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

		async DOMLoaded(com, fun) {
			com = await this.asuper(com);

			if('Contents' in this.Par) {
				this.Par.$.Monaco.attr('value', this.Par.Contents);
			}
			fun(null, com);
		}
	}

	return Viewify(Monaco, '4.0');
})();