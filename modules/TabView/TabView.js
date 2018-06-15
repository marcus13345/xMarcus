//# sourceURL=TabView
(function TabView() {
	class TabView{
		async Start(com, fun) {
			
			com = await this.asuper(com);
			let that = this;

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

			function addTab(title) {
				let tid = Math.floor(Math.random() * 1000000);
				that.Vlt.div.find('[tabs]').append($(`
					<div tab tid="${tid}">
						<span title>${title}</span>
						<span close>×</span>
					</div>
				`));
				
				that.Vlt.div.find('[content]').append($(`
					<div viewport tid="${tid}">
						<h3>${title}</h3>
					</div>
				`));
				selectTid(tid);
				that.Vlt.div.find('[tab]').click(tabClick);
			}

			addTab('Tab 1');
			addTab('Tab 2');
			addTab('Tab 3');

			// $('[tab] > [close]');

			fun(null, com);
		}
	}

	return Viewify(TabView, '4.0');
})();