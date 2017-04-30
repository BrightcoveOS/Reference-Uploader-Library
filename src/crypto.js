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

function _hash(algorithm, data, digest) {
  var hash = crypto.createHash(algorithm);

  if (typeof data === 'string') {
    data = new Buffer(data);
  }
  var isBuffer = Buffer.isBuffer(data);

  //Identifying objects with an ArrayBuffer as buffers
  if (typeof ArrayBuffer !== 'undefined' && data && data.buffer instanceof ArrayBuffer) {
    isBuffer = true;
  }

  if (typeof data === 'object' && !isBuffer) {
    data = new Buffer(new Uint8Array(data));
  }

  return hash.update(data).digest(digest);
}

module.exports = {
  md5: md5,
  sha256: sha256
};
