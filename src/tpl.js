#!/usr/bin/env node

var fs = require("fs");
var nunjucks = require("nunjucks");
var argv = process.argv;
var filePath = __dirname;
var currentPath = process.cwd();
console.log(filePath)
var utils = require("./utils")
// cli parse
argv.shift();
argv.shift();
// console.log(argv)

var data = {
  method: argv[0],
  model: argv[1],
  name: argv[2]
};

switch (data.method) {
  case "create":
    //read json
    var json = JSON.parse(
      fs.readFileSync(filePath + "/json/" + data.model + ".json").toString()
    );
    // var suffix = json.suffix;
    // console.log(suffix)
    json.forEach(item => {
      const suffix = item.suffix;
      //  // read tpl
      var tpl = fs.readFileSync(filePath + "/tpl/" + item.tpl + ".tpl").toString();
      // console.dir(data);
      // tpl compile
      var compiledData = nunjucks.renderString(tpl, data);
      // console.log(compiledData);
      // write file
      fs.writeFileSync(currentPath + "/" + data.name + "." + suffix, compiledData);
      // // utils.checkDirExist(data.path);
      // fs.mkdirSync(data.path)

    });

    break;
  default:
    return;
}
