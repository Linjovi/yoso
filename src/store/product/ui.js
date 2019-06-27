NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    product,
    html,
    css
){
    /**
     * product UI组件
     *
     * @class  
     * @extends module:
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return product.$extends({
        name     : 'product',
        css      : css,
        template : html
    });
});
