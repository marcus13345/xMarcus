//# sourceURL=WebSocketClientProxy.js
(function WebSocketClientProxy() {
	class WebSocketClientProxy {
		Setup(com, fun) {
			// Create WebSocket connection.
			let host = this.Par.Host || localhost
			let port = this.Par.Port || 28000
			let url =  `ws://${host}:${port}`
			let STX = this.Vlt.STX = '\x02'
			let ETX = this.Vlt.ETX = '\x03'
			this.Vlt.callbackTable = {};
			this.Vlt.connected = false

			let reconnect = () => {
				this.Vlt.socket = new WebSocket(url)
				log.v(`Websocket polling ${url}`)

					
				// Connection opened
				this.Vlt.socket.addEventListener('open', (event) => {
					this.Vlt.connected = true
					log.i(`WebSocket Proxy Connected ${url}`)
				})

				let buffer = "";
				this.Vlt.socket.addEventListener('message', (event) => {
					// debugger;
					log.i('Message from server ', event.data)
					let parts = event.data.split(/([\x02\x03])/g);
					for(let part of parts) {
						if(part === this.Vlt.STX) {
							buffer = ""
						} else if (part === this.Vlt.ETX) {
							let [err, cmd] = JSON.parse(buffer)
							let callback = this.Vlt.callbackTable[cmd.Passport.Pid]
							callback(err, cmd);
						} else {
							buffer += part
						}
					}
				})

				let hasClosed = false;
				let closed = _ => {
					if(hasClosed) return
					hasClosed = true
					log.i(`Websocket closed: ${url}`)
					this.Vlt.socket = null
					this.Vlt.connected = false
					this.Vlt.connectionLoop = setTimeout(reconnect, 0)
				}

				this.Vlt.socket.addEventListener('error', closed)

				this.Vlt.socket.addEventListener('close', closed)
			}
			reconnect();
			
			fun(null, com)
		}

		"*" (com, fun) {
			let STX = this.Vlt.STX
			let ETX = this.Vlt.ETX
			if(this.Vlt.connected) {
				let message = `${STX}${JSON.stringify(com)}${ETX}`
				this.Vlt.callbackTable[com.Passport.Pid] = fun
				this.Vlt.socket.send(message)
			} else {
				fun(new Error('ERR_DISCONNECTED'), com)
			}
		}

		Start(com, fun){
			fun(null, com)
		}
	}
	return {dispatch:WebSocketClientProxy.prototype}
})();