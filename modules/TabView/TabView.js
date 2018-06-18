//# sourceURL=TabView
(function TabView() {
	class TabView{
		async AddTab(com, fun) {
			let viewport = await this.Vlt.addTab(com.Title);
			let root = (await this.ascend('GetViewRoot', {}, com.View)).Div;
			viewport.append(root)
			await this.ascend('Render', {}, com.View);
			await this.ascend('DOMLoaded', {}, com.View);
			fun(null, com);
		}
		async Start(com, fun) {
			
			com = await this.asuper(com);
			let that = this;
			this.Vlt.TabCount = 0;
			this.Vlt.div.find('[tabs]').bind('mousewheel DOMMouseScroll', function(event) {
				if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
					this.scrollLeft -= 30;
				} else {
					this.scrollLeft += 30;
				}
			});

			function selectTid(tid) {
				that.Vlt.div.find('[content] > [viewport][selected]').attr('selected', null);
				that.Vlt.div.find('[tabs] > [tab][selected]').attr('selected', null);
				that.Vlt.div.find(`[content] > [viewport][tid=${tid}]`).attr('selected', '');
				that.Vlt.div.find(`[tabs] > [tab][tid=${tid}]`).attr('selected', '');
			}

			function tabClick(event) {
				let e = $(this);
				let tid = e.attr('tid');
				selectTid(tid)
			}

			async function addTab(title) {
				let tid = Math.floor(Math.random() * 1000000);
				that.Vlt.div.find('[tabs]').append($(`
					<div tab tid="${tid}">
						<span title>${title}</span>
						<span close>×</span>
					</div>
				`));
				
				let viewport = await that.partial('viewport', {
					count: that.Vlt.TabCount,
					tid
				});

				that.Vlt.div.find('[content]').append(viewport);
				selectTid(tid);
				that.Vlt.div.find('[tab]').click(tabClick);

				return viewport;
			}

			this.Vlt.addTab = addTab;

			// $('[tab] > [close]');

			fun(null, com);
		}
	}

	return Viewify(TabView, '4.0');
})();