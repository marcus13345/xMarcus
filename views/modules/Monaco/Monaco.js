//# sourceURL=Ace

(function Monaco() {
	class Monaco {
		async DOMLoaded(com, fun) {




			// await this.cdnImportJs('https://unpkg.com/monaco-editor@0.8.3/min/vs/loader.js');
			// require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.8.3/min/vs' }});
			// window.MonacoEnvironment = { getWorkerUrl: () => proxy };

			// let proxy = URL.createObjectURL(new Blob([`
			// 	self.MonacoEnvironment = {
			// 		baseUrl: 'https://unpkg.com/monaco-editor@0.8.3/min/'
			// 	};
			// 	importScripts('https://unpkg.com/monaco-editor@0.8.3/min/vs/base/worker/workerMain.js');
			// `], { type: 'text/javascript' }));
			// let that = this;
			// require(["vs/editor/editor.main"], function () {
			// 	let editor = monaco.editor.create(that.Par.$.container[0], {
			// 		value: [
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}',
			// 			'function x() {',
			// 			'\tconsole.log("Hello world!");',
			// 			'}'
			// 		].join('\n'),
			// 		language: 'javascript',
			// 		theme: 'vs-dark'
			// 	});
				
			// 	editor.addListener('didType', () => {
			// 		console.log(editor.getValue());
			// 	});
			// });




		}
	}

	return Viewify(Monaco, '4.0');
})();