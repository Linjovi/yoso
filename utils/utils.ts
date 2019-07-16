import * as path from "path";
import * as fs from "fs";
import * as inquirer from "inquirer";
import * as nunjucks from "nunjucks";

var currentPath = process.cwd(); //当前目录

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

export async function isRewrite(path: string|undefined, callback: Function) {
  if (path&&fs.existsSync(path)) {
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

export function rename(url: string, filePath: string) {
  let pathList = url.split("/");
  let nameList = pathList[0].split(".");
  nameList[0] = filePath;
  let name = nameList.join(".");
  pathList[0] = name;
  let realPath = pathList.join("/");
  return path.join(currentPath, realPath);
}

export function deleteall(path:string) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteall(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

export function formatDate(date:Date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
      (mymonth as any) = "0" + mymonth;
  }
  if (myweekday < 10) {
      (myweekday as any) = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);//想要什么格式都可以随便自己拼
}
