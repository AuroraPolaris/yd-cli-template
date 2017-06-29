const fs = require('fs');
const path = require('path')
const crypto = require('crypto');


const STATIC_FILE = /\.(min\.js|eot|svg|ttf|woff|woff2|png|jpe?g|gif|svg)(\?\S*)?$/;
const IS_COMMON = /\/common\//;

const FILE_CACHE = {};


module.exports = function () {
  return function(file, next, done) {
    const ext =  path.parse(file.path).ext;
    if (STATIC_FILE.test(file.path) || IS_COMMON.test(file.path)) {
      let readStream;
      try {
        readStream = fs.createReadStream(file.path);
      } catch (err) {
        return done(new Error(err));
      }
      let result = '';
      readStream.on('data', function (chunk) {
        result += chunk;
      })
      readStream.on('end', function () {
        file.content = result;
        return done(file);
      })
      return
    }

    let content;
    try {
      content = fs.readFileSync(file.path);
    } catch (err) {
      return done(new Error(err));
    }
    const hash = crypto.createHash('md5');
    // 对文件原始内容做md5
    const md5 = hash.update(content).digest('hex');
    const cacheFile = FILE_CACHE[md5];
    if ( cacheFile && cacheFile.done ) {
      return done(cacheFile);
    }
    file.content = content;
    FILE_CACHE[md5] = file;
    next(file);
  }
}
