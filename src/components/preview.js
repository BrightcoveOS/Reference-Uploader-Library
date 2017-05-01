function UIPreview() {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UIPreview)) {
    return new UIPreview();
  }

  this.state = 'hidden';
  this.node = document.createElement('div');
}

UIPreview.prototype.update = function update(params) {
  this.accountId = params.accountId;
  this.videoId = params.videoId;
  this.playerId = params.playerId;
  this.fileName = params.fileName;
  this.state = 'shown';

  this.render();
};

UIPreview.prototype.hide = function hide() {
  this.state = 'hidden';
  this.render();
};

UIPreview.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.className = 'bcuploader-preview is-' + this.state;

  if (this.state === 'shown') {
    var playerUrl = '//players.brightcove.net/' + this.accountId + '/' + this.playerId + '_default/index.html?videoId=' + this.videoId;
    this.node.innerHTML = '<iframe src="' + playerUrl + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

    var closeButton = document.createElement('span');
    closeButton.className = 'bcuploader-preview_close-button';
    closeButton.innerHTML = 'X';
    closeButton.onclick = this.hide.bind(this);
    this.node.appendChild(closeButton);
  }

  return this.node;
};

module.exports = UIPreview;
