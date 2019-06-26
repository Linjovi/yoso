import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as path from "path";
import {
  checkDirExist,
  isRewrite,
  rename,
  generateFileFromTpl
} from "../utils/utils";
import { directoryTree } from "../utils/fileTree";

var filePath = path.dirname(__dirname); //tpl-stencil根目录
var currentPath = process.cwd(); //当前目录

var data: any;

export class NewAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    var name = path.basename(inputs.path);

    data = {
      model: inputs.tpl,
      fullPath: inputs.path
    };
    
    let options = {
      name
    }
    let res = loadLocalTpl(data.model, data.fullPath);
    if(!res){
      return;
    }

    isRewrite(data.fullPath, function() {
      
      res.forEach((item: any) => {
        checkDirExist(path.dirname(item.path));
        var tpl = fs
          .readFileSync(path.join(filePath, "stencil", "tpl", item.url))
          .toString();
        generateFileFromTpl(tpl, options, item.path);
      });
    });
  }
}

function loadLocalTpl(tplPath: string, toPath: string) {
  let res: any = new Set();
  var Finder = require("fs-finder");
  let fileExists = Finder.in(path.join(filePath, "stencil", "tpl")).findFiles(
    tplPath
  ).length;
  let dirExists = fs.existsSync(path.join(filePath, "stencil", "tpl", tplPath));

  if (fileExists + dirExists > 1) {
    console.log("more than one");
    return;
  } else if (fileExists + dirExists < 1) {
    console.log("not found");
    return;
  } else {
    if (dirExists) {
      //文件夹

      directoryTree(path.join(filePath, "stencil", "tpl", tplPath), res);
    } else {
      //文件
      var item = Finder.in(path.join(filePath, "stencil", "tpl")).findFiles(
        tplPath
      )[0];
      var url = path.relative(path.join(filePath, "stencil", "tpl"), item);
      res = [{ url }];
    }

    res.forEach((element: any) => {
      element.path = rename(element.url, toPath);
    });
  }
  return res;
}
