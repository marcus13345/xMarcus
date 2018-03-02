class Volatile {
	constructor(obj) {
		this.obj = obj;
	}
	lock(actionFunction) {
		return new Promise(unlock => {
			let inst = this;
			if (this.queue instanceof Promise) {
				this.queue = this.queue.then(async function () {
					let ret = actionFunction(inst.obj);
					if (ret instanceof Promise) ret = await ret;
					inst.obj = ret;
					unlock();
				});
			} else {
				this.queue = new Promise(async (resolve) => {
					let ret = actionFunction(this.obj);
					if (ret instanceof Promise) ret = await ret;
					this.obj = ret;
					unlock();
					resolve();
				});
			}
		});
	}
	toString() {
		return this.obj.toString() || "no toString defined";
	}
}

(async () => {
	let string = new Volatile();
	
	await string.lock(async (val) => {
		console.log(1);
		await new Promise(res => setTimeout(_ => res(), 1000));
		return "";
	});
	console.log('1 -> 2');
	await string.lock(async (val) => {
		console.log(2);
		await new Promise(res => setTimeout(_ => res(), 1000));
		return "";
	});
	console.log('2 -> 3');

	await string.lock(async (val) => {
		console.log(3);
		await new Promise(res => setTimeout(_ => res(), 1000));
		return "";
	});
	console.log('3 -> 4');

	await string.lock(async (val) => {
		console.log(4);
		await new Promise(res => setTimeout(_ => res(), 1000));
		return "";
	});
})();