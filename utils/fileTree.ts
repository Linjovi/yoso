"use strict";

import * as FS from "fs";
import * as PATH from "path";

const yosoPath = `${process.env.HOME}/.yoso`;

/**
 * 返回路径下的所有文件
 * @returns {string[]|null}
 */
function safeReadDirSync(path: string): string[] | null {
  let dirData = [];
  try {
    dirData = FS.readdirSync(path);
  } catch (ex) {
    if (ex.code == "EACCES")
      //User does not have permissions, ignore directory
      return null;
    else throw ex;
  }
  return dirData;
}

/**
 * 返回值中的url为与root/yoso/tpl的相对路径
 * @param  {String} path
 * @return {Object}
 */
export function directoryTree(path: string, res: any) {
  const item: { path: string; url?: string } = { path };
  let stats;
  
  try {
    stats = FS.statSync(path);
  } catch (e) {
    return null;
  }

  if (stats.isFile()) {
    // Skip if it does not match the extension regex
    res.add({ url: PATH.relative(PATH.join(yosoPath, "tpl"), path) });

  } else if (stats.isDirectory()) {

    let dirData: string[] | null = safeReadDirSync(path);
    if (dirData === null) return null;
    dirData
      .map((child: string) => directoryTree(PATH.join(path, child), res))
      .filter((e: any) => !!e);

  } else {
    return null; // Or set item.size = 0 for devices, FIFO and sockets ?
  }
  return item;
}
