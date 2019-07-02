import { mkdirsSync, generateFileFromTpl, rename } from "./utils";
import Request from "./request";
import * as path from "path";
import * as ProgressBar from "progress";
import * as logSymbols from "log-symbols";
import chalk from "chalk";
import ora from "ora";
let spinner: any = null; // loading animate
let bar: any = null; // loading bar

/**
 * @desc request api get file tree
 * @param {String} username
 * @param {String} repo
 * @param {String} branch
 * @param {String} download
 */
export async function requestUrl(
  username: string,
  repo: string,
  branch: string,
  download: string,
  filePath: string,
  options: any
) {
  // request start
  spinner = ora("download start!").start();
  spinner.color = "yellow";
  spinner.text = "loading...";
  const url = `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    const res = await Request({ url, method: "get" });
    const data = res.data;
    const trees = data.tree;
    await handleTree(
      username,
      repo,
      branch,
      trees,
      download,
      filePath,
      options
    );
    return res;
  } catch (err) {
    spinner.stop();
  }
}

/**
 * parse response fliter
 * @param {String} username
 * @param {String} repo
 * @param {String} branch
 * @param {String} tree
 * @param {String} download
 */
async function handleTree(
  username: string,
  repo: string,
  branch: string,
  trees: [any],
  download: string,
  filePath: string,
  options: any
) {
  let fileList = trees.filter(item => {
    return item.type === "blob";
  });
  let filterList = [];

  if (download.includes(".")) {
    //有.代表一定是单个文件模板
    filterList = fileList.filter(item => {
      return item.path === download;
    });
  } else {
    //可能是单个文件或文件夹，如果有重名的，优先下载文件夹模板
    filterList = fileList.filter(item => {
      return item.path.split("/")[0] === download;
    });
    if (filterList.length === 0) {
      //没有重名文件夹，下载文件
      filterList = fileList.filter(item => {
        return item.path.split(".")[0] === download;
      });
    }
  }

  spinner.stop();

  if (filterList.length === 0) {
    console.log(chalk.red(`cannot found template '${download}'!`));
    return;
  }
  // request list is ready

  bar = new ProgressBar(":bar :current/:total", {
    total: filterList.length
  });
  await Promise.all(
    filterList.map(async item => {
      await downloadFile(username, repo, branch, item.path, filePath, options);
      return item;
    })
  );
}

/**
 * @param {String} username
 * @param {String} repo
 * @param {String} branch
 * @param {String} url
 */
export async function downloadFile(
  username: string,
  repo: string,
  branch: string,
  url: string,
  filePath: string,
  options: any
) {
  // rename
  const exportUrl = rename(url, filePath);
  const dir = path.dirname(exportUrl);
  // mkdir
  mkdirsSync(dir);
  // console.log(dir)
  //download
  try {
    const res = await Request({
      url: `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${url}`,
      method: "get"
    });
    generateFileFromTpl(res.data, options, exportUrl);
    bar.tick();
    if (bar.complete) {
      console.log(
        logSymbols.success,
        chalk.green(`${repo} all files download!`)
      );
    }
    return res;
  } catch (err) {
    console.log(logSymbols.error, chalk.red(`${url} is error`));
    return;
  }
}
