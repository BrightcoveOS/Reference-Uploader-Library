var Evaporate = require('evaporate');
var AWS = require('aws-sdk');

var ParamParser = require('./param-parser');
var postJson = require('./post-json');
var UIVideo = require('./components/video');

function VideoUpload(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof VideoUpload)) {
    return new VideoUpload(params);
  }

  var param = ParamParser('VideoUpload', params);

  // AWS Entities
  this.awsAccessKeyId = param.required('awsAccessKeyId');
  this.bucket = param.required('bucket');
  this.objectKey = param.required('objectKey');
  this.region = param.required('region');

  // Brightcove entities
  this.videoId = param.required('videoId');
  this.accountId = param.required('accountId');

  // Configure core upload logic
  this.file = param.required('file');
  this.signerUrl = param.required('signUploadEndpoint') + '/' + this.videoId;
  this.ingestUrl = param.required('ingestUploadEndpoint') + '/' + this.videoId;

  // Create UI element to represent upload
  this.ui = new UIVideo({
    name: this.file.name,
  });

  // Callbacks -- should be defaulted in BCUploader
  // TODO -- hook these all events up to UIVideo
    // TODO -- make sure the these callbacks are all bound properly!
  this.onError = param.required('onError');
  this.onStarted = param.required('onStarted');
  this.onCompleted = param.required('onComplete');
  this.onUploadInitiated = param.required('onUploadInitiated');
  this.onProgress = param.required('onProgress');

  // Start evaporate!
  this.prepareUpload();
}

VideoUpload.prototype.prepareUpload = function prepareUpload() {
  return Evaporate.create({
    signerUrl: this.signerUrl,
    region: this.region,
    aws_key: this.awsAccessKeyId,
    awsRegion: this.region,
    bucket: this.bucket,
    awsSignatureVersion: '4',
    computeContentMd5: true,
    cryptoMd5Method: function (data) { return AWS.util.crypto.md5(data, 'base64'); },
    cryptoHexEncodedHash256: function (data) { return AWS.util.crypto.sha256(data, 'hex'); },
  })
  .then(this.startUpload.bind(this));
};

VideoUpload.prototype.startUpload = function startUpload(evap) {
  evap.add({
    name: this.objectKey,
    file: this.file,
    error: this.onError,
    started: this.onStarted,
    complete: this.onCompleted,
    uploadInitiated: this.onUploadInitiated,
    progress: this.onProgress,
  })
  .then(this.ingest.bind(this));
};

VideoUpload.prototype.ingest = function ingest() {
  return postJson(this.ingestUrl, {
    bucket: this.bucket,
    objectKey: this.objectKey,
  });
};

module.exports = VideoUpload;
