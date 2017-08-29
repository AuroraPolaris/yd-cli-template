const path = require('path');

const umd = (function (factory) {
  if (typeof define === 'function') {
    define(factory)
  } else {
    factory();
  }
}).toString();

/*
const umdTemplate = `(function (factory) {
  if (typeof define === 'function') {
    define(factory);
  } else {
    factory();
  }
})(function(require, exports, module){
{{code}}
});`;
*/

module.exports = function () {
  return function (file, next, done) {
    if (!file.content || path.parse(file.path).ext !== '.js') {
      return next(file)
    }
    var contentString = file.content.toString();
    // 废掉内部的 umd define
    file.content = '(' + umd + ')(function(require, exports, module){var define = undefined;\n' + contentString + '\n});';
    //var b = umdTemplate.replace('{{code}}', contentString)
    //console.log(a.substr(0, 100) == b.substr(0, 100))
    next(file)
  }
}
