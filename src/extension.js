"use strict";

const vscode = require('vscode')
const mathPreview = require('./math-preview')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// TODO: active log. Delete this.
	console.log('Congratulations, your extension "mathkey" is now active!');

	mathPreview.activate(context);      // toggle math preview

	// TODO: Add settings for this extension.
}


function deactivate(){};

module.exports = {
	activate,
	deactivate,
}
