//# sourceURL=WebSocketServerProxy.js
(function WebSocketServerProxy() {
	class WebSocketServerProxy {

		Setup(com, fun) {
			let WebSocket = this.require('ws');
			let server = this.Vlt.server = WebSocket.Server({
				port: 52310
			});
			
			server.on('connection', socket => {
				log.i()
				socket.on('message', data => {
					log.d('message');
					log.d(data);
				});

				socket.on('disconnect', (a, b, c) => {
					console.dir(a, b, c);
				});
			});
			
		}

	}

	return { dispatch: WebSocketServerProxy.prototype };
})();