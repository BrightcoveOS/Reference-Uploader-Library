// Video Component
// ===============
//
// This components communicates progress on a single video upload to the user. It's the single most complex
// visual component.

var defaultPreviewAction = require('./default-preview').defaultPreviewAction;

var uiStates = {
  'pending': 'pending',
  'started': 'started',
  'progress': 'progress',
  'transcoding': 'transcoding',
  'preview': 'preview',
  'error': 'error',
};

function UIVideo(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UIVideo)) {
    return new UIVideo(params);
  }

  this.state = uiStates.pending;
  this.percent = 0;
  this.fileName = params.fileName;

  this.transcodingText = params.transcodingText;
  this.transcodingDelayMS = params.transcodingDelayMS;

  this.previewText = params.previewText;
  this.onPreview = params.onPreview;
  this.previewContext = {
    fileName: params.fileName,
    fileSize: params.fileSize,
    playerId: params.playerId, // Maybe null!
    updatePreview: params.updatePreview,
    defaultPreviewAction: defaultPreviewAction,
    videoId: params.videoId,
    accountId: params.accountId,
    rootElement: params.rootElement
  };

  this.node = document.createElement('div');
}

UIVideo.prototype.states = uiStates;

UIVideo.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.className = 'bcuploader-video is-' + this.state;

  var fileName = document.createElement('span');
  fileName.className = 'bcuploader-video_file-name';
  fileName.innerHTML = this.fileName;
  this.node.appendChild(fileName);

  var label = document.createElement('span');
  label.className = 'bcuploader-video_label';
  switch (this.state) {
    case this.states.progress:
      var progressBar = document.createElement('span');
      progressBar.style.width = this.percent + '%';
      progressBar.className = 'bcuploader-video_progress-bar';
      this.node.appendChild(progressBar);
      label.innerHTML = this.percent + '%';
      break;
    case this.states.transcoding:
      label.innerHTML = this.transcodingText;
      break;
    case this.states.preview:
      label.onclick = this.onclick.bind(this);
      label.innerHTML = this.previewText;
      break;
    case this.states.error:
      label.innerHTML = 'Error';
      break;
  }
  if (label.innerHTML) this.node.appendChild(label);

  return this.node;
};

UIVideo.prototype.setState = function setState(state, percent) {
  // Validate input
  if (typeof uiStates[state] === undefined) {
    throw new Error('Invalid UIVideo state "' + state + '". ' +
      'Valid states are: ' + Object.keys(uiStates).join(','));
  }

  this.state = uiStates[state];

  // Perform extra state-specific logic
  switch (this.state) {
    case uiStates.progress:
      this.percent = percent;
      break;
    case uiStates.transcoding:
      setTimeout((function() {
        this.setState(uiStates.preview);
      }).bind(this), this.transcodingDelayMS);
      break;
  }

  this.render();
};

UIVideo.prototype.onclick = function onclick(event) {
  var context = Object.assign({}, this.previewContext, {event: event});
  this.onPreview(context);
};

module.exports = UIVideo;
