// Error Component
// ===============
//
// This class is responsible to display generic errors related to whole uploader.

function UIError(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UIError)) {
    return new UIError(params);
  }

  this.message = null;
  this.hidden = true;
}

UIError.prototype.showMessage = function showMessage(message) {
  this.hidden = false;
  this.message = message.toString();
  this.render();
};

UIError.prototype.render = function render() {
  var el = document.createElement('div');
  el.className = 'bcuploader-error is-' + (this.hidden ? 'hidden' : 'shown');

  if (this.message) {
    el.innerHTML = this.message.toString();
  }

  return el;
};

module.exports = UIError;
