var ParamParser = require('./param-parser');
var postJson = require('./post-json');
var VideoUpload = require('./video-upload');
var UIRoot = require('./components/root');
var defaultPreviewAction = require('./components/default-preview').defaultPreviewAction;

var noop = function(){};

function BCUploader(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof BCUploader)) {
    return new BCUploader(params);
  }

  var param = ParamParser('BCUploader', params);

  // required parameters
  this.urls = {
    createVideoEndpoint: param.required('createVideoEndpoint'),
    signUploadEndpoint: param.required('signUploadEndpoint'),
    ingestUploadEndpoint: param.required('ingestUploadEndpoint'),
  },
  this.root = param.required('root');

  // optional callbacks
  this.callbacks = {
    onProgress: param.optional('onProgress', noop),
    onStarted:  param.optional('onStarted', noop),
    onComplete:  param.optional('onComplete', noop),
    onUploadInitiated:  param.optional('onUploadInitiated', noop),
    onError:  param.optional('onError', noop),

    // onFileSelected MUST be a promise
    onFileSelected: param.optional('onFileSelected', function() {
      return Promise.resolve();
    }),
  };

  // wire up the UI and wait for user interaction
  this.landingText = param.optional('landingText', 'Drag Video Uploads Here');
  this.createVideoFailureText = param.optional(
    'createVideoFailureText',
    'Oops! We weren\'t able to upload your video to our servers. Try a different video or try again later.'
  );
  this.setupUI();

  // Video UI config
  this.videoUI = {
    previewText: param.optional('preivewText', 'Preview'),
    updatePreview: this.ui.preview.update.bind(this.ui.preview),
    onPreview: param.optional('onPreview', defaultPreviewAction),
    playerId: param.optional('playerId', 'default'),
    rootElement: this.rootElement,
    transcodingDelayMS: param.optional('transcodingDelayMS', 10000),
    transcodingText: param.optional('transcodingText', 'Transcoding'),
  };

  // optional evaporate overrides
  this.logging = param.optional('logging', false);
  this.overrides = param.optional('evaporate', {});
}

BCUploader.prototype.setupUI = function setupUI() {
  var self = this;
  this.rootElement = document.getElementById(this.root);
  this.ui = new UIRoot({
    landingText: this.landingText,
    onFileSelected: function(file) {
      self.callbacks.onFileSelected(file).then(function() {
        self.createVideo(file);
      });
    },
  });

  this.render();
};

BCUploader.prototype.render = function render() {
  this.rootElement.innerHTML = '';
  this.rootElement.appendChild(this.ui.render());
};

BCUploader.prototype.createVideo = function createVideo(file) {
  var self = this;
  return postJson(this.urls.createVideoEndpoint, {name: file.name})
    .catch(function() {
      self.ui.showError(self.createVideoFailureText);
    })
    .then(function(response) {
      var params = Object.assign(response, self.callbacks, self.urls, {
        logging: self.logging,
        file: file,
        ui: self.videoUI,
        overrides: self.overrides
      });
      var video = new VideoUpload(params);
      self.ui.addVideo(video.ui);
      return video;
    });
};

module.exports = BCUploader;
