//# sourceURL=PreEditor
(function PreEditor() {
	class PreEditor {
		async Start(com, fun) {
			com = await this.asuper(com);

			$(document).keydown(function(event) {
				if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
				alert("Ctrl-S pressed");
				event.preventDefault();
				return false;
			});
			fun(null, com);
		}

		SetText(com, fun) {
			// this.Par.$.title.html(com.Filename);
			this.Par.DocumentId = com.DocumentId;
			this.Par.$.editor.html(com.Text || com.Value);
			fun(null, com);
		}

		async Save(com, fun) {
			let contents = this.Par.$.editor.html()
			await this.ascend('UpdateFile', {DocumentId: this.Par.DocumentId, Contents: contents}, this.Par.Broker);
		}
	}

	return Viewify(PreEditor, '4.0');
})();