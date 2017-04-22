var Evaporate = require('evaporate');
var Hashes = require('jshashes');
var AWS = require('aws-sdk');

var noop = function(){};

function MissingParamError(param) {
  this.name = 'MissingParamError';
  this.message = 'A required parameter "' + param + '" was not provided in the constructor to BCUploader.';
  // TODO: Add link to documentation in error message
  this.stack = new Error().stack;
}
MissingParamError.prototype = Error.prototype;

function BCUploader(params) {
  if (typeof params.createVideoEndpoint === 'undefined') throw new MissingParamError('createVideoEndpoint');
  if (typeof params.signUploadEndpoint === 'undefined') throw new MissingParamError('signUploadEndpoint');
  if (typeof params.ingestUploadEndpoint === 'undefined') throw new MissingParamError('ingestUploadEndpoint');
  if (typeof params.root === 'undefined') throw new MissingParamError('root');

  this.createVideoEndpoint = params.createVideoEndpoint;
  this.signUploadEndpoint = params.signUploadEndpoint;
  this.ingestUploadEndpoint = params.ingestUploadEndpoint;
  this.root = params.root;

  setupDom(this);
}

function setupDom(bcuploader) {
  var form = document.createElement('form');
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = function(evt) {
    console.log(evt);
  };
  form.appendChild(fileInput);
  document.getElementById(bcuploader.root).appendChild(form);
}

function foo() {

  return startBrightcoveDI(createVideoEndpoint, file.name)
    .then(function(response) {
      // TODO: make this overrideable
      var defaultConfig = {
        onProgress: noop,
        onStarted: noop,
        onComplete: noop,
        onUploadInitiated: noop,
        onError: noop
      };

      var serverConfig = {
        // AWS API entities
        awsAccessKeyId: response.awsAccessKeyId,
        bucket: response.bucket,
        objectKey: response.objectKey,
        region: response.region,

        // Brightcove API entities
        videoId: response.videoId,
        accountId: response.accountId
      };

      var browserConfig = {
        file: file,
        uploadUrl: createVideoEndpoint,
        signerUrl: signUploadEndpoint,
        ingestUrl: ingestUploadEndpoint,
      };

      // Merge config together
      config = Object.assign({}, defaultConfig, serverConfig, browserConfig);

      return startS3Upload(config);
    })
    .then(function () {
      return ingestAsset(config);
    })
    .then(function () {
      return embedPlayer(config.accountId, config.videoId);
    });
}

BCUploader.sha256 = function sha256(data) {
  return new Hashes.SHA256().hex(data);
};

BCUploader.md5 = function md5(data) {
  return new Hashes.MD5().b64(data);
};

function startBrightcoveDI(uploadUrl, fileName) {
  return new Promise(function(resolve, reject) {
    return postJson(uploadUrl, {name: fileName})
      .then(resolve)
      .catch(reject);
  });
}

function startS3Upload(config) {
  return new Promise(function(resolve, reject) {
    Evaporate.create({
      signerUrl: config.signerUrl + '/' + config.videoId,
      aws_key: config.awsAccessKeyId,
      awsRegion: config.region,
      bucket: config.bucket,
      awsSignatureVersion: '4',
      computeContentMd5: true,
      cryptoMd5Method: function (data) { return AWS.util.crypto.md5(data, 'base64'); },
      cryptoHexEncodedHash256: function (data) { return AWS.util.crypto.sha256(data, 'hex'); }
    })
    .then(function (evap) {
      return evap.add({
        name: config.objectKey,
        file: config.file,
        error: config.onError,
        started: config.onStarted,
        complete: config.onComplete,
        uploadInitiated: config.onUploadInitiated,
        progress: config.onProgress,
      });
    })
    .then(resolve)
    .catch(reject);
  });
}

function ingestAsset(config) {
  var ingestUrl = config.ingestUrl + '/' + config.videoId;
  return postJson(ingestUrl, {
    bucket: config.bucket,
    objectKey: config.objectKey,
  });
}

function embedPlayer(accountId, videoId) {
  return new Promise(function (resolve) {
    var iframe = document.createElement('div');
    iframe.innerHTML = '<iframe src="//players.brightcove.net/' + accountId + '/default_default/index.html?videoId=' + videoId + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
    iframe.innerHTML += '<code>&lt;iframe src="//players.brightcove.net/' + accountId + '/default_default/index.html?videoId=' + videoId + '" allowfullscreen webkitallowfullscreen mozallowfullscreen&gt;&lt;/iframe&gt;';
    iframe.innerHTML += '<a href="//players.brightcove.net/' + accountId + '/default_default/index.html?videoId=' + videoId + '">View in Player</a>';
    document.getElementsByTagName('body')[0].appendChild(iframe);
    resolve();
  });
}

function postJson(url, body) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(JSON.parse(this.response));
        } else {
          reject(this);
        }
      }
    };
    xhr.send(JSON.stringify(body));
  });
}

module.exports = BCUploader;
