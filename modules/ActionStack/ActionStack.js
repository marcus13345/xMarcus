//# sourceURL=ActionStack.js
(function ActionStack() {
	class ActionStack {
		AddAction(com, fun) {
			let actionObject = {
				undo: Object.assign({SkipHistory: true}, com.Undo),
				redo: Object.assign({SkipHistory: true}, com.Redo),
				to: com.To,
				description: com.Description
			}

			// reset the redo stack, then push to undo stack 
			// and clamp length to 100
			this.Par.ForwardStack = [];
			this.Par.BackStack.push(actionObject);
			if(this.Par.BackStack.length > this.Par.MaxHeight)
				this.Par.BackStack.shift();



			fun(null, com);
		}

		Undo(com, fun) {
			if(this.Par.BackStack.length === 0)
				return fun(new Error('ERR_NOTHING_TO_UNDO'), com);

			// get the action to perform, to do an undo
			let actionObj = this.Par.BackStack.pop();

			this.send(actionObj.undo, actionObj.to, (err, cmd) => {
				if(err) {
					log.w('undo failed');
					log.w(err);
					this.Par.BackStack.push(actionObj);
					
					return fun(null, com);
				}
				this.Par.ForwardStack.push(actionObj);
				fun(null, com);
			});

		}

		Redo(com, fun) {
			if(this.Par.ForwardStack.length === 0)
				return fun(new Error('ERR_NOTHING_TO_REDO'), com);

			// get the action to perform, to do an undo
			let actionObj = this.Par.ForwardStack.pop();

			this.send(actionObj.redo, actionObj.to, (err, cmd) => {
				if(err) {
					log.w('undo failed');
					log.w(err);
					this.Par.ForwardStack.push(actionObj);
					return fun(null, com);
				}
				this.Par.BackStack.push(actionObj);
				fun(null, com);
			});
		}
	}

	return {dispatch: ActionStack.prototype}
})();