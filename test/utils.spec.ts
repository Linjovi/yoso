import { rename, generateFileFromTpl,readConfig } from "../utils/utils";
var currentPath = process.cwd();

describe("utils/rename 测试", () => {

  it("rename dir", () =>
    expect(rename("nej/test.js", "demo")).toBe(currentPath + "/demo/test.js"));

  it("rename file", () =>
    expect(rename("test.js", "demo")).toBe(currentPath + "/demo.js"));
});

describe("utils/readConfig 测试", () => {

  it("readConfig", () =>
    expect(rename("nej/test.js", "demo")).toBe(currentPath + "/demo/test.js"));

});
