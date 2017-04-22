var ParamParser = require('./param-parser');
var postJson = require('./post-json');
var VideoUpload = require('./video-upload');
var UIRoot = require('./components/root');
var UIVideo = require('./components/root');

var noop = function(){};

function BCUploader(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof BCUploader)) {
    return new BCUploader(params);
  }

  var param = ParamParser('BCUploader', params);

  // required parameters
  this.createVideoEndpoint = param.required('createVideoEndpoint');
  this.signUploadEndpoint = param.required('signUploadEndpoint');
  this.ingestUploadEndpoint = param.required('ingestUploadEndpoint');
  this.root = param.required('root');

  // optional callbacks
  this.onProgress = param.optional('onProgress', noop);
  this.onStarted =  param.optional('onStarted', noop);
  this.onComplete =  param.optional('onComplete', noop);
  this.onUploadInitiated =  param.optional('onUploadInitiated', noop);
  this.onError =  param.optional('onError', noop);

  // optional UI config
  this.landingText = param.optional('landingText', 'Drag Video Uploads Here');

  // wire up the UI and wait for user interaction
  this.rootEl = document.getElementById(this.root);
  this.ui = new UIRoot({
    landingText: this.landingText,
    onFileSelected: (function(event) {
      // TODO -- provide user callbacks to asynchronously validate the file selected
      // TODO -- upload ALL file inputs
      // TODO -- figure out how to create the UIVideo components...
      this.createVideo(event.target.files[0]);
    }).bind(this)
  });
  this.rootEl.innerHTML = '';
  this.rootEl.appendChild(this.ui.render());
}

BCUploader.prototype.createVideo = function createVideo(file) {
  var self = this;

  return postJson(this.createVideoEndpoint, {name: file.name})
    .then(function(response) {
      return new VideoUpload(file, response, self);
    });
};

module.exports = BCUploader;
