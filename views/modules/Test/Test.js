//# sourceURL=Test
(function Test() {
	class Test {
		async Start(com, fun) {
			com = await this.asuper(com);
			
			this.Par.Connected = false;
			this.ascend('ConnectSystem');

			fun(null, com);
		}
		// TODO: do this with a setTimeout and not a
		// setInterval, because overlap bugs
		async ConnectSystem(com, fun) {
			let keepAlive = _ => {
				let loop = async _ => {
					try {
						await this.ascend('Ping', {}, this.Par.System);
						// Materialize.toast({html: 'hey'});
						// alert('okie');
						setTimeout(loop, 1000);
					} catch(e) {
						//lol rip
						debugger;
						this.Par.Connected = false;
						this.Par.$.root.attr('running', null);
					}
				};
				setTimeout(loop, 1000);
			};

			let retryLoop = setInterval(async _ => {
				// ping out to connected system(s)
				// TODO asdf
				try{
					await this.ascend('Ping', {}, this.Par.System);
					let details = await this.ascend('GetDetails', {}, this.Par.System);
					this.Par.Name = details.Name;
					this.Par.$.ConnectedSystem.html(this.Par.Name);
					this.Par.Connected = true;
					this.Par.$.root.attr('loading', null);
					this.Par.$.root.attr('running', '');
					clearInterval(retryLoop);
					fun(null, com);
					keepAlive();
				} catch(e) {}
			}, 1000);

		}

		async DarkMode(com, fun) {
			this.Par.$.root.attr('dark', com.Checked ? '' : null);
			fun(null, com);
		}

		async RunSystem(com, fun) {
			this.Par.$.root.attr('running', '');
			fun(null, com);
		}
		
		async StopSystem(com, fun) {
			this.Par.$.root.attr('running', null);
			fun(null, com);
		}

		async RestartSystem(com, fun) {
			this.ascend('RestartSystem', {}, this.Par.System);
			fun(null, com);
		}
	}

	return Viewify(Test, "4.0");
})();