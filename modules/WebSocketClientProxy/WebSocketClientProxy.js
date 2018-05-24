//# sourceURL=WebSocketClientProxy.js
(function WebSocketClientProxy() {
	class WebSocketClientProxy {
		Setup(com, fun) {
			// Create WebSocket connection.
			const socket = new WebSocket(`ws://${this.Par.Host}:${this.Par.Port}`);

			// Connection opened
			socket.addEventListener('open', function (event) {
				socket.send('Hello Server!');
			});

			// Listen for messages
			socket.addEventListener('message', function (event) {
				console.log('Message from server ', event.data);
			});
			fun(null, com);
		}

		"*" (com, fun) {
			log.v(com.Cmd);
			fun(null, com);
		}

		Start(com, fun){
			fun(null, com);
		}
	}
	return {dispatch:WebSocketClientProxy.prototype}
})();