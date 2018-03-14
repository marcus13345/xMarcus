class Preprocessor {
	constructor(entity) {
		this.view = entity;
		this.template = '';
		this._later = [];
	}
	finish() {
		for(let fun of this._later) {
			let ret = fun(); // because compatibility \/
			if(ret instanceof Promise) await ret;
		}
	}
	later(fun) {
		this._later.push(fun);
	}

	button(name, command) {
		let id;
		if(typeof name == 'object') {
			let options = name;
			for(let key in options) {
				switch(key) {
					case "id": id = name[key]; break;
					case "name": name = options[key]; break;
					case "command": command = options[key]; break;
				}
			}
		}
		let id = md5(performance.now());
		this.append(`<button id="${id}"><button>`);
		this.later(_ => {
			let button = this.view.Vlt.div.find(`#${id}`);
			button.on('click', _ => {
				this.view.dispatch({Cmd: command, Name: name, Id: id})
			});
		});
	}

	append(text) {
		this.template += `${text}\r\n`;
	}
}