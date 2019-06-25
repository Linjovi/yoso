'use strict';

import * as  FS from "fs";
import * as PATH from 'path';

function safeReadDirSync (path:string) {
	let dirData = {};
	try {
		dirData = FS.readdirSync(path);
	} catch(ex) {
		if (ex.code == "EACCES")
			//User does not have permissions, ignore directory
			return null;
		else throw ex;
	}
	return dirData;
}

/**
 * Collects the files and folders for a directory path into an Object, subject
 * to the options supplied, and invoking optional
 * @param  {String} path
 * @return {Object}
 */
export function directoryTree (path:string,res:any) {
	const item:any = { path };
	let stats;
	try { stats = FS.statSync(path); }
	catch (e) { return null; }

	if (stats.isFile()) {
    // Skip if it does not match the extension regex
    var filePath = PATH.dirname(__dirname); //tpl-stencil根目录
    res.push({url:PATH.relative(PATH.join(filePath,'stencil','tpl'),path)});
	}
	else if (stats.isDirectory()) {
		let dirData:any = safeReadDirSync(path);
		if (dirData === null) return null;

		dirData
			.map((child:any) => directoryTree(PATH.join(path, child),res))
			.filter((e:any) => !!e);
	} else {
		return null; // Or set item.size = 0 for devices, FIFO and sockets ?
	}
	return item;
}
