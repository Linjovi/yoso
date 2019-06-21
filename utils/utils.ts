import * as path from "path";
import * as fs from "fs";
import * as inquirer from "inquirer";
import { NewCmd } from "../commands";
import { generate } from "rxjs";
import * as nunjucks from "nunjucks";

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

/**
 * @param {String} dirname
 * @returns
 */
export function mkdirsSync(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
}

export async function isRewrite(path: string, callback: Function) {
  if (fs.existsSync(path)) {
    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "rewrite",
          message: `The path '${path}' is already exists, do you want to rewrite?`,
          default: false
        }
      ])
      .then((answers: any) => {
        if (answers.rewrite) {
          callback();
        }
      });
  } else {
    callback();
  }
}

export function generateFileFromTpl(tpl: string, data: any, exportUrl: string) {
  var compiledData = nunjucks.renderString(tpl, data);
  fs.writeFileSync(exportUrl, compiledData);
}
