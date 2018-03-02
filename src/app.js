const electron = require('electron');
const {BrowserWindow, app} = electron;
const path = require('path');

let mainWindow;

app.on('ready', _ => {
	 mainWindow = new BrowserWindow({
		title: 'xFiddle',
		show: false
	});
	
	mainWindow.loadURL(``);
	
	mainWindow.on('ready-to-show', _ => {
		mainWindow.show();
		mainWindow.toggleDevTools();
	})
})
