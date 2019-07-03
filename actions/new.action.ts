import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as path from "path";
import { getGitInfo } from "../utils/info";
import {
  checkDirExist,
  isRewrite,
  rename,
  generateFileFromTpl,
  formatDate
} from "../utils/utils";
import { directoryTree } from "../utils/fileTree";
import { optionView } from "../ui/optionInput";


var filePath = path.dirname(__dirname); //yoso根目录
var currentPath = process.cwd(); //当前目录
const yosoPath = `${process.env.HOME}/.yoso`

var data: any;

export class NewAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    var name = path.basename(inputs.path);
    const gitInfo = getGitInfo();

    var options: { [k: string]: any } = { name ,date:formatDate(new Date()) };

    if (gitInfo.name) {
      options.author = gitInfo.name;
    }
    if (gitInfo.email) {
      options.email = gitInfo.email;
    }

    data = {
      model: inputs.tpl,
      fullPath: inputs.path
    };

    if (inputs.options.others) {
      optionView(options, (list: any) => {
        list.forEach((element:any) => {
          options[element.key] = element.value
        });
        console.log(options);
        newTpl(data, options);
      });
      return;
    }

    newTpl(data, options);
  }
}

function newTpl(data: any, options: any) {
  let res = loadLocalTpl(data.model, data.fullPath);
  if (!res) {
    return;
  }

  isRewrite(data.fullPath, function() {
    res.forEach((item: any) => {
      checkDirExist(path.dirname(item.path));
      var tpl = fs
        .readFileSync(path.join(yosoPath, "tpl", item.url))
        .toString();
      generateFileFromTpl(tpl, options, item.path);
    });
  });
}

function loadLocalTpl(tplPath: string, toPath: string) {
  let res: any = new Set();
  var Finder = require("fs-finder");
  let fileExists = Finder.in(path.join(yosoPath, "tpl")).findFiles(
    tplPath
  ).length;
  let dirExists = fs.existsSync(path.join(yosoPath, "tpl", tplPath));

  if (fileExists + dirExists > 1) {
    console.log("more than one");
    return;
  } else if (fileExists + dirExists < 1) {
    console.log("not found");
    return;
  } else {
    if (dirExists) {
      //文件夹

      directoryTree(path.join(yosoPath, "tpl", tplPath), res);
    } else {
      //文件
      var item = Finder.in(path.join(yosoPath, "tpl")).findFiles(
        tplPath
      )[0];
      var url = path.relative(path.join(yosoPath, "tpl"), item);
      res = [{ url }];
    }

    res.forEach((element: any) => {
      element.path = rename(element.url, toPath);
    });
    // console.log(res)
  }
  return res;
}
