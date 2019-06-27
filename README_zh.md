## YOSO[![npm](https://img.shields.io/npm/v/yoso.svg?maxAge=2592000)](https://www.npmjs.com/package/yoso)
这是一个根据自定义模板自动生成文件的命令行工具。只需要设置一次，就可以重复使用。

## 安装

```bash
$ npm install -g yoso
```
## 使用

#### 前置

首先编写你自己的模板文件。这里是用的模板引擎是nunjucks，相关语法参考[nunjucks官网](https://nunjucks.bootcss.com/)。你可以将多个模板文件按照一定的文件结构放在一个文件夹中，也可以放置一个单独的文件。模板文件的后缀名直接用你希望的后缀名。
例如
```
component
├── component.html
├── component.js
├── component.scss
└── ui.js
vue-ts.vue
vuex.ts
```

如果要从github仓库中加载模板文件，你需要先设置github仓库的信息。包括用户名，仓库名，分支名（默认master），token（非必需，但是github对于未经身份验证的请求，会限制每小时最多60次请求）。
```bash
$ yoso config
```

#### 加载

1. 从本地模板加载
```bash
$ yoso new [options] <tpl> <path>
```
例如
```bash
$ yoso new vuex src/store/demo 
```

2. 从github仓库加载
```bash
$ yoso init [options] <tpl> [path]
```
例如
```bash
$ yoso init vuex src/store/demo
```

可以使用命令行参数```-o```或```--others```，添加自定义字段，插到模板中的对应位置。默认包含的字段有：
```
{
  name,//从输入的 path 中获得
  author,//从 git config 中获得
  email,//从 git config 中获得
}
```
可以使用同名自定义字段覆盖默认字段。

