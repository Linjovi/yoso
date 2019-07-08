import { directoryTree } from "../utils/fileTree";
import * as PATH from "path";
var filePath = PATH.dirname(__dirname); //yoso根目录
describe("fileTree 测试", () => {
  it("fileTree", () => {
    var res = new Set();
    directoryTree(filePath + "/test/test_data", res);
    expect(res).toEqual(
      new Set([
        { url: "../../opensource/yoso/test/test_data/dir1/test.js" },
        { url: "../../opensource/yoso/test/test_data/test.js" }
      ])
    );
  });
});
