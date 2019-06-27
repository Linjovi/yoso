import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as ini from "ini";

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
  return {
    name: proInfo.user.name || globalInfo.user.name,
    email: proInfo.user.email || globalInfo.user.email
  };
}
