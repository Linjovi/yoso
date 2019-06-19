import * as path from "path";
import * as fs from "fs";

export function checkDirExist(folderpath: string) {
  const pathArr = folderpath.split(path.sep);
  let _path = "";
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i]) {
      _path += path.sep + pathArr[i];
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
      }
    }
  }
}
