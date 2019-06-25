import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as path from "path";
import { checkDirExist, isRewrite, rename,generateFileFromTpl } from "../utils/utils";
import { directoryTree } from "../utils/fileTree";

var filePath = path.dirname(__dirname); //tpl-stencil根目录
var currentPath = process.cwd(); //当前目录
var rootPath = path.dirname(currentPath); //当前工程父级目录

var data: any;

export class NewAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    var name = path.basename(inputs.path);
    var dirPath = path.dirname(inputs.path);

    data = {
      model: inputs.tpl,
      fullPath: inputs.path,
      name: name,
      path: dirPath
    };
    let res:any = []
    var Finder = require("fs-finder");

    let fileExists = Finder.in(path.join(filePath, "stencil", "tpl")).findFiles(
      data.model
    ).length;
    let dirExists = fs.existsSync(
      path.join(filePath, "stencil", "tpl", data.model)
    );
    if (fileExists + dirExists > 1) {
      console.log("more than one");
      return;
    } else if (fileExists + dirExists < 1) {
      console.log("not found");
      return;
    } else {
      if (dirExists) {//文件夹

        directoryTree(path.join(filePath, "stencil", "tpl", data.model), res);
        res.forEach((element: any) => {
          element.path = rename(element.url, data.fullPath);
        });
      } else {//文件
        var item = Finder.in(path.join(filePath, "stencil", "tpl")).findFiles(
          data.model
        )[0]
        var url = path.relative(path.join(filePath,"stencil","tpl"),item)
        res = [{url,path:rename(url,data.fullPath)}]
      }
    }

    isRewrite(data.fullPath,function(){
      checkDirExist(currentPath + "/" + data.fullPath);
      res.forEach((item:any)=>{
        var tpl = fs.readFileSync(path.join(filePath,'stencil','tpl',item.url)).toString();
        generateFileFromTpl(tpl, data, item.path);
      })
    })

  }
}
