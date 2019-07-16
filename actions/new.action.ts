import { NewCmd } from "../commands";
import { KV, Options } from "./action.input";
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

interface NewData {
  model: string;
  fullPath: string;
}
const yosoPath = `${process.env.HOME}/.yoso`;

var data: NewData;

export class NewAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    var name = path.basename(inputs.path);
    const gitInfo = getGitInfo();

    var options: Options = { name, date: formatDate(new Date()) };

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
      optionView(options, (list: KV[]) => {
        list.forEach((element: KV) => {
          options[element.key] = element.value;
        });
        console.log(options);
        newTpl(data, options);
      });
      return;
    }

    newTpl(data, options);
  }
}

function newTpl(data: NewData, options: Options) {
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
  let fileExists = Finder.in(path.join(yosoPath, "tpl")).findFiles(tplPath)
    .length;
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
      var item = Finder.in(path.join(yosoPath, "tpl")).findFiles(tplPath)[0];
      var url = path.relative(path.join(yosoPath, "tpl"), item);
      res = [{ url }];
    }

    res.forEach((element: { path: String; url: string }) => {
      element.path = rename(element.url, toPath);
    });
    // console.log(res)
  }
  return res;
}
