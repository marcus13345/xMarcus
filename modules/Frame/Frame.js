//# sourceURL=Frame
(function Frame() {
	class Frame {
		async Start(com, fun) {
			com = await this.asuper(com);
			
			this.ascend('DarkMode', {Checked: true});

			this.Par.Connected = false;
			this.ascend('PingLoop');

			fun(null, com);
		}
		// TODO: do this with a setTimeout and not a
		// setInterval, because overlap bugs
		async PingLoop(com, fun) {
			let loop = async _ => {
				try {
					await this.ascend('Ping', {}, this.Par.System);
					if(!this.Par.Connected) {
						this.Par.Connected = true;
						await this.ascend('Connected');
					}
				} catch(e) {
					//lol rip
					if(this.Par.Connected) {
						this.Par.Connected = false;
						await this.ascend('Disconnected')
					}
				}
				setTimeout(loop, 1000);
			};
			setTimeout(loop, 1000);
			fun(null, com);
		}

		async Disconnected(com, fun) {
			this.Par.$.root.attr('running', null);
			this.Par.$.root.attr('loading', null);
			fun(null, com);
		}

		async Connected(com, fun) {
			let details = await this.ascend('GetDetails', {}, this.Par.System);
			this.Par.$.root.attr('loading', null);
			this.Par.$.root.attr('running', '');
			this.Par.Name = details.Name;
			this.Par.$.ConnectedSystem.html(this.Par.Name);
			fun(null, com);
		}

		async DarkMode(com, fun) {
			let val = com.Checked ? '' : null;
			this.Par.$.root.attr('dark', val);
			$(document.body).attr('dark', val);
			fun(null, com);
		}

		async RunSystem(com, fun) {
			this.Par.$.root.attr('running', '');
			this.Par.$.root.attr('loading', '');
			this.Par.$.ConnectedSystem.html('Awaiting connection...');
			fun(null, com);
		}
		
		async StopSystem(com, fun) {
			this.ascend("StopSystem", {}, this.Par.System);
			fun(null, com);
		}

		async RestartSystem(com, fun) {
			this.ascend('RestartSystem', {}, this.Par.System);
			fun(null, com);
		}

		async Undo(com, fun) {
			this.send(com, this.Par.ActionStack, fun)
		}

		async Redo(com, fun) {
			this.send(com, this.Par.ActionStack, fun)
		}
	}

	return Viewify(Frame, "4.0");
})();