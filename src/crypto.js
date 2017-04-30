// Lovingly borrowed and adapted from aws-sdk/lib/utils.js
// for file size reasons.

var crypto = require('crypto-browserify');
var Buffer = require('buffer/').Buffer;

function md5(data) {
  return _hash('md5', data, 'base64');
}

function sha256(data) {
  return _hash('sha256', data, 'hex');
}

function arraySliceFn(obj) {
  var fn = obj.slice || obj.webkitSlice || obj.mozSlice;
  return typeof fn === 'function' ? fn : null;
}

function _hash(algorithm, data, digest, callback) {
  var hash = crypto.createHash(algorithm);

  if (!digest) { digest = 'binary'; }
  if (digest === 'buffer') { digest = undefined; }
  if (typeof data === 'string') { data = new Buffer(data); }
  var sliceFn = arraySliceFn(data);
  var isBuffer = Buffer.isBuffer(data);

  //Identifying objects with an ArrayBuffer as buffers
  if (typeof ArrayBuffer !== 'undefined' && data && data.buffer instanceof ArrayBuffer) {
    isBuffer = true;
  }

  if (callback && typeof data === 'object' && typeof data.on === 'function' && !isBuffer) {
    data.on('data', function(chunk) { hash.update(chunk); });
    data.on('error', function(err) { callback(err); });
    data.on('end', function() { callback(null, hash.digest(digest)); });

  } else if (callback && sliceFn && !isBuffer && typeof FileReader !== 'undefined') {
    // this might be a File/Blob
    var index = 0, size = 1024 * 512;
    var reader = new FileReader();

    reader.onerror = function() {
      callback(new Error('Failed to read data.'));
    };

    reader.onload = function() {
      var buf = new Buffer(new Uint8Array(reader.result));
      hash.update(buf);
      index += buf.length;
      reader._continueReading();
    };

    reader._continueReading = function() {
      if (index >= data.size) {
        return callback(null, hash.digest(digest));
      }

      var back = index + size;
      if (back > data.size) { back = data.size; }
      reader.readAsArrayBuffer(sliceFn.call(data, index, back));
    };

    reader._continueReading();
  } else {
    if (typeof data === 'object' && !isBuffer) {
      data = new Buffer(new Uint8Array(data));
    }
    var out = hash.update(data).digest(digest);
    if (callback) { callback(null, out); }
    return out;
  }
}

module.exports = {
  md5: md5,
  sha256: sha256
};
