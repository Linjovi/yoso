import { rename } from "../utils/utils";
var currentPath = process.cwd();

describe("utils/rename 测试", () => {
  // jest 自带断言库
  it("rename dir", () =>
    expect(rename("nej/test.js", "demo")).toBe(currentPath + "/demo/test.js"));

  it("rename file", () =>
    expect(rename("test.js", "demo")).toBe(currentPath + "/demo.js"));
});
