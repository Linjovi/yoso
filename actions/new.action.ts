import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import { Tplrc } from "./action.input";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { checkDirExist } from "../utils/utils";
var filePath = path.dirname(__dirname);
var currentPath = process.cwd();

export class NewAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    var name = path.basename(inputs.path);
    var dirPath = path.dirname(inputs.path);

    var data = {
      model: inputs.tpl,
      fullPath: inputs.path,
      name: name,
      path: dirPath
    };

    checkDirExist(currentPath + "/" + data.path);
    //read json
    var tplrcPath = currentPath + "/stencil/tplconfig/" + data.model + ".tplrc";
    //if currentTplrc exists
    tplrcPath = fs.existsSync(tplrcPath)
      ? tplrcPath
      : filePath + "/stencil/tplconfig/" + data.model + ".tplrc";
    // read tplrc
    var tplrc = JSON.parse(fs.readFileSync(tplrcPath).toString());
    //if fileType is dir
    if (tplrc.fileType === 1) {
      checkDirExist(currentPath + "/" + data.fullPath);
      data.path = data.fullPath;
    }

    tplrc.children.forEach((item: Tplrc) => {
      const suffix = item.type;
      const name = item.name ? item.name : data.name;
      item.tpl = item.tpl || item.type;

      // read tpl
      var tplPath = currentPath + "/stencil/tpl/" + item.tpl + ".tpl";
      tplPath = fs.existsSync(tplPath)
        ? tplPath
        : filePath + "/stencil/tpl/" + item.tpl + ".tpl";
      var tpl = fs.readFileSync(tplPath).toString();

      // tpl compile
      var compiledData = nunjucks.renderString(tpl, data);

      // write file
      fs.writeFileSync(
        currentPath + "/" + data.path + "/" + name + "." + suffix,
        compiledData
      );
    });
  }
}
