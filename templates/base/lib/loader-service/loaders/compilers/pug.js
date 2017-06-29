
module.exports = function (code, filePath, options = {}) {
  const pug = require('pug');
  try{
    if (options.html){
      return pug.compile(code, options)
    } else {
      return pug.compileClient(code, options)
    }
  } catch (e) {
    return e.toString()
  }
}
