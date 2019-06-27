NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    {{name}},
    html,
    css
){
    /**
     * {{name}} UI组件
     *
     * @class  
     * @extends module:
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return {{name}}.$extends({
        name     : '{{name}}',
        css      : css,
        template : html
    });
});
