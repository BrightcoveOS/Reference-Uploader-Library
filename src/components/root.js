// Root Component
// =================
//
// This class is a container for the other UI components. UIRoot tells this class what to render and where.

var UILanding = require('./landing');

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
  this.videos = [];
}

UIRoot.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.classList.add('bcuploader-root');

  this.node.appendChild(this.landing.render());
  this.videos.forEach((function(video) {
    this.node.appendChild(video.render());
  }).bind(this));

  return this.node;
};

UIRoot.prototype.addVideo = function addVideo(video) {
  this.videos.push(video);
  this.render();
};

module.exports = UIRoot;
