var Evaporate = require('evaporate');
var AWS = require('aws-sdk');

var ParamParser = require('./param-parser');
var postJson = require('./post-json');

function VideoUpload(file, params, bcuploader) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof VideoUpload)) {
    return new VideoUpload(params);
  }

  var param = ParamParser('VideoUpload', params);

  // Browser config
  this.bcuploader = bcuploader;
  this.file = file;

  // AWS Entities
  this.awsAccessKeyId = param.required('awsAccessKeyId');
  this.bucket = param.required('bucket');
  this.objectKey = param.required('objectKey');
  this.region = param.required('region');

  // Brightcove API entities
  this.videoId = param.required('videoId');
  this.accountId = param.required('accountId');

  // Start evaporating the file to S3
  this.startUpload();
}

VideoUpload.prototype.startUpload = function startUpload() {
  var self = this;

  var addConfig = {
    name: this.objectKey,
    file: this.file,
    error: this.bcuploader.onError,
    started: this.bcuploader.onStarted,
    complete: this.bcuploader.onComplete,
    uploadInitiated: this.bcuploader.onUploadInitiated,
    progress: this.bcuploader.onProgress,
  };

  return Evaporate.create({
    signerUrl: this.bcuploader.signUploadEndpoint + '/' + this.videoId,
    region: this.region,
    aws_key: this.awsAccessKeyId,
    awsRegion: this.region,
    bucket: this.bucket,
    awsSignatureVersion: '4',
    computeContentMd5: true,
    cryptoMd5Method: function (data) { return AWS.util.crypto.md5(data, 'base64'); },
    cryptoHexEncodedHash256: function (data) { return AWS.util.crypto.sha256(data, 'hex'); }
  })
  .then(function (evap) {
    return evap.add(addConfig);
  })
  .then(function() {
    return self.ingest();
  });
};

VideoUpload.prototype.ingest = function ingest() {
  var ingestUrl = this.bcuploader.ingestUploadEndpoint + '/' + this.videoId;
  return postJson(ingestUrl, {
    bucket: this.bucket,
    objectKey: this.objectKey,
  });
};

module.exports = VideoUpload;
