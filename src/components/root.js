// Root Component
// =================
//
// This class is a container for the other UI components. UIRoot tells this class what to render and where.

var UILanding = require('./landing');
var UIPreview = require('./preview');
var UIError = require('./error');

function UIRoot(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UIRoot)) {
    return new UIRoot(params);
  }

  this.node = document.createElement('div');
  this.landing = new UILanding({
    text: params.landingText,
    onFileSelected: params.onFileSelected,
  });
  this.preview = new UIPreview({});
  this.videos = [];
  this.error = new UIError({});
}

UIRoot.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.className = 'bcuploader-root';

  this.node.appendChild(this.error.render());
  this.node.appendChild(this.preview.render());
  this.node.appendChild(this.landing.render());

  var videoContainer = document.createElement('div');
  videoContainer.className = 'bcuploader-video-container';
  this.videos.forEach((function(video) {
    videoContainer.appendChild(video.render());
  }).bind(this));
  this.node.appendChild(videoContainer);

  return this.node;
};

UIRoot.prototype.addVideo = function addVideo(video) {
  this.videos.push(video);
  this.render();
};

UIRoot.prototype.showError = function showError(message) {
  this.error.showMessage(message);
  this.render();
};

module.exports = UIRoot;
