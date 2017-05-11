var Evaporate = require('evaporate');

var md5 = require('./crypto').md5;
var sha256 = require('./crypto').sha256;
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
  this.sessionToken = param.required('sessionToken');
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

  // Configure misc Evaporate options
  this.logging = param.required('logging');
  this.overrides = param.required('overrides');

  // Create UI element to represent upload
  this.completed = false;
  this.ui = new UIVideo(Object.assign(params.ui, {
    fileName: this.file.name,
    fileSize: this.file.size,
    videoId: this.videoId,
    accountId: this.accountId
  }));

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
  return Evaporate.create(Object.assign({
    signerUrl: this.signerUrl,
    region: this.region,
    aws_key: this.awsAccessKeyId,
    awsRegion: this.region,
    bucket: this.bucket,
    awsSignatureVersion: '4',
    computeContentMd5: true,
    sendCanonicalRequestToSignerUrl: true,
    logging: this.logging,
    cryptoMd5Method: md5,
    cryptoHexEncodedHash256: sha256,
  }, this.overrides))
  .then(this.startUpload.bind(this));
};

VideoUpload.prototype.started = function started() {
  this.ui.setState(this.ui.states.started);
  this.onStarted.apply(this, arguments);
};

VideoUpload.prototype.progress = function progress(percent) {
  // TODO -- expose the transfer speed stats somehow
  // FYI -- Evaporate calls onProgress AGAIN after calling onComplete :doh:
  if (!this.completed) {
    percent = Math.floor(percent * 100);
    this.ui.setState(this.ui.states.progress, percent);
    this.onProgress.apply(this, arguments);
  }
};

VideoUpload.prototype.complete = function complete() {
  this.completed = true;
  this.ui.setState(this.ui.states.transcoding);
  this.onCompleted.apply(this, arguments);
};

VideoUpload.prototype.error = function error() {
  this.ui.setState(this.ui.states.error);
  this.onError.apply(this, arguments);
};

VideoUpload.prototype.startUpload = function startUpload(evap) {
  evap.add({
    name: this.objectKey,
    file: this.file,
    error: this.error.bind(this),
    started: this.started.bind(this),
    complete: this.complete.bind(this),
    uploadInitiated: this.onUploadInitiated,
    progress: this.progress.bind(this),
    xAmzHeadersAtInitiate: {
      'X-Amz-Security-Token': this.sessionToken,
    },
    xAmzHeadersCommon: {
      'X-Amz-Security-Token': this.sessionToken,
    },
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
