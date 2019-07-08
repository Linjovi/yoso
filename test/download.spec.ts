import { requestUrl } from "../utils/download";
import { deleteall } from "../utils/utils";
import * as fs from "fs";

describe("utils/download 测试", () => {
  
  it("download file", async () => {
    if (fs.existsSync("test/testDir/demo.js")) {
      fs.unlinkSync("test/testDir/demo.js");
    }
    await requestUrl("linjovi", "tpl-repos", "master", "test.js", "test/testDir/demo",null);
    let res = fs.existsSync("test/testDir/demo.js");
    expect(res).toBe(true);
  });

  it("download dir", async () => {
    if (fs.existsSync("test/testDir/demo")) {
      deleteall("test/testDir/demo");
    }
    await requestUrl("linjovi", "tpl-repos", "master", "nej", "test/testDir/demo",null);
    let res = fs.existsSync("test/testDir/demo/component.html");
    expect(res).toBe(true);
  });

  it("download duplication dir", async () => {
    if (fs.existsSync("test/testDir/test")) {
      deleteall("test/testDir/test");
    }
    if (fs.existsSync("test/testDir/test.js")) {
      deleteall("test/testDir/test.js");
    }
    await requestUrl("linjovi", "tpl-repos", "master", "test", "test/testDir/test",null);
    let res = fs.existsSync("test/testDir/test/test1.js") && !fs.existsSync("test/testDir/test.js");
    expect(res).toBe(true);
  });

});
