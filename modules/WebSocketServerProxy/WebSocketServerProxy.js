//# sourceURL=WebSocketServerProxy.js
(function WebSocketServerProxy() {
	class WebSocketServerProxy {

		Stop(com, fun) {
			
		}

		Setup(com, fun) {
			let STX = this.Vlt.STX = '\x02';
			let ETX = this.Vlt.ETX = '\x03';
			let WebSocket = this.require('ws');
			let server = this.Vlt.server = WebSocket.Server({
				port: this.Par.Port || 28000
			});

			let send = (buffer, socket) => {
				return new Promise((resolve, reject) => {
					let q = JSON.parse(buffer);
					let msgPid = q.Passport.Pid.substr(0);
					log.d(`<< ${q.Cmd}::${msgPid}`)
					delete q.Passport;
					this.send(q, this.Par.Link, (err, cmd) => {
						if(err && typeof err === 'object') {
							err = err.message;
						}
						cmd.Passport.Pid = msgPid;
						let errcom = `[${JSON.stringify(err)}, ${JSON.stringify(cmd)}]`
						let reponse = `${this.Vlt.STX}${errcom}${this.Vlt.ETX}`
						
						log.d(`>> ${cmd.Cmd}::${cmd.Passport.Pid}`)
						socket.send(reponse);
					})
				});
			}
			
			server.on('connection', socket => {
				log.i('WebSocket Proxy Connection Established');
				let buffer = "";
				socket.on('message', async (data) => {
					let parts = data.split(/([\x02\x03])/g);
					for(let part of parts) {
						if(part === this.Vlt.STX) {
							buffer = "";
						} else if (part === this.Vlt.ETX) {
							send(buffer, socket);
						} else {
							buffer += part;
						}
					}
				});

				socket.on('disconnect', (a, b, c) => {
					console.dir(a, b, c);
				});
			});

			fun(null, com);
			
		}

	}

	return { dispatch: WebSocketServerProxy.prototype };
})();