// Video Component
// ===============
//
// This components communicates progress on a single video upload to the user. It's the single most complex
// visual component.

var uiVideoStates = {
  'initial': 'initial',
};

function UIVideo(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UIVideo)) {
    return new UIVideo(params);
  }

  this.name = params.name || '[Unnamed video upload]';
  this.state = uiVideoStates.initial;

  this.node = document.createElement('div');
}

UIVideo.prototype.states = uiVideoStates;

UIVideo.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.classList.add('bcuploader-video', 'is-' + this.state);

  var fileName = document.createElement('span');
  fileName.classList.add('bcuploader-video_file-name');
  fileName.innerHTML = this.name;
  this.node.appendChild(fileName);

  // TODO add state-specific rendering logic here

  return this.node;
};

module.exports = UIVideo;
