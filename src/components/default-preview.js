function defaultPreviewAction(context) {
  var preview = new UIPreview(context);

  context.rootElement.appendChild(preview.render());
}

function UIPreview(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UIPreview)) {
    return new UIPreview(params);
  }

  this.accountId = params.accountId;
  this.videoId = params.videoId;
  this.playerId = params.previewPlayerId;
  this.fileName = params.fileName;
  this.node = document.createElement('div');
}

UIPreview.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.className = 'bcuploader-preview';

  this.node.innerHTML = '<iframe src="//players.brightcove.net/' + this.accountId + '/default_default/index.html?videoId=' + this.videoId + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

  return this.node;
};

module.exports = {
  defaultPreviewAction: defaultPreviewAction
};
