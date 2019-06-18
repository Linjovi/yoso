import * as path from "path"
import * as fs from "fs"

export function checkDirExist(folderpath:string){
  const pathArr = folderpath.split("/");
  let _path = "";
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i]) {
      _path += `/${pathArr[i]}`;
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
      }
    }
  }
}