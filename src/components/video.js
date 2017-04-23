// Video Component
// ===============
//
// This components communicates progress on a single video upload to the user. It's the single most complex
// visual component.

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

  this.name = params.name || '[Unnamed video upload]';
  this.state = uiStates.pending;
  this.percent = 0;
  this.transcodingDelayMS = params.transcodingDelayMS;
  this.previewText = params.previewText;
  this.onPreview = params.onPreview;

  this.node = document.createElement('div');
}

UIVideo.prototype.states = uiStates;

UIVideo.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.className = 'bcuploader-video is-' + this.state;

  var fileName = document.createElement('span');
  fileName.classList.add('bcuploader-video_file-name');
  fileName.innerHTML = this.name;
  this.node.appendChild(fileName);

  var label = document.createElement('span');
  switch (this.state) {
    case this.states.progress:
      label.classList.add('bcuploader-video_percent');
      label.innerHTML = this.percent + '%';
      break;
    case this.states.transcoding:
      label.classList.add('bcuploader-video_transcoding');
      label.innerHTML = 'Transcoding';
      break;
    case this.states.preview:
      label.classList.add('bcuploader-video_preview');
      label.onclick = this.onPreview;
      label.innerHTML = this.previewText;
      break;
    case this.states.error:
      label.classList.add('bcuploader-video_error');
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

module.exports = UIVideo;
