// Landing Component
// =================
//
// This class is responsible to render the main UI area and listen for drag n' drops and file picker selections.
// UILanding hooks into the methods on this class to manage and coordinate state there.

function UILanding(params) {
  // Protect against forgetting the new keyword when instantiating objects
  if (!(this instanceof UILanding)) {
    return new UILanding(params);
  }

  this.text = params.text;
  this.onFileSelected = params.onFileSelected;

  this.node = document.createElement('form');
}

// Converts DOM event into onFileSelected event for each file picked
UILanding.prototype.onchange = function onchange(event) {
  var files = Array.prototype.slice.apply(event.target.files);
  var self = this;
  files.forEach(function(file) {
    self.onFileSelected(file);
  });
};

UILanding.prototype.render = function render() {
  this.node.innerHTML = '';
  this.node.classList.add('bcuploader-landing');

  var heading = document.createElement('span');
  heading.classList.add('bcuploader-landing_heading');
  heading.innerHTML = this.text;
  this.node.appendChild(heading);

  // TODO -- create drag n drop area

  var input = document.createElement('input');
  input.type = 'file';
  input.classList.add('bcuploader-landing_file-input');
  input.onchange = this.onchange.bind(this);
  this.node.appendChild(input);

  return this.node;
};

module.exports = UILanding;
