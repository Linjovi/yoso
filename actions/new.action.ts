import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import { Tplrc } from "./action.input";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { checkDirExist, isRewrite } from "../utils/utils";
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

    checkDirExist(currentPath + "/" + data.path);
    //read json
    var tplrcPath = localPathFirst(
      path.join("stencil", "tplrc", data.model + ".tplrc")
    );
    // read tplrc
    var tplrc = JSON.parse(fs.readFileSync(tplrcPath).toString());
    //if fileType is dir
    if (tplrc.fileType === 1) {
      isRewrite(inputs.path, function() {
        checkDirExist(currentPath + "/" + data.fullPath);
        data.path = data.fullPath;
        tplrc.children.forEach(generateFileWithTplrc);
      });
    }else{
      tplrc.children.forEach(generateFileWithTplrc);
    }
    
  }
}

const generateFileWithTplrc = (tplrc: Tplrc) => {
  const suffix = tplrc.type;
  const name = tplrc.name ? tplrc.name : data.name;
  tplrc.tpl = tplrc.tpl || tplrc.type;

  // read tpl
  var tplPath = localPathFirst(path.join("stencil", "tpl", tplrc.tpl + ".tpl"));
  var tpl = fs.readFileSync(tplPath).toString();

  // tpl compile
  var compiledData = nunjucks.renderString(tpl, data);

  // write file
  fs.writeFileSync(
    currentPath + "/" + data.path + "/" + name + "." + suffix,
    compiledData
  );
};

const localPathFirst = (relativePath: string) => {
  const localPath = path.join(currentPath, relativePath);
  const libPath = path.join(filePath, relativePath);
  return fs.existsSync(localPath) ? localPath : libPath;
};
