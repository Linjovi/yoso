import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as ini from "ini";
import { yosoConfig } from "../actions/action.input";
import { mkdirsSync } from "./utils";

const yosoPath = `${process.env.HOME}/.yoso`

export function getGitPath(type?: any, options?: any): any {
  if (typeof type !== "string") {
    options = type;
    type = null;
  }

  let opts = Object.assign({ cwd: process.cwd(), type }, options);
  let configPath;

  if (opts.type === "global") {
    configPath = path.join(os.homedir(), ".gitconfig");
  } else {
    configPath = path.resolve(opts.cwd, ".git/config");
  }

  if (!fs.existsSync(configPath)) {
    if (typeof opts.type === "string") return null;
    configPath = path.join(os.homedir(), ".config/git/config");
  }

  return fs.existsSync(configPath) ? configPath : null;
}

export function getGitInfo() {
  const proPath = getGitPath();
  const globalPath = getGitPath("global");

  let proInfo = proPath ? ini.parse(fs.readFileSync(proPath).toString()) : {};
  let globalInfo = globalPath
    ? ini.parse(fs.readFileSync(globalPath).toString())
    : {};
  let name: string = "";
  let email: string = "";
  if (globalInfo.user && globalInfo.user.name) {
    name = globalInfo.user.name;
  }
  if (proInfo.user && proInfo.user.name) {
    name = proInfo.user.name;
  }
  if (globalInfo.user && globalInfo.user.email) {
    email = globalInfo.user.email;
  }
  if (proInfo.user && proInfo.user.email) {
    email = proInfo.user.email;
  }
  return {
    name: name,
    email: email
  };
}

export function readConfig(): yosoConfig {
  const configPath = path.join(yosoPath,'.yosoconfig');
  if (!fs.existsSync(configPath)) {
    mkdirsSync(yosoPath)
    fs.writeFileSync(
      configPath,
      '{"username":"","repo":"","branch":"master","token":""}'
    );
  }
  var config = JSON.parse(fs.readFileSync(configPath).toString());

  return config;
}
