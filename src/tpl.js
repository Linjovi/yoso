#!/usr/bin/env node

var fs = require("fs");
var nunjucks = require("nunjucks");
var argv = process.argv;
var filePath = __dirname;
var currentPath = process.cwd();
// console.log(filePath)
var utils = require("./utils");
// cli parse
argv.shift();
argv.shift();
// console.log(argv)
var path = argv[2];
var dirPathList = path.split("/");
var name = dirPathList[dirPathList.length - 1];
dirPathList.pop();
var dirPath = dirPathList.join("/");

var data = {
  method: argv[0],
  model: argv[1],
  fullPath: argv[2],
  name: name,
  path: dirPath
};

switch (data.method) {
  case "create":
    utils.checkDirExist(currentPath + "/" + data.path);
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
      utils.checkDirExist(currentPath + "/" + data.fullPath);
      data.path = data.fullPath;
    }

    tplrc.children.forEach(item => {
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

    break;
  default:
    return;
}
