"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Welcome_1 = require("../component/Welcome");
const React = require("react");
const ink_1 = require("ink");
exports.indexView = () => {
    ink_1.render(React.createElement(Welcome_1.Welcome, null));
};
